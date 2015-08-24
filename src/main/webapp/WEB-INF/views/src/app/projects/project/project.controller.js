'use strict';
app.controller('ProjectController', ProjectController);

function ProjectController($rootScope, $scope, $injector, $state, Socket) {
  var vm = this;
  var Projects = $injector.get('Projects');
  var Auth = $injector.get('Auth');
  var User = $injector.get('User');
  var Charts = $injector.get('Charts');
 // var Socket = $injector.get('Socket');
  vm.priorities = $injector.get('priorities');
  var projectId = $state.$current.locals['globals'].projectId;
  vm.project = $state.$current.locals['content@main'].project;
  vm.checklists = $state.$current.locals['content@main'].checklists;
  vm.iterations = $state.$current.locals['content@main'].iterations;
  vm.executedChecklists = $state.$current.locals['content@main'].executedChecklists;
  vm.finishedCheklists = $state.$current.locals['content@main'].finishedCheklists;
  vm.redmineIterations = $state.$current.locals['content@main'].redmineIterations;
  vm.data = $state.$current.locals['content@main'].passFailChart;
  vm.isAdmin = $rootScope.currentUser ? $rootScope.currentUser.admin : false;
  vm.users = User.query();

  vm.hasPermissionEdit = Auth.hasPermission('Projects', 'Edit');
  vm.hasPermissionAdd = Auth.hasPermission('Projects', 'Add');

  vm.openExecutedChecklist = function (executedChecklist) {
    if (executedChecklist.type === "checklist") {
      $state.go('main.projects.project.checklists.execute', {executedChecklistId: executedChecklist._id});
    } else if (executedChecklist.type === "issue") {
      $state.go('main.projects.project.issues.execute', {executedChecklistId: executedChecklist._id});
    }
  };

  /* Fix time problem*/
  var toUTCDate = function (date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  };

  var millisToUTCDate = function (millis) {
    millis = millis ? millis : 0;
    return toUTCDate(new Date(millis));
  };

  vm.toUTCDate = toUTCDate;
  vm.millisToUTCDate = millisToUTCDate;

  vm.updateScroll = function(){
    setTimeout(function () {
      $scope.$broadcast('recalculateMBScrollbars');
    }, 50);
  };

  vm.update = function () {
    vm.project.$update();
  };

  vm.changeToDevTesterAll = function() {
    vm.chartObject.type = "ColumnChart";
    Projects.getRedmineDevTesterIssuesChart({project: projectId}).$promise.then(function(data){
        vm.chartObject.data = data;
    });
  };

  vm.changeToDevTester = function(iteration) {
    vm.chartObject.type = "PieChart";
    Projects.getRedmineDevTesterIssuesChart({
      project: projectId,
      iteration: JSON.stringify(iteration)
    }).$promise.then(function(data){
        vm.chartObject.data = data;
    });
  };

  vm.changeToPassFail = function() {
    vm.chartObject.type = "LineChart";
    Projects.getPassFailChart({
      project: projectId
    }).$promise.then(function(data){
      vm.chartObject.data = data;
    });
  };

  vm.changeToRedmineIssues = function() {
    vm.chartObject.type = "LineChart";
    Projects.getRedmineIssuesChart({
      project: projectId
    }).$promise.then(function(data){
        vm.chartObject.data = data;
    });
  };

  vm.changeToDefectsByPriority = function() {
    vm.chartObject.type = "LineChart";
    Projects.getDefectsByPriority({
      project: projectId
    }).$promise.then(function(data){
        vm.chartObject.data = data;
    });
  };

  vm.chartObject = {
    "type": "LineChart",
    "displayed": true,
    "data": vm.data,
    "options": {
      "title": "",
      "width":975,
      "height":405,
      "isStacked": "true",
      "fill": 20,
      "displayExactValues": true,
      "vAxis": {
        "title": "Number",
        "gridlines": {
          "count": 10
        },
        logScale: false
      },
      "focusTarget": 'category',
      "tooltip": {
        "trigger": 'both'
      },
      "hAxis": {
        "title": "Date",
        format: "dd/MM/yy"
      }
    },
    "formatters": {
      "date":[
        {
          columnNum: 0,
          formatType: 'short'
        }
       ]
    }
  };

  vm.chartReady = function (chart) {
    vm.chartObject.image = chart.getChart().getImageURI();
  };

  vm.downloadChart = function() {
    var myImage = new Image;
    myImage.src = vm.chartObject.image;
    myImage.onload = function () {
      var newWindow = window.open("", "Chart", "scrollbars=0, toolbar=0, width=" + (myImage.width + 25) + ", height=" + (myImage.height + 25));
      newWindow.document.write(myImage.outerHTML);
    }
  }
}

ProjectController.resolve = {
  project: ['Projects', '$stateParams', function(Projects, $stateParams){
    return Projects.get({
      projectId: $stateParams.projectId
    });
  }],
  checklists: ['Checklists', '$stateParams', function(Checklists, $stateParams) {
    return Checklists.query({
      project: $stateParams.projectId
    });
  }],
  iterations: ['Iterations', '$stateParams', function(Iterations, $stateParams) {
    return Iterations.query({
      project: $stateParams.projectId
    });
  }],
  executedChecklists: ['ExecutedChecklists', '$stateParams', function(ExecutedChecklists, $stateParams) {
    return ExecutedChecklists.query({
      project: $stateParams.projectId,
      status: [0, 1]
    });
  }],
  finishedCheklists: ['ExecutedChecklists', '$stateParams', function(ExecutedChecklists, $stateParams) {
    return ExecutedChecklists.query({
      project: $stateParams.projectId,
      status: [2]
    });
  }],
  redmineIterations: ['Projects', '$stateParams', function(Projects, $stateParams) {
    return Projects.getRedmineIterations({
      project: $stateParams.projectId
    });
  }],
  passFailChart: ['Projects', '$stateParams', function(Projects, $stateParams) {
    return Projects.getPassFailChart({
      project: $stateParams.projectId
    }).$promise;
  }]
};
