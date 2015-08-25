'use strict';

app.factory('Checklists', function ($resource) {
  return $resource('api/checklists/:checklistId', {
    checklistId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    delete: {
      method: 'DELETE'
    },
    getXLS:{
    url:'api/checklists/:checklistId/xls',
      method: 'GET'
  }
  });
});
