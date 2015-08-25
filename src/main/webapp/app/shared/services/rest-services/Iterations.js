'use strict';

app.factory('Iterations', function ($resource) {
  return $resource('api/iterations/:iterationId', {
    iterationId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    getTree:{
      url:'api/iterations/tree',
      method: 'GET',
      isArray: true
    }
  });
});
