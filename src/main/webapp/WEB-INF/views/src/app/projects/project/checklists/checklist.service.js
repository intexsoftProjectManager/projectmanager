app.factory('checklistService', ['$rootScope', '$state', function ($rootScope, $state) {
  var service = {};

  service.update = function () {
    $rootScope.$broadcast('checklist:update');
  };

  service.deleteStepById = function (id){
    $rootScope.$broadcast('checklist:step:delete', id);
  };

  return service;
}
]);


