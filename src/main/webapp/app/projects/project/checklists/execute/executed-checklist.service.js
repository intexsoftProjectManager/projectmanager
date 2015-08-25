app.factory('ExecutedChecklistService', ['$rootScope', '$state', function ($rootScope, $state) {
  var service = {};
  var cachedChecklist = {};

  service.setChecklist = function(checklist) {
    cachedChecklist = checklist;
  };

  service.getChecklist = function() {
    return cachedChecklist;
  };

  service.update = function () {
    $rootScope.$broadcast('checklist:update');
  };

  return service;
}
]);


