'use strict';

app.controller('NavbarController', NavbarController);

function NavbarController($rootScope, $state, $injector) {
  var vm = this;
  var Projects = $injector.get('Projects');
  var Auth = $injector.get('Auth');

  vm.project = $state.params.projectId ? Projects.get({projectId: $state.params.projectId}) : null;
  vm.currentUser = $rootScope.currentUser;
  vm.isAdmin = vm.currentUser ? vm.currentUser.admin : false;

  $rootScope.$on('user:changed', function(){
    vm.currentUser = $rootScope.currentUser;
    vm.isAdmin = vm.currentUser ? vm.currentUser.admin : false;
  });

  vm.refreshProjects = function(project) {
    return Projects.getProject(
      {filter: {name:project}}
    ).$promise.then(function(projects) {
        vm.projects = projects;
      });
  };

  vm.open = function (project) {
      if (vm.includes('main.projects.project')) {
        $state.go($state.current.name, {projectId: project._id});
      } else {
        $state.go('main.projects.project', {projectId: project._id});
      }
  };

  vm.logout = function () {
    Auth.logout(function (err) {
      if (!err) {
        $state.go('main.login');
      }
    });
  };

  vm.is = function(name){
    return $state.is(name);
  };

  vm.includes = function(name){
    return $state.includes(name);
  };

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams){
      if (toParams.projectId == null) {
        vm.project = null;
      } else if (vm.project == null) {
        vm.project = Projects.get({projectId: toParams.projectId});
      }
    })
}
