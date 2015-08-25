'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ExecutedChecklistGroupController', ExecutedChecklistGroupController);

function ExecutedChecklistGroupController($scope, $rootScope, ExecutedChecklistService, ExecutedChecklists, poollingFactory, priorities) {
  $scope.isOpen = true;
  $scope.build = {};
  $scope.env = {};
  $scope.isStatusOpen = false;
  $scope.currentEnv = {};

  $scope.checklist = ExecutedChecklistService.getChecklist();

  $scope.group.steps = $scope.group.steps ? $scope.group.steps : [];


  //create parent index path
  $scope.parentIndex = $scope.$parent.parentIndex ? $scope.$parent.parentIndex + '.' + ($scope.$parent.$index + 1) : ($scope.$parent.$index + 1);

  //watch on changes of parent index
  $scope.$watch('$parent.$index', function(){
    $scope.parentIndex = $scope.$parent.parentIndex ? $scope.$parent.parentIndex + '.' + ($scope.$parent.$index + 1) : ($scope.$parent.$index + 1);
  });

  //watch on changes of parent parent index path
  $scope.$watch('$parent.parentIndex', function(){
    $scope.parentIndex = $scope.$parent.parentIndex ? $scope.$parent.parentIndex + '.' + ($scope.$parent.$index + 1) : ($scope.$parent.$index + 1);
  });

  $scope.changeStepEnvStatus = function (status, step) {
    if ($scope.checklist.status === 0) {
      step.envs[$scope.currentEnv] = status;
      if (hasEnvsStatus(step.envs, 1)) {
        step.status = 1;
      } else if (hasEnvsStatus(step.envs, 2)) {
        step.status = 2;
      } else if (hasEnvsStatus(step.envs, 3)) {
        step.status = 3;
      } else if (hasEnvsStatus(step.envs, 0)) {
        step.status = 0;
      } else {
        step.status = 4;
      }
      $scope.update($scope.checklist);
    }
  };

  function hasEnvsStatus(envs, status) {
    return Object.keys(envs).some(function(el){return envs[el] === status})
  }

  $scope.update = function (checklist) {
    ExecutedChecklists.update(checklist);
  };

  $scope.getPriorityImage = function(step){
    var url;
    priorities.some(function(element){
      if (element.value == step.priority){
        url = element.img;
        return true;
      }
    });
    return url ? url : priorities[2].img;
  };

  $scope.getPriorityTitle = function(step){
    var text;
    priorities.some(function(element){
      if (element.value == step.priority){
        text = element.text;
        return true;
      }
    });
    return text ? text : priorities[2].text;
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

  $scope.setCurrentEnv = function(env) {
    if ($scope.checklist.status === 0) {
      $scope.currentEnv = env;
    }
  };

  $scope.getNameOfEnvById = function(id) {
    for(var i=0;i<$scope.envs.length;i++){
      if ($scope.envs[i]._id === id){
        return $scope.envs[i].name;
      }
    }
    return "";
  };
}
