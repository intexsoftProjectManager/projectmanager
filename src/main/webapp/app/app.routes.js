'use strict';

angular.module('tms').config(function ($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider
      .state('main', {
        url: '/',
        views: {
          '': {templateUrl: 'app/template.html'},
          'header@main': {
            templateUrl: 'app/navbar/navbar.html',
            controller: 'NavbarController',
            controllerAs: 'navbar'
          },
          'content@main': {
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
          },
          'footer@main': {
            templateUrl: 'app/footer.html'
          }
        }
      }).state('main.login', {
        url: 'login',
        views: {
          'content@main': {
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
          }
        },
        onEnter: function ($rootScope, $state) {
          var currentUser = $rootScope.currentUser;
          if (!!currentUser) {
            $state.go('main');
          }
        }
      }).state('main.projects', {
        url: 'projects',
        views: {
          'content@main': {
            templateUrl: 'app/projects/projects.html',
            controller: 'ProjectsController'
          }
        }
      })
      .state('main.projects.request', {
        url: '/request',
        views: {
          'content@main': {
            templateUrl: 'app/projects/request/request.html',
            controller: 'ProjectRequestController',
            controllerAs: 'projectRequest'
          }
        }
      })
      .state('main.projects.project', {
        url: '/:projectId',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/project.html',
            controller: 'ProjectController',
            controllerAs: 'project',
            resolve: ProjectController.resolve
          }
        },
        resolve:{
          projectId: ['$stateParams', function($stateParams){
            return $stateParams.projectId;
          }]
        }
      }).state('main.projects.project.checklists', {
        url: '/checklists?checklist',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/checklists/checklists.html',
            controller: 'ChecklistsController'
          }
        }
      }).state('main.projects.project.checklists.execute', {
        url: '/:executedChecklistId/execute',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/checklists/execute/execute.html',
            controller: 'ChecklistExecuteController',
            resolve: ChecklistExecuteController.resolve
          }
        }
      })
      .state('main.projects.project.timelines', {
        url: '/timelines',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/timelines/timelines.html',
            controller: 'TimeLinesController'
          }
        }
      })
      .state('main.projects.project.issues', {
        url: '/issues',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/issues/issues.html',
            controller: 'IssuesController'
          }
        }
      })
      .state('main.projects.project.issues.execute', {
        url: '/:executedChecklistId/execute',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/issues/execute/execute.html',
            controller: 'IssuesExecuteController',
            resolve: IssuesExecuteController.resolve
          }
        }
      }).state('main.projects.project.settings', {
        url: '/settings',
        views: {
          'content@main': {
            templateUrl: 'app/projects/project/settings/settings.html',
            controller: 'SettingsController',
            controllerAs: 'settings',
            resolve: SettingsController.resolve
          }
        }
      })
      .state('main.calendars', {
        url: 'calendars',
        abstract: true
      })
      .state('main.calendars.iterations', {
        url: '/iteration',
        views: {
          'content@main': {
            templateUrl: 'app/calendars/iteration/iteration.html',
            controller: 'IterationCalendarController'
          }
        }
      })
      .state('main.calendars.tasks', {
        url: '/task',
        views: {
          'content@main': {
            templateUrl: 'app/calendars/task/task.html',
            controller: 'TaskCalendarController'
          }
        }
      })
      .state('main.map', {
        url: 'gps-map',
        views: {
          'content@main': {
            templateUrl: 'app/utilities/gps-map/gps-map.html',
            controller: 'GPSMapController'
          }
        }
      })
      .state('main.admin', {
        url: 'admin',
        abstract: true
      })
      .state('main.admin.user-manage', {
        url: '/user-manage',
        views: {
          'content@main': {
            templateUrl: 'app/admin/user-manage/user-manage.html',
            controller: 'UserManageController'
          }
        }
      })
      $locationProvider.html5Mode(true);
    });
