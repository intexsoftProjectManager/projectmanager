'use strict';

app.factory('Mail', function ($resource) {
  return $resource('api/mail/send', {id: '@id'}, {sent: {method: 'POST'}});
});
