'use strict';

app.factory('ChecklistFolders', function ($resource) {
  return $resource('api/checklistFolders/:checklistFolderId', {
    checklistFolderId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    getTree:{
      url:'api/checklistFolders/tree',
      method: 'GET',
      isArray: true
    }
  });
});
