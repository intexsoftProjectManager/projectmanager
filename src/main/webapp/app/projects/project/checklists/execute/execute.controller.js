'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ChecklistExecuteController', ChecklistExecuteController);

function ChecklistExecuteController($scope, $rootScope, Builds, Environments, ExecutedChecklists, ExecutedChecklistService, ngDialog, poollingFactory, priorities, $state) {
  $scope.selectedStatuses = [0,1,2,3,4];
  $scope.isOpen = true;
  $scope.user = $rootScope.currentUser;
  $scope.iterations = {};
  $scope.build = {};
  $scope.env = {};
  $scope.isStatusOpen = false;
  $scope.currentEnv = {};

  $scope.builds = $state.$current.locals['content@main'].builds;
  $scope.envs = $state.$current.locals['content@main'].envs;
  $scope.checklist = $state.$current.locals['content@main'].executedChecklist;
  $scope.iterations = $state.$current.locals['content@main'].iterations;
  $scope.renderedSteps = $scope.checklist.steps.slice(0, 10);

  ExecutedChecklistService.setChecklist($scope.checklist);

  if ($scope.checklist.status === 0) {
    poollingFactory.callFnOnInterval(function () {
      $scope.checklist.spendTime += 1000;
    }, 1000);
  }

  //config select2 Users
  $scope.select2IterationsOptions = {
    ajax: {
      url: "api/iterations",
      quietMillis: 100,
      data: function (term) {
        return {term: term, project: $state.params.projectId};
      },
      results: function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          array.push({id: data[i]._id, text: data[i].name});
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
        if ($scope.iterations[i]._id === exercise || $scope.iterations[i].id === exercise || (exercise.id && $scope.iterations[i]._id === exercise.id)
          || (exercise._id && $scope.iterations[i]._id === exercise._id)) {
          return $scope.iterations[i].name || $scope.iterations[i].text;
        }
      }
      return exercise.text;
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      var id = $(element).val() || $scope.checklist._iteration;
      callback(id);
    }
  };

  $scope.addBuild = function () {
    var createBuild = ngDialog.openConfirm({
      template: 'app/projects/project/checklists/execute/modals/add-build.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    createBuild.then(function () {
      //do something here
      $scope.build._project = $state.params.projectId;
      var build = new Builds($scope.build);
      build.$save(function(build){
        $scope.builds.push(build);
        $scope.checklist.build = build._id;
        $scope.build = {};
      })
    });
  };

  $scope.addEnv = function () {
    var createEnv = ngDialog.openConfirm({
      template: 'app/projects/project/checklists/execute/modals/add-env.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    createEnv.then(function () {
      $scope.env._project = $state.params.projectId;
      var env = new Environments($scope.env);
      env.$save(function(env){
        $scope.envs.push(env);
        $scope.checklist.environment ? $scope.checklist.environment.push(env._id): $scope.checklist.environment = [env._id];
        $scope.env = {};
      });
    });
  };

  $scope.changeStatus = function ($event, status) {
    $event.stopPropagation();
    $scope.checklist.status = status;
    if ($scope.checklist.status === 0) {
      poollingFactory.callFnOnInterval(function () {
        $scope.checklist.spendTime += 1000;
      }, 1000);
    } else if ($scope.checklist.status === 1) {
      $scope.update($scope.checklist);
      poollingFactory.stop();
    } else if ($scope.checklist.status === 2) {
      $scope.checklist.endDate = new Date();
      $scope.update($scope.checklist);
      poollingFactory.stop();
    }
  };

  $scope.update = function (checklist) {
    ExecutedChecklists.update(checklist);
  };

  /*
   Events for listening location change(close/change)
   */
  window.onbeforeunload = function () {
    // Hack for saving data before close
    jQuery.ajax({}).done(function () {
      if ($scope.checklist.status != 2) {
        poollingFactory.stop();
        $scope.checklist.status = 1;
        $scope.update($scope.checklist);
      }
    });
    if ($scope.checklist.status === 0) {
      return "Checklist execution in progress, it's will be stopped. Are you shure you want exit?";
    }
  };

  $scope.$on("$locationChangeStart", function () {
    if ($scope.checklist.status != 2) {
      poollingFactory.stop();
      $scope.checklist.status = 1;
      $scope.update($scope.checklist);
    }
  });

  $scope.addToStatusFilter = function(status){
    var statusIndex = $scope.selectedStatuses.indexOf(status);
    if (statusIndex != -1){
      $scope.selectedStatuses.splice(statusIndex, 1);
    } else {
      $scope.selectedStatuses.push(status);
    }
  };

  $scope.getStatusFilterClass = function(status){
    var statusIndex = $scope.selectedStatuses.indexOf(status);
    if (statusIndex != -1){
      return 'active'
    } else {
      return '';
    }
  };

  var statuses = [
    {value:0, text:'Ok', img: "media/checklist/result/ok_on.png"},
    {value:1, text:'Fail', img: "media/checklist/result/fail_on.png"},
    {value:2, text:'Bug', img: "media/checklist/result/bugs_on.png"},
    {value:3, text:'Blocked', img: "media/checklist/result/blocked_on.png"},
    {value:4, text:'Not run', img: "media/checklist/result/notrun_on.png"},
  ];

  $scope.getStatusImage = function(step, env){
    var url;
    if (!step.envs){
      step.envs = {};
    }
    statuses.some(function(element){
      if (element.value === step.envs[env]){
        url = element.img;
        return true;
      }
    });
    return url ? url : statuses[4].img;
  };

  $scope.getStatusTitle = function(step, env){
    var text;
    if (!step.envs){
      step.envs = {};
    }
    statuses.some(function(element){
      if (element.value === step.envs[env]){
        text = element.text;
        return true;
      }
    });
    return text ? text : statuses[4].text;
  };

  $scope.generateXLS = function(checklist){
    window.open("./api/executedChecklists/"+checklist._id+"/xls", "_blank");
  }
}

ChecklistExecuteController.resolve = {
  builds: ['Builds', '$stateParams', function(Builds, $stateParams){
    return Builds.query({project:$stateParams.projectId});
  }],
  envs: ['Environments', '$stateParams', function(Environments, $stateParams){
    return Environments.query({project:$stateParams.projectId});
  }],
  executedChecklist: ['ExecutedChecklists', '$stateParams', function(ExecutedChecklists, $stateParams){
    return ExecutedChecklists.get({
      executedChecklistId: $stateParams.executedChecklistId
    }).$promise;
  }],
  iterations: ['Iterations', '$stateParams', function(Iterations, $stateParams){
    return Iterations.query({project:$stateParams.projectId}).$promise
  }]
}
