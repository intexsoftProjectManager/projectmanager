app.factory('checklistTreeViewService', ['$rootScope', '$state', function ($rootScope, $state) {
  var service = {};

  service.addFolder = function (folder) {
    if (folder.parent) {
      $rootScope.$broadcast('folder:add:' + folder.parent._id, folder);
    } else {
      $rootScope.$broadcast('folder:add', folder);
    }
  };

  service.addChecklist = function (checklist) {
    if (checklist.folder) {
      $rootScope.$broadcast('checklist:add:' + checklist.folder._id, checklist);
    } else {
      $rootScope.$broadcast('checklist:add', checklist);
    }
  };

  service.removeChecklist = function (checklist) {
    if (checklist.folder) {
      $rootScope.$broadcast('checklist:remove:' + checklist.folder._id, checklist);
    } else {
      $rootScope.$broadcast('checklist:remove', checklist);
    }
  };

  service.updateChecklist = function (checklist) {
    if (checklist) {
      service.removeChecklist(checklist);
      service.addChecklist(checklist);
    }
  };

  service.removeFolder = function (folder) {
    if (folder.parent) {
      $rootScope.$broadcast('folder:remove:' + folder.parent._id, folder);
    } else {
      $rootScope.$broadcast('folder:remove', folder);
    }
  };

  service.openAddChecklist = function (folder, plan, requirment) {
    $rootScope.$broadcast('checklist:add:open', folder, plan, requirment);
  };

  service.selectChecklist = function (checklist, isTemplate) {
    if (checklist) {
      checklist.$$selected = true;
    }
    if (service.folder) {
      service.selectFolder(null);
    }
    if (service.checklist && service.checklist !== checklist) {
      service.checklist.$$selected = !service.checklist.$$selected;
    }
    service.checklist = checklist;
    $rootScope.$broadcast('checklist:selected', checklist, isTemplate);
  };

  service.selectFolder = function (folder, isTemplate) {
    if (folder) {
      folder.$$selected = true;
    }
    if (service.checklist) {
      service.selectChecklist(null);
    }
    if (service.folder && service.folder !== folder) {
      service.folder.$$selected = !service.folder.$$selected;
    }
    service.folder = folder;
    $rootScope.$broadcast('folder:selected', folder, isTemplate);
  };

  return service;
}
]);


