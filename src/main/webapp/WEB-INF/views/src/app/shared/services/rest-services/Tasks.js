'use strict';

app.factory('Tasks', function ($resource) {
  return $resource('api/tasks/:taskId', {
    taskId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    getRedmineTasks:{
      url:'api/redmine/tasks/:taskId',
        method: 'GET',
        isArray:true
    }
  });
});
