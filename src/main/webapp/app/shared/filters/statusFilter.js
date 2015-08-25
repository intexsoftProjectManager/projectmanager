app.filter('statusFilter', function() {
  return function(steps, filters) {
    return steps.filter(function(step) {
      for (var i= 0,len=filters.length;i<len;i++) {
        if (step.status == filters[i]) {
          return true;
        } else if (step.status == undefined){
          return true;
        } else if (step.group){
          return true;
        }
      }
      return false;
    });
  };
});
