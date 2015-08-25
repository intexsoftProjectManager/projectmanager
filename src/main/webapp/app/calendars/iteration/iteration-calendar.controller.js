'use strict';

app.controller('IterationCalendarController', function ($scope, $http, User, Auth, IterationCalendar, Projects, Socket, priorities) {
  $scope.hasPermissionEdit = Auth.hasPermission('Iteration_Calendar', 'Edit');
  $scope.hasPermissionAdd = Auth.hasPermission('Iteration_Calendar', 'Add');
  $scope.newIteration = {};
  $scope.e_selected = {};
  $scope.users = [];
  $scope.projects = [];
  $scope.tabs = {project:{active:true, rendered:true}, user:{active:false, rendered:false}};
  $scope.eventSourcesByProject = [{
    url: "getCalendarIterationsByProject",
    type: 'GET',
    cache: false
  }];
  $scope.eventSourcesByUser = [{
    url: "getCalendarIterationsByUser",
    type: 'GET',
    cache: false
  }];

  $scope.getUsers = function () {
    User.query(function (data) {
      var usersArray = [];
      for (var i = 0; i < data.length; i++) {
        usersArray.push({id: data[i]._id, text: data[i].name});
      }
      $scope.users = usersArray;
    });
  };

  $scope.getProjects = function () {
    Projects.query(
        {
          count: 100,
          page: 1,
          filter: {name: ''},
          sorting: {name: 'asc'}
        },
        function (projects) {
          var array = [];
          for (var i = 0; i < projects.length; i++) {
            array.push({id: projects[i]._id, text: projects[i].name});
          }
          $scope.projects = array;
        });
  };

  $scope.priorities = priorities;
  $scope.dateOptions = {format: "mm/dd/yyyy", todayBtn: "linked", autoclose: true, todayHighlight: true};
  $scope.calendar = $('.calendar');
  //config select2 Users
  $scope.select2UsersOptions = {
    ajax: {
      url: "auth/users",
      quietMillis: 100,
      data: function (term) {
        return {filter: term, active:true};
      },
      results: function (data) {
        var usersArray = [];
        for (var i = 0; i < data.length; i++) {
          usersArray.push({id: data[i]._id, text: data[i].name});
        }
        return {results: usersArray};
      }
    },
    formatSelection: function (exercise) {
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].id === exercise.text) {
          return $scope.users[i].text;
        }
      }
      return exercise.text;
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      var ids = $(element).val().split(",");
      var collectedJson = [];
      angular.forEach(ids, function () {
        var response = id;
        collectedJson.push(response);
      });
      callback(collectedJson);
    },
    'multiple': true,
    'simple_tags': true
  };

  //config select2 Users
  $scope.select2ProjectsOptions = {
    ajax: {
      url: "getProjects",
      quietMillis: 100,
      data: function (term) {
        return {term: term};
      },
      results: function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          array.push({id: data[i].id, text: data[i].name});
        }
        $scope.projects = array;
        return {results: array};
      }
    },
    id: function (element) {
      return element.id;
    },
    formatSelection: function (exercise) {
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i].id === exercise) {
          return $scope.projects[i].text;
        }
      }
      return exercise;
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      var id = $(element).val() === '' && $scope.tabs.project.active ? $scope.newIteration._project : $(element).val();
      callback(id);
    }
  };

  $scope.oneAtATime = false;

  $scope.accordionGroups = [{
    isOpen: true,
    isDisabled: true
  }, {
    isOpen: true,
    isDisabled: true
  }];

  Socket.on('refresh:calendar:iteration', function () {
    if ($scope.tabs.project.active) {
      $('.calendarByProject').fullCalendar('refetchEvents');
    } else {
      $('.calendarByUser').fullCalendar('refetchEvents');
    }
  });

  Socket.on('error:calendar:iteration', function (err) {
    $scope.errors = {};
    angular.forEach(err.errors, function (error, field) {
      $scope.errors[field] = error.type;
    });
  });

  $scope.update = function () {
    var copiedObject = jQuery.extend({}, $scope.e_selected);
    delete copiedObject.$selected;
    Socket.emit('update:calendar:iteration', copiedObject);
  };

  $scope.create = function () {
    Socket.emit('create:calendar:iteration', $scope.newIteration);
    $scope.accordionGroups[1].isDisabled = true;
    $('.fc-cell-overlay').remove();
    $scope.newIteration = {};
  };

  $scope.close = function () {
    $('.fc-cell-overlay').remove();
  };

  $scope.move = function (event) {
    Socket.emit('move:calendar:iteration', {
      _id: event.id,
      startDate: event.start,
      endDate: event.end,
      _resourceId: event.resource
    });
  };

  $scope.onSelect = function (start, end, allDay, jsEvent, view, resource) {
    $scope.accordionGroups[1].isOpen = true;
    $scope.accordionGroups[1].isDisabled = false;
    $scope.accordionGroups[0].isDisabled = true;
    if ($scope.tabs.project.active) {
      $scope.newIteration._project = resource.id;
    } else {
      $scope.newIteration._user = resource.id;
    }
    $scope.newIteration.startDate = start;
    $scope.newIteration.endDate = end;
    $('.accordion .panel-group').draggable();
  };

  $scope.onEventClick = function (event) {
    $scope.accordionGroups[0].isOpen = true;
    $scope.accordionGroups[0].isDisabled = false;
    $scope.accordionGroups[1].isDisabled = true;
    $scope.e_selected = event;
    $('.accordion .panel-group').draggable();
  };

  $scope.onTabClick = function (tab, oldTab) {
    tab.active = true;
    oldTab.active = false;
    $scope.accordionGroups[1].isDisabled = true;
    $scope.accordionGroups[0].isDisabled = true;
    if ($scope.tabs.project.active) {
      $('.calendarByProject').fullCalendar('refetchEvents');
    } else {
      $('.calendarByUser').fullCalendar('refetchEvents');
    }
  };

  $scope.uiConfigByProject = {
    calendar: {
      firstDay: 1,
      selectable: $scope.hasPermissionAdd,
      editable: $scope.hasPermissionAdd,
      defaultView: 'resourceMonth',
      header: {
        left: 'prev,title,next',
        center: '',
        right: 'resourceFilter'
      },
      resourceFilter: "getProjects",
      holidays: "getHolidays",
      resources: "getProjects",
      selectHelper: true,
      unselectAuto: false,
      eventDrop: $scope.move,
      eventResize: $scope.move,
      select: $scope.onSelect,
      eventClick: $scope.onEventClick
    }
  };

  $scope.uiConfigByUser = {
    calendar: {
      firstDay: 1,
      selectable: $scope.hasPermissionAdd,
      editable: $scope.hasPermissionAdd,
      defaultView: 'resourceMonth',
      header: {
        left: 'prev,title,next',
        center: '',
        right: 'resourceFilter'
      },
      resourceFilter: "getUsers",
      holidays: "getHolidays",
      resources: "getUsers",
      selectHelper: true,
      unselectAuto: false,
      eventDrop: $scope.move,
      eventResize: $scope.move,
      select: $scope.onSelect,
      eventClick: $scope.onEventClick
    }
  };

});
