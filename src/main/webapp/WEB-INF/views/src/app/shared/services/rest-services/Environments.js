'use strict';

app.factory('Environments', function ($resource) {
  return $resource('api/environments/:environmentId', {
    environmentId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
});
