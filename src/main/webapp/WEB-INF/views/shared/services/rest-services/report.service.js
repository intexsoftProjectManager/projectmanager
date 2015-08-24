'use strict';

app.factory('Report', function ($resource) {
  return $resource('api/report/', {}, {
    update: {
      method: 'PUT'
    },
    all: {
      method: 'GET',
      isArray: true
    },
    gerPerformance: {
      url:'api/report/performance',
      method: 'GET'
    }
  });
});
