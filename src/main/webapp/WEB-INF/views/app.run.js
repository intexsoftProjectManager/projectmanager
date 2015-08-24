'use strict';

angular.module('tms').run(function ($rootScope, $location, Auth, acuteSelectService, editableOptions, $state) {
      //Init editable
      editableOptions.theme = 'bs3';
      //Init acute combobox
      acuteSelectService.updateSetting("templatePath", "/app/shared/acute/");
      //watching the value of the currentUser variable.
      $rootScope.$watch('currentUser', function (currentUser) {
        // if no currentUser and on a page that requires authorization then try to update it
        // will trigger 401s if user does not have a valid session
        if (!currentUser && (['/login', '/logout', '/signup', '/projects/request'].indexOf($location.path()) === -1 )) {
          Auth.currentUser();
        }
      });
      // On catching 401 errors, redirect to the login page.
      $rootScope.$on('event:auth-loginRequired', function () {
        $rootScope.originalUrl = $location.path();
        $state.go('main.login');
        return false;
      });
      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (next.checkAccessToProject) {
          Auth.hasAccessToProject(next.params, function(hasAccess){
            if (!hasAccess) {
              $state.go('main');
            }
          });
        }
      });

    setTimeout(function() {
      $('.splash').fadeOut(1000,"swing");
    }, 2000);
  });
