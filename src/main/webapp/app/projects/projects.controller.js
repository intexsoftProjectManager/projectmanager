'use strict';
app.controller('ProjectsController', function ($rootScope, $scope, Auth, Projects, User, Socket, $filter, ngTableParams, $state, priorities) {
  $scope.hasPermissionEdit = Auth.hasPermission('Projects', 'Edit');
  $scope.hasPermissionAdd = Auth.hasPermission('Projects', 'Add');
  $scope.newProject = {};
  $scope.users = [];
  $scope.priorities = priorities;

  $scope.getUsers = function () {
    User.query(function (data) {
      var usersArray = [];
      for (var i = 0; i < data.length; i++) {
        usersArray.push({id: data[i]._id, text: data[i].name, active: data[i].active});
      }
      $scope.users = usersArray;
    });
  };

  //config select2 Users
  $scope.select2UsersOptions = {
    formatSelection: function (exercise) {
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].id === exercise.text || $scope.users[i].id === exercise.text._id) {
          return $scope.users[i].text;
        }
      }
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      var ids = $(element).val().split(",");
      var collectedJson = [];
      angular.forEach(ids, function () {
        collectedJson.push(id);
      });
      callback(collectedJson);
    },
    'multiple': true,
    'simple_tags': true,
    'tags': function () {
      return $scope.users;
    },
    createSearchChoice: function () {
      return null;
    },
    formatResult: function(state){
      if (state.active)
        return state.text;
    }
  };

  $scope.open = function (event, id) {
    event.preventDefault();
    event.stopPropagation();
    $state.go('main.projects.project',{projectId:id});
  };

  $scope.find = function (params, callback) {
    Projects.query(
        {
          count: params.count(),
          page: params.page(),
          filter: params.filter(),
          sorting: params.sorting(),
          includeUsers: false
        },
        function (projects) {
          $scope.projects = projects;
          return callback();
        });
  };

  $scope.create = function () {
    Socket.emit('create:project', $scope.newProject);
    $scope.newProject = {};
  };

  $scope.update = function () {
    var copiedObject = jQuery.extend({}, $scope.p_selected);
    delete copiedObject.$selected;
    Socket.emit('update:project', copiedObject);
  };

  Socket.on('refresh:projects', function () {
    $scope.tableParams.reload();
  });

  Socket.on('refresh:project', function (data) {
    for (var i = 0; i < $scope.projects.length; i++) {
      if ($scope.projects[i]._id === data._id) {
        $scope.projects[i] = data;
        if ($scope.p_selected._id === data._id) {
          $scope.p_selected = $scope.projects[i];
          $scope.p_selected.$selected = true;
        }
        return;
      }
    }
  });

  $scope.tableParams = new ngTableParams({
    page: 1,
    count: 10,
    sorting: {
      name: 'asc'
    }
  }, {
    total: 0,
    filterDelay: 150,
    getData: function ($defer, params) {
      $scope.find(params, function () {
        // update table params
        params.total($scope.projects[0].count);
        $defer.resolve($scope.projects.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      });
    }
  });

  $scope.$watch('tableParams.page()', function () {
    $scope.changeSelection(null);
  }, true);

  $scope.changeSelection = function (element) {
    if ($scope.p_selected && $scope.p_selected !== element) {
      $scope.p_selected.$selected = false;
      $scope.accordionGroups[0].isOpen = false;
      $scope.accordionGroups[0].isDisabled = true;
    }
    $scope.p_selected = element;
    if ($scope.p_selected) {
      $scope.accordionGroups[0].isOpen = !$scope.accordionGroups[0].isOpen;
      $scope.accordionGroups[0].isDisabled = !$scope.accordionGroups[0].isDisabled;
    }
  };

  $scope.oneAtATime = true;

  $scope.accordionGroups = [{
    isOpen: false,
    isDisabled: true
  }, {
    isOpen: false,
    isDisabled: false
  }];

});
