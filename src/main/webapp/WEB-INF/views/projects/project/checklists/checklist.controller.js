'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ChecklistController',
    function ChecklistController($scope, $rootScope, $timeout, ExecutedChecklists, ChecklistFolders, checklistTreeViewService, ngDialog, Checklists, $state) {
      $rootScope.selectedSteps = [];
      $scope.isOpen = false;
      var parentFolder;

      $scope.findFolders = function (callback) {
        ChecklistFolders.getTree({
              project: $state.params.projectId,
              isTemplate: $scope.isTemplate
            },
            function (folders) {
              callback(folders);
            }
        );
      };

      $scope.collapseDetails = function(){
        $scope.isOpen = !$scope.isOpen;
      };

      $scope.executeChecklist = function (event, checklist) {
        checklist.creator = $rootScope.currentUser;
        checklist.creationDate = new Date();
        checklist.checklist = angular.copy(checklist._id);
        checklist.type = 'checklist';
        delete checklist._id;
        var executeChecklist = new ExecutedChecklists(checklist);
        executeChecklist.$save(function (executedChecklist) {
          $state.go('main.projects.project.checklists.execute',{executedChecklistId: executedChecklist._id});
        });
      };

      function onUpdateChecklist() {
        $scope.update($scope.checklist);
      };

      $scope.$on('checklist:update', onUpdateChecklist);

      function updateChecklist(checklist) {
        Checklists.update(checklist, function (updatedChecklist) {
          //refresh links to new checklist
          updatedChecklist.$$selected = true;
          checklistTreeViewService.updateChecklist(updatedChecklist);
          //remove old checklist if folder changed
          if (parentFolder._id != updatedChecklist.folder._id) {
            var oldChecklist = angular.copy(updatedChecklist);
            oldChecklist.folder = parentFolder;
            checklistTreeViewService.removeChecklist(oldChecklist);
            parentFolder = updatedChecklist.folder;
          }
        });
      }

      $scope.update = function (checklist) {
        updateChecklist(checklist);
      };

      $scope.updateFolder = function (folder) {
        $scope.checklist.folder = folder;
        updateChecklist($scope.checklist)
      };

      $scope.addStep = function(checklist){
        checklist.steps.push({'id':checklist.steps.length+1, group:false});
        $scope.update(checklist);
      };

      $scope.newVersion = function(checklist){
        var history = angular.copy(checklist.history);
        checklist.version ? checklist.version++ : checklist.version = 1;
        delete checklist.history;
        var copiedChecklist = angular.copy(checklist);
        delete copiedChecklist.$$selected;
        delete copiedChecklist.$resolved;
        if (history.length !== 0) {
          history.push(copiedChecklist);
        } else {
          history = [copiedChecklist];
        }
        checklist.history = history;
        $scope.update(checklist);
      };

      $scope.changeVersion = function(version){
         var history = angular.copy($scope.checklist.history);
         delete $scope.checklist.history;
         var copiedChecklist = angular.copy($scope.checklist);
         for (var i=0; i< history.length; i++) {
           if (history[i].version === copiedChecklist.version) {
             history[i] = copiedChecklist;
           }
         }
         $scope.checklist = version;
         $scope.checklist.history = history;
         $scope.update($scope.checklist);
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
          }
          $scope.update(checklist);
        }
      };

      $scope.$on('checklist:selected', function (event, checklist, isTemplate) {
        $scope.checklist = checklist;
        $scope.isTemplate = isTemplate;
        if ($scope.checklist) {
          parentFolder = checklist.folder ? angular.copy(checklist.folder) : null;
          $scope.checklist.steps = $scope.checklist.steps.length > 0 ? $scope.checklist.steps : [{id:1}];
          $scope.currentVersion = $scope.checklist.version ? $scope.checklist.version : 1;
          addVersionIfNoneExist(checklist);
          $scope.latestVersion = getLatestVersion(checklist);
        }
      });

      function getLatestVersion(checklist){
        var maxVersion = checklist.history[0].version;
        for (var i=1; i< checklist.history.length; i++) {
          if (checklist.history[i].version > maxVersion) {
            maxVersion = checklist.history[i].version;
          }
        }
        return maxVersion;
      }

      function addVersionIfNoneExist(checklist){
        if (!checklist.history || checklist.history.length === 0) {
          var history = angular.copy(checklist.history);
          checklist.version ? true : checklist.version = 1;
          delete checklist.history;
          var copiedChecklist = angular.copy(checklist);
          delete copiedChecklist.$$selected;
          delete copiedChecklist.$resolved;
          history = [copiedChecklist];
          checklist.history = history;
          $scope.update(checklist);
        }
      }

      $scope.generateXLS = function(checklist){
        window.open("./api/checklists/"+checklist._id+"/xls", "_blank");
      };

    });
