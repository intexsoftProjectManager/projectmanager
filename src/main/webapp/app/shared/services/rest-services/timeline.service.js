'use strict';

app.factory('TimeLine', function ($resource) {
  return $resource('api/timeline/', {}, {
    update: {
      method: 'PUT'
    },
    all: {
      method: 'GET',
      isArray: true
    }
  });
});
