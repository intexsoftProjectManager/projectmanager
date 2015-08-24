'use strict';

app.factory('Projects', function ($resource) {
  return $resource('api/projects/:projectId', {
    projectId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    getProject: {
      isArray: true
    },
    getPassFailChart:{
      url:'api/charts/passFail',
        method: 'GET',
        isArray: false
    },
    getDefectsByPriority:{
      url:'api/charts/defectsByPriority',
      method: 'GET',
      isArray: false
    },
    getRedmineIssuesChart:{
      url:'api/charts/redmineIssues',
      method: 'GET',
      isArray: false
    },
    getRedmineDevTesterIssuesChart:{
      url:'/api/charts/devTester',
      method: 'GET',
      isArray: false
    },
    getRedmineIterations:{
      url:'/api/redmine/iterations',
      method: 'GET',
      isArray: true
    }
  });
});
