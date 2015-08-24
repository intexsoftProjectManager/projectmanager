'use strict';

app.factory('IterationCalendar', function ($resource) {
  return $resource('api/calendar/iteration', null, {
    update: {
      method: 'PUT'
    }
  });
});
