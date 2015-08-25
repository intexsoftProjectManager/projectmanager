'use strict';

app.factory('Builds', function ($resource) {
  return $resource('api/builds/:buildId', {
    buildId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
});
