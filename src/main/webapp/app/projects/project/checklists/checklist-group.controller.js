'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ChecklistGroupController',
    function ChecklistGroupController($scope, $rootScope, $timeout, ExecutedChecklists, ChecklistFolders, checklistService, ngDialog, priorities, Checklists, $state) {
      $scope.group.steps = $scope.group.steps ? $scope.group.steps : [];
      $scope.selectedSteps = $rootScope.selectedSteps;

      $scope.templates = ChecklistFolders.getTree({
          project: $state.params.projectId,
          isTemplate: true
        });

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

      $scope.isOpen = false;

      $scope.priorities = priorities;

      $scope.delete = function (event, step, checklist) {
        event.stopPropagation();
        event.preventDefault();
        $scope.message = "Are you sure?";
        var confirm = ngDialog.openConfirm({
          template: 'app/shared/modals/confirm.html',
          className: 'ngdialog-theme-plain',
          scope: $scope,
          showClose: true
        });
        confirm.then(function () {
          var stepPosition = step.id;
          var len = $scope.group.steps.length;
          for (var i = 0; i < len; i++) {
            if ($scope.group.steps[i].id == step.id) {
              $scope.group.steps.splice(i, 1);
              break;
            }
          }
          for (i = 0, len = $scope.group.steps.length; i < len; i++) {
            if (stepPosition < $scope.group.steps[i].id)
              $scope.group.steps[i].id -= 1;
          }
          $scope.update();
        });
      };

      $scope.addToBuffer = function($event, step, forceCtrl){
        if ($event.ctrlKey==1 || forceCtrl) {
          for (var i = 0; i < $rootScope.selectedSteps.length; i++) {
            if ($rootScope.selectedSteps[i].$$hashKey == step.$$hashKey) {
              $rootScope.selectedSteps.splice(i, 1);
              step.$$selected = false;
              return;
            }
          }
          $rootScope.selectedSteps.push(step);
          step.$$selected = true;
        }
      };

      $scope.update = function() {
        checklistService.update();
      };

      $scope.addStepToGroup = function(step){
        if (!step.steps) {
          step.steps = [];
        }
        step.steps.push({'id':step.steps.length+1, group:false});
        $scope.update();
      };

      $scope.markAsGroup = function(step){
        step.group = !step.group;
        $scope.update();
      };

      $scope.clearBuffer = function() {
        for (var i = 0; i < $rootScope.selectedSteps.length; i++) {
          $rootScope.selectedSteps[i].$$selected = false;
        }
        $rootScope.selectedSteps.length = 0;
      };

      $scope.copyFromBuffer = function(index){
        for (var i = 0; i < $rootScope.selectedSteps.length; i++) {
          var copiedStep = angular.copy($rootScope.selectedSteps[i]);
          copiedStep.$$selected = false;
          copiedStep.id = index;
          $scope.group.steps.splice(index, 0, copiedStep);
          for (var j=index;j<$scope.group.steps.length;j++) {
            $scope.group.steps[j].id += 1;
          }
          index++
        }
        $scope.update();
      };

      $scope.insertTemplate = function(template, index){
        for (var i = 0; i < template.length; i++) {
          var copiedStep = angular.copy(template[i]);
          copiedStep.$$selected = false;
          copiedStep.id = index;
          $scope.group.steps.splice(index, 0, copiedStep);
          for (var j=index;j<$scope.group.steps.length;j++) {
            $scope.group.steps[j].id += 1;
          }
          index++
        }
        $scope.update();
      };

      $scope.moveFromBufferToGroup = function(step) {
        $scope.copyFromBufferToGroup(step);
        $scope.deleteFromBuffer();
      };

      $scope.deleteFromBuffer = function(){
        for (var i = 0; i < $rootScope.selectedSteps.length; i++) {
          checklistService.deleteStepById($rootScope.selectedSteps[i].$$hashKey);
        }
        $scope.clearBuffer();
        $scope.update();
      };

      $scope.$on('checklist:step:delete', function($event, id){
        var len, stepPosition;
        for (var i = 0; i < $scope.group.steps.length; i++) {
          if ($scope.group.steps[i].$$hashKey === id) {
            $scope.group.steps.splice(i, 1);
            stepPosition = i;
            break;
          }
        }
        for (i = 0, len = $scope.group.steps.length; i < len; i++) {
          if (stepPosition < $scope.group.steps[i].id) {
            $scope.group.steps[i].id -= 1;
          }
        }
      });

      $scope.copyFromBufferToGroup = function(step){
        if (!step.steps) {
          step.steps = [];
        }
        for (var i = 0; i < $rootScope.selectedSteps.length; i++) {
          var copiedStep = angular.copy($rootScope.selectedSteps[i]);
          copiedStep.$$selected = false;
          copiedStep.id = step.steps.length+1;
          step.steps.push(copiedStep);
        }
        $scope.update();
      };

      $scope.addStepByIndex = function(index){
        $scope.group.steps.splice(index, 0, {'id':index});
        for (var i=index;i< $scope.group.steps.length;i++) {
          $scope.group.steps[i].id += 1;
        }
        $scope.update();
      };

      $scope.exportSteps = function (checklist) {
        $rootScope.exportedSteps = angular.copy(checklist.steps);
      };

      $scope.importSteps = function (checklist) {
        if ($rootScope.exportedSteps) {
          var maxIndex = checklist.steps[checklist.steps.length - 1].id;
          var copiedSteps = angular.copy($rootScope.exportedSteps);
          for (var j = 0; j < copiedSteps.length; j++) {
            maxIndex++;
            copiedSteps[j].id = maxIndex;
            delete copiedSteps[j]._id;
            checklist.steps.push(copiedSteps[j]);
            if (checklist.steps.length - 1 == $scope.group.steps.length){
              $scope.group.steps.push(checklist.steps[checklist.steps.length-1]);
            }
          }
          $scope.update();
        }
      };

      $scope.changePosition = function (delta, step, event) {
        event.stopPropagation();
        var steps = $scope.group.steps;
        for (var j = 0; j < steps.length; j++) {
          if (steps[j].id === step.id + delta) {
            steps[j].id -= delta;
            step.id += delta;
            //sort new array steps by id
            steps.sort(function (a, b) {
              return parseFloat(a.id) - parseFloat(b.id);
            });
            //refresh rendered steps
            $scope.update();
            return;
          }
        }
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

      $scope.setPriority = function(checklist, step, priority, priorityImage){
        step.priority = priority;
        priorityImage =  $scope.getPriorityImage(priority);
        $scope.update();
      };
    });
