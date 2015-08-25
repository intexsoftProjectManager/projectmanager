'use strict';

app.controller('TimeLinesController', function ($scope, $injector, $state) {
  var TimeLine = $injector.get('TimeLine');
  $scope.options = {};
  $scope.options.scale = 'month';
  $scope.options.timeFramesNonWorkingMode = 'hidden';
  $scope.data = TimeLine.all({project:$state.params.projectId});
  $scope.currentDate = new Date();

  $scope.options.timeFrames = {
    day: {
      start: moment('8:00', 'HH:mm'),
      end: moment('20:00', 'HH:mm'),
      working: true,
      default: true
    },
    noon: {
      start: moment('12:00', 'HH:mm'),
      end: moment('13:30', 'HH:mm'),
      working: false,
      default: true
    },
    closed: {
      working: false
    }
  };

  $scope.options.dateFrames = {
    weekend: {
      evaluator: function(date) {
        return date.isoWeekday() === 6 || date.isoWeekday() === 7;
      },
      targets: ['closed']
    }
  };

  $scope.options.filterRows = function(value, index) {
    return value.model.to >= moment($scope.options.fromDate) || !$scope.options.fromDate;
  };


    $scope.drawTaskFactory = function() {
    var newTask = {
      name: 'New Task'
      // Other properties
    };

    return newTask;
  }

});
