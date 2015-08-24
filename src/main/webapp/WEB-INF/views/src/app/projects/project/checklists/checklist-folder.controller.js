'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ChecklistFolderController',
    function ChecklistFolderController($scope, ChecklistFolders, Checklists, $routeParams, checklistTreeViewService, $state) {
      $scope.service = checklistTreeViewService;
      var parentFolder = 0;

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

      $scope.$on('folder:selected', function (event, folder, isTemplate) {
        $scope.folder = folder;
        parentFolder = folder ? angular.copy(folder.parent) : null;
        $scope.isTemplate = isTemplate;
      });

      function updateFolder(folder){
        var isOpen = folder.$isOpen;
        var offset = folder.$offset;
        var checklists = folder.checklists;
        var children = folder.children;
        ChecklistFolders.update(folder, function (updatedFolder) {
          updatedFolder.$$selected = true;
          updatedFolder.$isOpen = isOpen;
          updatedFolder.children = children;
          updatedFolder.checklists = checklists;
          if (parentFolder._id !== updatedFolder.parent._id) {
            checklistTreeViewService.addFolder(updatedFolder);
            var oldFolder = angular.copy(updatedFolder);
            oldFolder.parent = parentFolder;
            checklistTreeViewService.removeFolder(oldFolder);
            checklistTreeViewService.selectFolder(updatedFolder);
            parentFolder = updatedFolder.parent;
          } else {
            updatedFolder.$offset = offset;
          }
        });
      }

      $scope.updateParent = function (folder) {
        $scope.folder.parent = folder;
        updateFolder($scope.folder)
      };

      $scope.update = function (folder) {
        updateFolder(folder);
      };
    });
