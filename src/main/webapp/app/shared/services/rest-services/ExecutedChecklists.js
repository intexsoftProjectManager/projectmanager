'use strict';

app.factory('ExecutedChecklists', function ($resource) {
  return $resource('api/executedChecklists/:executedChecklistId', {
    executedChecklistId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
});
