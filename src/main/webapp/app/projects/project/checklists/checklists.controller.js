'use strict';
app.controller('ChecklistsController', function ($scope, Checklists, ChecklistFolders, $state) {
  $scope.newFolder = {};
  $scope.newChecklist = {};
  $scope.checklistAccordion = {};

  $scope.findFolders = function () {
    ChecklistFolders.getTree({
          project: $state.params.projectId
        },
        function (folders) {
          $scope.folders = folders;
        }
    );
  };

  $scope.$on('folder:add', function (event, folder) {
    $scope.folders.push(folder);
  });

  $scope.$on('folder:remove', function (event, folder) {
    angular.forEach($scope.folders, function (element, index) {
      if (element._id === folder._id) {
        $scope.folders.splice(index, 1);
      }
    });
  });

  $scope.$on('checklist:remove', function (event, checklist) {
    var checklists = $scope.folders[$scope.folders.length - 1].checklists;
    angular.forEach(checklists, function (element, index) {
      if (element._id === checklist._id) {
        checklists.splice(index, 1);
      }
    });
  });

  $scope.$on('checklist:add', function (event, checklist) {
    $scope.folders[$scope.folders.length - 1].checklists.push(checklist);
  });

  $scope.$on('checklist:add:open', function (event, folder) {
    $scope.checklistAccordion.isOpen = true;
    $scope.newChecklist.folder = {id: folder._id, text: folder.name};
    $scope.currentSelect = {id: folder._id, text: folder.name};
  });

  $scope.$on('folder:add:open', function (event, folder) {
    $scope.tabs[0].isOpen = true;
    $scope.newFolder.parent = {id: folder._id, text: folder.name};
    $scope.currentSelect = {id: folder._id, text: folder.name};
  });

});
