'use strict';

app.factory('Session', function ($resource) {
  return $resource('/projectmanager/auth/session/');
});
