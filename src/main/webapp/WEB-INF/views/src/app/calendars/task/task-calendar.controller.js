'use strict';
app.controller('TaskCalendarController', function ($scope, $http, Auth, User, IterationCalendar, Iterations, Socket, $filter, ngTableParams, ngDialog, priorities) {
  $scope.hasPermissionEdit = Auth.hasPermission('Task_Calendar', 'Edit');
  $scope.hasPermissionAdd = Auth.hasPermission('Task_Calendar', 'Add');
  $scope.newTask = {};
  $scope.e_selected = {};
  $scope.users = [];
  $scope.iterations = [];
  $scope.tabs = {iteration:{active:false, rendered:false}, user:{active:true, rendered:true}};
  $scope.eventSourcesByIteration = [{
    url: "getCalendarTasksByIteration",
    type: 'GET',
    cache: false
  }];
  $scope.eventSourcesByUser = [{
    url: "getCalendarTasksByUser",
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

  $scope.getIterations = function () {
    Iterations.query({}, function (iterations) {
      var array = [];
      for (var i = 0; i < iterations.length; i++) {
        array.push({id: iterations[i]._id, text: iterations[i].name + '@' + iterations[i].project});
      }
      $scope.iterations = array;
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
  if ($scope.tabs.iteration.active) {
    $('.calendarByIteration').fullCalendar('refetchEvents');
  } else {
    $('.calendarByUser').fullCalendar('refetchEvents');
  }

  function getStartDate(){
    if ($scope.tabs.iteration.active) {
      return $('.calendarByIteration').fullCalendar('getView').visStart
    } else {
      return $('.calendarByUser').fullCalendar('getView').visStart
    }
  }

  function getEndDate(){
    if ($scope.tabs.iteration.active) {
      return $('.calendarByIteration').fullCalendar('getView').visEnd
    } else {
      return $('.calendarByUser').fullCalendar('getView').visEnd
    }
  }
  //config select2 Users
  $scope.select2IterationsOptions = {
    ajax: {
      url: "getIterations",
      quietMillis: 100,
      data: function (term) {
        return {term: term, start:getStartDate(),end:getEndDate()};
      },
      results: function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          array.push({id: data[i].id, text: data[i].name + '@' + data[i].project});
        }
        $scope.iterations = array;
        return {results: array};
      }
    },
    id: function (element) {
      return element.id;
    },
    formatSelection: function (exercise) {
      for (var i = 0; i < $scope.iterations.length; i++) {
        if ($scope.iterations[i].id === exercise || (exercise.id && $scope.iterations[i].id === exercise.id)) {
          return $scope.iterations[i].text;
        }
      }
      return exercise.text;
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      var id = $(element).val() === '' && $scope.currentTab === "iteration" ? $scope.newTask._iteration : $(element).val();
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

  Socket.on('refresh:calendar:task', function () {
    if ($scope.tabs.iteration.active) {
      $('.calendarByIteration').fullCalendar('refetchEvents');
    } else {
      $('.calendarByUser').fullCalendar('refetchEvents');
    }
  });

  $scope.update = function () {
    var copiedObject = jQuery.extend({}, $scope.e_selected);
    delete copiedObject.$selected;
    Socket.emit('update:calendar:task', copiedObject);
  };

  $scope.remove = function (event) {
    $scope.message = 'Are you sure?';
    var confirm = ngDialog.openConfirm({
      template: 'app/shared/modals/confirm.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    confirm.then(function () {
      Socket.emit('remove:calendar:task', $scope.e_selected);
      $scope.accordionGroups[0].isDisabled = true;
    });
  };

  $scope.close = function () {
    $('.fc-cell-overlay').remove();
  };

  $scope.move = function (event) {
    Socket.emit('move:calendar:task', {
      _id: event.id,
      startDate: event.start,
      endDate: event.end,
      _resourceId: event.resource
    });
  };

  $scope.onSelect = function (start, end, allDay, jsEvent, view, resource) {
    if ($scope.currentTab === "iteration") {
      $scope.newTask._iteration = resource.id;
    } else {
      $scope.newTask._user = resource.id;
    }
    $scope.newTask.startDate = start;
    $scope.newTask.endDate = end;
    var createForm = ngDialog.openConfirm({
      template: 'app/calendars/task/modals/create-task.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    createForm.then(function () {
      Socket.emit('create:calendar:task', $scope.newTask);
      $('.fc-cell-overlay').remove();
      $scope.newTask = {};
    });
  };

  $scope.onEventClick = function (event, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.accordionGroups[0].isOpen = true;
    $scope.accordionGroups[0].isDisabled = false;
    $scope.e_selected = event;
    $('.accordion .panel-group').draggable();
  };

  $scope.onTabClick = function (tab, oldTab) {
    tab.active = true;
    oldTab.active = false;
    $scope.accordionGroups[1].isDisabled = true;
    $scope.accordionGroups[0].isDisabled = true;
    if ($scope.tabs.iteration.active) {
      $('.calendarByIteration').fullCalendar('refetchEvents');
    } else {
      $('.calendarByUser').fullCalendar('refetchEvents');
    }
  };

  $scope.uiConfigByIteration = {
    calendar: {
      firstDay: 1,
      selectable: $scope.hasPermissionAdd,
      editable: $scope.hasPermissionAdd,
      defaultView: 'resourceWeek',
      header: {
        left: 'prev,title,next',
        center: '',
        right: 'resourceFilter, resourceMonth, resourceWeek'
      },
      resourceFilter: "getProjects",
      holidays: "getHolidays",
      resources: "getIterations",
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
      defaultView: 'resourceWeek',
      header: {
        left: 'prev,title,next',
        center: '',
        right: 'resourceFilter, resourceMonth, resourceWeek'
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

  $scope.updateScroll = function(){
    setTimeout(function () {
      //$scope.$parent.myScroll['scroll-wrapper'].refresh();
    }, 50);
  };

});
