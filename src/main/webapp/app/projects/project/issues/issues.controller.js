'use strict';

app.controller('IssuesController', function ($scope, $rootScope, $state, $injector, projectId, priorities) {
  var Tasks = $injector.get('Tasks');
  var Projects = $injector.get('Projects');
  var ExecutedChecklists = $injector.get('ExecutedChecklists');
  $scope.issues = {};
  $scope.isOpen = true;
  $scope.issueName = "Issues";
  $scope.filters = {status:"3", tracker:"1", versions:""};
  $scope.getIssues = function () {
    $scope.issues = Tasks.getRedmineTasks({
        projectId: projectId,
        status: $scope.filters.status,
        tracker: $scope.filters.tracker
      });
    $scope.versions = Projects.getRedmineIterations({
      project: projectId
    });
  };

  $scope.statuses = [
    {id:"1", name:"New"},
    {id:"2", name:"In Progress"},
    {id:"3", name:"Resolved"},
    {id:"4", name:"Feedback"},
    {id:"8", name:"Verified"},
    {id:"5", name:"Closed"},
    {id:"6", name:"Rejected"}];

  $scope.trackers = [
    {id:"1", name:"Bug"},
    {id:"2", name:"Feature"},
    {id:"3", name:"Support"},
    {id:"7", name:"Info"}];

  $scope.getPriorityImage = function(priority){
    var url;
    priorities.some(function(element){
      if (element.text === priority){
        url = element.img;
        return true;
      }
    });
    return url ? url : priorities[2].img;
  };

  $scope.executeIssues = function (event, issues) {
    event.stopPropagation();
    var checklist = {};
    checklist.name = $scope.issueName;
    checklist.steps = issues;
    checklist.project = projectId;
    checklist.type = 'issue';
    issues.creator = $rootScope.currentUser;
    issues.creationDate = new Date();
    var executeChecklist = new ExecutedChecklists(checklist);
    executeChecklist.$save(function (executedChecklist) {
      $state.go('main.projects.project.issues.execute',{executedChecklistId: executedChecklist._id});
    });
  };

  $scope.applyFilter = function(filters){
    $scope.issues = undefined;
    $scope.issues = Tasks.getRedmineTasks({
        projectId:projectId,
        status: filters.status,
        tracker:filters.tracker,
        version:filters.version
      });
  }

});
