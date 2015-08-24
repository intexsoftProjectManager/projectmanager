'use strict';

app.controller('SettingsController', SettingsController);

function SettingsController($scope, $state, $injector) {
  var vm = this;
  var Builds = $injector.get('Builds');
  var Environments = $injector.get('Environments');
  vm.builds = $state.$current.locals['content@main'].builds;
  vm.envs = $state.$current.locals['content@main'].envs;

  vm.updateScroll = function(){
    setTimeout(function () {
      $scope.$broadcast('recalculateMBScrollbars');
    }, 50);
  };

  vm.update = function(item) {
    item.$update();
  };

  vm.addBuild = function(){
    var build = {};
    build = new Builds(build);
    build.name = 'New build';
    build._project = $state.params.projectId;
    build.$save().then(function(build){
      vm.builds.push(build);
    })
  };

  vm.addEnv = function(){
    var env = {};
    env = new Environments(env);
    env.name = 'New environment';
    env._project = $state.params.projectId;
    env.$save().then(function(env){
      vm.envs.push(env);
    })
  };
}

SettingsController.resolve = {
  builds: ['Builds', '$stateParams', function(Builds, $stateParams){
    return Builds.query({project:$stateParams.projectId});
  }],
  envs: ['Environments','$stateParams', function(Environments, $stateParams){
    return Environments.query({project:$stateParams.projectId});
  }]
};
