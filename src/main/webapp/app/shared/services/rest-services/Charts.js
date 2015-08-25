'use strict';

app.factory('Charts', function ($resource, $http) {
  return $resource('api/charts/:chartId', {
    chartId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    download:{
      url:'api/charts/download',
        method: 'POST'
    }
  });
});
