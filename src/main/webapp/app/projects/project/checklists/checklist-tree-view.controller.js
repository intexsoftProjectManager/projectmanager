'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.controller('ChecklistTreeViewController',
    function ChecklistFolderController($scope, ChecklistFolders, Checklists, $routeParams, checklistTreeViewService, ngDialog, $state) {
      $scope.service = checklistTreeViewService;
      $scope.delete = function (event, folder) {
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
          ChecklistFolders.delete({checklistFolderId:folder._id}, function () {
            for (var i = 0; i < $scope.folders.length; i++) {
              if ($scope.folders[i]._id === folder._id) {
                $scope.folders.splice(i, 1);
              }
            }
            checklistTreeViewService.selectFolder(null);
          }, function (error) {
            $scope.message = error.data.error;
            var warning = ngDialog.openConfirm({
              template: 'app/shared/modals/warning.html',
              className: 'ngdialog-theme-plain',
              scope: $scope,
              showClose: true
            });
          });
        });
      };

      $scope.deleteChecklist = function (event, checklist) {
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
          Checklists.delete({'checklistId':checklist._id},function () {
            for (var i = 0; i < $scope.folder.checklists.length; i++) {
              if ($scope.folder.checklists[i]._id === checklist._id) {
                $scope.folder.checklists.splice(i, 1);
              }
            }
            checklistTreeViewService.selectChecklist(null);
          });
        });
      };

      $scope.$on('folder:add:' + $scope.folder._id, function (event, folder) {
        $scope.folder.children ? $scope.folder.children.push(folder) : $scope.folder.children = [folder];
      });

      $scope.$on('checklist:add:' + $scope.folder._id, function (event, checklist) {
        $scope.folder.checklists ? $scope.folder.checklists.push(checklist) : $scope.folder.checklists = [checklist];
      });

      $scope.$on('folder:remove:' + $scope.folder._id, function (event, folder) {
        var childs = $scope.folder.children;
        angular.forEach(childs, function (element, index) {
          if (element._id === folder._id) {
            childs.splice(index, 1);
          }
        });
      });

      $scope.$on('checklist:remove:' + $scope.folder._id, function (event, checklist) {
        var childs = $scope.folder.checklists;
        angular.forEach(childs, function (element, index) {
          if (element._id === checklist._id) {
            childs.splice(index, 1);
          }
        });
      });

      $scope.addChecklist = function (event, folder) {
        checklistTreeViewService.openAddChecklist(folder);
      };

      $scope.selectChecklist = function (event, checklist, isTemplate) {
        checklistTreeViewService.selectChecklist(checklist, isTemplate);
      };

      $scope.selectFolder = function (event, folder, isTemplate) {
        checklistTreeViewService.selectFolder(folder, isTemplate);
      };

      $scope.addFolder = function ($event, parent, skipProject) {
        var newFolder = {};
        newFolder.parent = parent._id;
        if (!skipProject) {
          newFolder.project = $state.params.projectId;
        }
        newFolder.name = "Folder";
        var folder = new ChecklistFolders(newFolder);
        folder.$save(function (folder) {
          checklistTreeViewService.addFolder(folder);
          checklistTreeViewService.selectFolder(folder);
        });
      };

      $scope.addChecklist = function ($event, folder, skipProject) {
        $event.stopPropagation();
        var newChecklist = {};
        if (!skipProject) {
          newChecklist.project = $state.params.projectId;
        }
        newChecklist.name = "Checklist";
        newChecklist.folder = folder._id;
        var checklist = new Checklists(newChecklist);
        checklist.$save(function (checklist) {
          checklistTreeViewService.addChecklist(checklist);
          checklistTreeViewService.selectChecklist(checklist);
        });
      };

      $scope.addOffset = function (folder, offset) {
        folder.$offset = offset + 10;
        return folder;
      };

    });
