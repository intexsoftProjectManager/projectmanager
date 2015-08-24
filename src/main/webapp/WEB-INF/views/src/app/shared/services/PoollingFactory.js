app.factory("poollingFactory", function ($interval) {

  var interval;

  function callFnOnInterval(fn, timeInterval) {
    interval = $interval(fn, timeInterval);
    return interval;
  }

  return {
    callFnOnInterval: callFnOnInterval,
    stop: function () {
      $interval.cancel(interval);
    }
  };
});