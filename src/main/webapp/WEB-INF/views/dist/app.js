System.registerModule("../es6/annotations.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/annotations.js";
  var Directive = function Directive(name, options) {
    this.name = name;
    this.options = options;
  };
  ($traceurRuntime.createClass)(Directive, {}, {});
  var ControllerAs = function ControllerAs(name) {
    this.name = name;
  };
  ($traceurRuntime.createClass)(ControllerAs, {}, {});
  var ModuleAs = function ModuleAs(name) {
    this.name = name;
  };
  ($traceurRuntime.createClass)(ModuleAs, {}, {});
  var Filter = function Filter(name) {
    this.name = name;
  };
  ($traceurRuntime.createClass)(Filter, {}, {});
  var Inject = function Inject() {
    for (var deps = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      deps[$traceurRuntime.toProperty($__3)] = arguments[$traceurRuntime.toProperty($__3)];
    this.deps = [];
    for (var $__1 = deps[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
        $__2; !($__2 = $__1.next()).done; ) {
      var dep = $__2.value;
      {
        this.deps = this.deps.concat(dep.replace(/\s+/g, '').split(','));
      }
    }
  };
  ($traceurRuntime.createClass)(Inject, {}, {});
  var InjectAsProperty = function InjectAsProperty(name) {
    var propertyName = arguments[1] !== (void 0) ? arguments[1] : null;
    this.name = name;
    this.propertyName = propertyName || name;
  };
  ($traceurRuntime.createClass)(InjectAsProperty, {}, {});
  var Parser = function Parser(constructor) {
    this.constructor = constructor;
  };
  ($traceurRuntime.createClass)(Parser, {
    getAllAnnotations: function() {
      return this.annotations || (this.annotations = this.extractAnnotations(this.constructor));
    },
    getAnnotations: function(annotationConstructor) {
      var annotations = this.getAllAnnotations();
      var result = [];
      for (var $__1 = annotations[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__2; !($__2 = $__1.next()).done; ) {
        var annotation = $__2.value;
        {
          if (annotation instanceof annotationConstructor) {
            result.push(annotation);
          }
        }
      }
      return result;
    },
    extractAnnotations: function(constructor) {
      var annotations = constructor.annotations || [];
      var parent = Object.getPrototypeOf(constructor);
      if ('function' === typeof parent) {
        annotations = annotations.concat(this.extractAnnotations(parent));
      }
      return annotations;
    }
  }, {});
  return {
    get Directive() {
      return Directive;
    },
    get ControllerAs() {
      return ControllerAs;
    },
    get ModuleAs() {
      return ModuleAs;
    },
    get Filter() {
      return Filter;
    },
    get Inject() {
      return Inject;
    },
    get InjectAsProperty() {
      return InjectAsProperty;
    },
    get Parser() {
      return Parser;
    }
  };
});
System.get("../es6/annotations.js" + '');
System.registerModule("../es6/app.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/app.js";
  var app = angular.module('tms', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'http-auth-interceptor', 'ui.bootstrap', 'ngTable', 'ui.select2', 'btford.socket-io', 'ui.calendar', 'angularSpectrumColorpicker', 'ngDialog', 'acute.select', 'xeditable', 'ngProgress', 'textAngular', 'ng-iscroll', 'infinite-scroll', 'google-maps', 'checklist-model', 'mb-scrollbar', 'ng-context-menu', 'nvd3']).config(function($routeProvider, $locationProvider, ngProgressProvider) {
    ngProgressProvider.setColor('firebrick');
    ngProgressProvider.setHeight('2px');
    $routeProvider.when('/', {
      templateUrl: 'es6/main/main.html',
      controller: 'MainController'
    }).when('/projects', {
      templateUrl: 'partials/projects/projects.html',
      controller: 'ProjectsCtrl'
    }).when('/projects/request', {
      templateUrl: 'partials/projects/request.html',
      controller: 'ProjectRequestCtrl'
    }).when('/projects/:projectId', {
      templateUrl: 'partials/projects/project.html',
      controller: 'ProjectCtrl',
      checkAccessToProject: true
    }).when('/projects/:projectId/checklists', {
      templateUrl: 'partials/projects/checklists/checklists.html',
      controller: 'ChecklistsCtrl',
      checkAccessToProject: true
    }).when('/projects/:projectId/timelines', {
      templateUrl: 'partials/projects/timelines/timelines.html',
      controller: 'TimeLinesCtrl',
      checkAccessToProject: true
    }).when('/projects/:projectId/checklists/execute/:executedChecklistId', {
      templateUrl: 'partials/projects/checklists/execute.html',
      controller: 'ChecklistExecuteController',
      checkAccessToProject: true
    }).when('/projects/:projectId/issues', {
      templateUrl: 'partials/projects/issues/issues.html',
      controller: 'IssuesCtrl',
      checkAccessToProject: true
    }).when('/calendar/iterations', {
      templateUrl: 'partials/calendar/iteration.html',
      controller: 'IterationCalendarCtrl'
    }).when('/calendar/tasks', {
      templateUrl: 'partials/calendar/task.html',
      controller: 'TaskCalendarCtrl'
    }).when('/login', {
      templateUrl: 'es6/login/login.html',
      controller: 'LoginController',
      controllerAs: 'loginCtrl'
    }).when('/signup', {
      templateUrl: 'partials/signup.html',
      controller: 'SignupCtrl'
    }).when('/map', {
      templateUrl: 'partia1ls/utilities/gps_map.html',
      controller: 'GPSMapCtrl'
    }).when('/admin/user-manage', {
      templateUrl: 'partials/admin/user-manage.html',
      controller: 'UserManageCtrl'
    }).otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }).run(function($rootScope, $location, Auth, acuteSelectService, editableOptions) {
    editableOptions.theme = 'bs3';
    acuteSelectService.updateSetting("templatePath", "/views/acute");
    $rootScope.$watch('currentUser', function(currentUser) {
      if (!currentUser && (['/login', '/logout', '/signup', '/projects/request'].indexOf($location.path()) === -1)) {
        Auth.currentUser();
      }
    });
    $rootScope.$on('event:auth-loginRequired', function() {
      $rootScope.originalUrl = $location.path();
      $location.path('/login');
      return false;
    });
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (next.checkAccessToProject) {
        Auth.hasAccessToProject(next.params, function(hasAccess) {
          if (!hasAccess) {
            $location.path('/');
          }
        });
      }
    });
    setTimeout(function() {
      $('.splash').fadeOut(1000, "swing");
    }, 2000);
  });
  return {};
});
System.get("../es6/app.js" + '');
System.registerModule("../es6/registry.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/registry.js";
  var $__0 = System.get("../es6/annotations.js"),
      Filter = $__0.Filter,
      Parser = $__0.Parser,
      Directive = $__0.Directive,
      ControllerAs = $__0.ControllerAs,
      ModuleAs = $__0.ModuleAs,
      Inject = $__0.Inject,
      InjectAsProperty = $__0.InjectAsProperty;
  function getPreparedConstructor(controller) {
    var parser = new Parser(controller);
    var annotations = parser.getAnnotations(Inject).reverse();
    var $inject = [];
    for (var $__1 = annotations[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
        $__2; !($__2 = $__1.next()).done; ) {
      var annotation = $__2.value;
      {
        $inject = $inject.concat(annotation.deps);
      }
    }
    var injectsViaInjectCount = $inject.length;
    var injectAsProperty = parser.getAnnotations(InjectAsProperty);
    var propertyMap = {};
    if (!injectAsProperty.length && !annotations.length) {
      return false;
    }
    for (var $__3 = injectAsProperty[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
        $__4; !($__4 = $__3.next()).done; ) {
      var annotation$__6 = $__4.value;
      {
        $inject.push(annotation$__6.propertyName);
        propertyMap[$traceurRuntime.toProperty(annotation$__6.propertyName)] = $inject.length - 1;
      }
    }
    var constructor = $inject;
    constructor.push((function() {
      for (var deps = [],
          $__5 = 0; $__5 < arguments.length; $__5++)
        deps[$traceurRuntime.toProperty($__5)] = arguments[$traceurRuntime.toProperty($__5)];
      var args = deps.slice(0, injectsViaInjectCount);
      var instance = new (Function.prototype.bind.apply(controller, $traceurRuntime.spread([null], args)))();
      for (var name in propertyMap)
        if (!$traceurRuntime.isSymbolString(name)) {
          instance[$traceurRuntime.toProperty(name)] = deps[$traceurRuntime.toProperty(propertyMap[$traceurRuntime.toProperty(name)])];
        }
      return instance;
    }));
    return constructor;
  }
  function registerModuleFilter(angularModule, controller) {
    var parser = new Parser(controller);
    var annotations = parser.getAnnotations(Filter);
    if (!annotations.length) {
      throw 'No Filter annotations on class ' + controller;
    }
    var FilterAnnotation = annotations[$traceurRuntime.toProperty(annotations.length - 1)];
    var constructor = getPreparedConstructor(controller);
    if (!constructor) {
      constructor = function() {
        var instance = new controller();
        return instance.filter;
      };
      angularModule.filter(FilterAnnotation.name, constructor);
    } else {
      var diFunction = constructor[$traceurRuntime.toProperty(constructor.length - 1)];
      var overwrittenConstructor = constructor;
      overwrittenConstructor[$traceurRuntime.toProperty(overwrittenConstructor.length - 1)] = function() {
        for (var deps = [],
            $__5 = 0; $__5 < arguments.length; $__5++)
          deps[$traceurRuntime.toProperty($__5)] = arguments[$traceurRuntime.toProperty($__5)];
        var instance = diFunction.apply(null, $traceurRuntime.spread(deps));
        return instance.filter.bind(instance);
      };
      angularModule.filter(FilterAnnotation.name, overwrittenConstructor);
    }
  }
  function registerModuleDirective(angularModule, controller) {
    var parser = new Parser(controller);
    var annotations = parser.getAnnotations(Directive);
    if (!annotations.length) {
      throw 'No Directive annotations on class ' + controller;
    }
    var constructor = getPreparedConstructor(controller);
    if (!constructor)
      constructor = controller;
    var DirectiveAnnotation = annotations[0];
    var definition = DirectiveAnnotation.options || {};
    if (!definition.controller) {
      definition.controller = constructor;
    }
    if (!definition.link) {
      if (angular.isString(definition.require)) {
        definition.require = [definition.require];
      }
      if (angular.isArray(definition.require) && DirectiveAnnotation.name !== definition.require[0]) {
        definition.require.unshift(DirectiveAnnotation.name);
      }
      definition.link = function(scope, element, attr, ctrl, transclude) {
        var ownController,
            controllersToPass;
        if (angular.isArray(ctrl)) {
          ownController = ctrl.shift();
        } else {
          ownController = ctrl;
        }
        if (angular.isArray(ctrl) && 1 === ctrl.length) {
          ctrl = ctrl[0];
        }
        if (ownController && ownController.link) {
          ownController.link.apply(ownController, [scope, element, attr, ctrl, transclude]);
        }
      };
    }
    var options = angular.isFunction(definition) || angular.isArray(definition) ? definition : function() {
      return definition;
    };
    angularModule.directive(DirectiveAnnotation.name, options);
  }
  function registerModuleController(controller) {
    var parser = new Parser(controller);
    var annotations = parser.getAnnotations(ModuleAs);
    if (!annotations.length) {
      throw 'No Module 111 annotations on class ' + controller;
    }
    var ModuleAnnotation = annotations[0];
    annotations = parser.getAnnotations(ControllerAs);
    if (!annotations.length) {
      throw 'No Controller annotations on class ' + controller;
    }
    var constructor = getPreparedConstructor(controller);
    if (!constructor)
      constructor = controller;
    var ControllerAnnotation = annotations[0];
    angular.module(ModuleAnnotation.name).controller(ControllerAnnotation.name, constructor);
  }
  function registerControllerDecorator(angularModule) {
    angularModule.config(function($provide) {
      $provide.decorator("$controller", ['$delegate', (function($delegate) {
        return function() {
          for (var args = [],
              $__5 = 0; $__5 < arguments.length; $__5++)
            args[$traceurRuntime.toProperty($__5)] = arguments[$traceurRuntime.toProperty($__5)];
          if (angular.isString(args[0])) {
            try {
              var moduleClass = System.get(args[0]);
              if (moduleClass) {
                var preparedConstructor = getPreparedConstructor(moduleClass.default);
                args[0] = preparedConstructor || moduleClass.default;
              }
            } catch (e) {
              throw e;
            }
          }
          return $delegate.apply(null, $traceurRuntime.spread(args));
        };
      })]);
    });
  }
  return {
    get getPreparedConstructor() {
      return getPreparedConstructor;
    },
    get registerModuleFilter() {
      return registerModuleFilter;
    },
    get registerModuleDirective() {
      return registerModuleDirective;
    },
    get registerModuleController() {
      return registerModuleController;
    },
    get registerControllerDecorator() {
      return registerControllerDecorator;
    }
  };
});
System.registerModule("../es6/shared/utils/controller.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/shared/utils/controller.js";
  var registerModuleController = System.get("../es6/registry.js").registerModuleController;
  var Controller = function Controller() {
    registerModuleController(this.constructor);
  };
  ($traceurRuntime.createClass)(Controller, {}, {});
  return {get Controller() {
      return Controller;
    }};
});
System.registerModule("../es6/login/login.controller.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/login/login.controller.js";
  var $__0 = System.get("../es6/annotations.js"),
      Inject = $__0.Inject,
      ModuleAs = $__0.ModuleAs,
      ControllerAs = $__0.ControllerAs;
  var Controller = System.get("../es6/shared/utils/controller.js").Controller;
  var LoginCtrl = function LoginCtrl($rootScope, Auth, $location) {
    $traceurRuntime.superConstructor($LoginCtrl).call(this);
    var self = this;
    self.error = {};
    self.user = {};
    self.$rootScope = $rootScope;
    self.Auth = Auth;
    self.$location = $location;
  };
  var $LoginCtrl = LoginCtrl;
  ($traceurRuntime.createClass)(LoginCtrl, {login: function(form) {
      var self = this;
      var loginResultHandler = function(err) {
        self.errors = {};
        if (!err) {
          if (self.$rootScope.originalUrl) {
            self.$location.path(self.$rootScope.originalUrl);
            self.$rootScope.originalUrl = null;
          } else {
            self.$location.path('/');
          }
        } else {
          angular.forEach(err.errors, function(error, field) {
            form[$traceurRuntime.toProperty(field)].$setValidity('mongoose', false);
            self.errors[$traceurRuntime.toProperty(field)] = error.type;
          });
          self.error.other = err.message;
        }
      };
      self.Auth.login('password', {
        'email': self.user.email,
        'password': self.user.password
      }, loginResultHandler);
    }}, {}, Controller);
  Object.defineProperty(LoginCtrl, "annotations", {get: function() {
      return [new ModuleAs('tms'), new ControllerAs('LoginController'), new Inject('$rootScope', 'Auth', '$location')];
    }});
  var $__default = new LoginCtrl();
  return {get default() {
      return $__default;
    }};
});
System.get("../es6/login/login.controller.js" + '');
System.registerModule("../es6/main/main.controller.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/main/main.controller.js";
  var $__0 = System.get("../es6/annotations.js"),
      Inject = $__0.Inject,
      ModuleAs = $__0.ModuleAs,
      ControllerAs = $__0.ControllerAs;
  var Controller = System.get("../es6/shared/utils/controller.js").Controller;
  var MainCtrl = function MainCtrl($scope, $rootScope) {
    $traceurRuntime.superConstructor($MainCtrl).call(this);
  };
  var $MainCtrl = MainCtrl;
  ($traceurRuntime.createClass)(MainCtrl, {}, {}, Controller);
  Object.defineProperty(MainCtrl, "annotations", {get: function() {
      return [new ModuleAs('tms'), new ControllerAs('MainController'), new Inject('$scope, $rootScope')];
    }});
  var $__default = new MainCtrl();
  return {get default() {
      return $__default;
    }};
});
System.get("../es6/main/main.controller.js" + '');
System.get("../es6/registry.js" + '');
System.registerModule("../es6/shared/services/auth/auth.service.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/shared/services/auth/auth.service.js";
  var Inject = System.get("../es6/annotations.js").Inject;
  var Auth = function Auth($location, $rootScope, Session, User, $cookieStore) {
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Session = Session;
    this.User = User;
    this.$cookieStore = $cookieStore;
    this.$rootScope.currentUser = this.$cookieStore.get('user') || null;
    this.$cookieStore.remove('user');
  };
  ($traceurRuntime.createClass)(Auth, {
    login: function(provider, user, callback) {
      var self = this;
      var cb = callback || angular.noop;
      self.Session.get().save({
        provider: provider,
        email: user.email,
        password: user.password,
        rememberMe: user.rememberMe
      }, function(user) {
        self.$rootScope.currentUser = user;
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },
    logout: function(callback) {
      var self = this;
      var cb = callback || angular.noop;
      self.Session.delete(function() {
        self.$rootScope.currentUser = null;
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },
    createUser: function(userinfo, callback) {
      var self = this;
      var cb = callback || angular.noop;
      self.User.save(userinfo, function(user) {
        self.$rootScope.currentUser = user;
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },
    currentUser: function() {
      var self = this;
      self.Session.get(function(user) {
        self.$rootScope.currentUser = user;
      });
    },
    changePassword: function(email, oldPassword, newPassword, callback) {
      var self = this;
      var cb = callback || angular.noop;
      self.User.update({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, function() {
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },
    removeUser: function(email, password, callback) {
      var self = this;
      var cb = callback || angular.noop;
      self.User.delete({
        email: email,
        password: password
      }, function() {
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },
    hasPermission: function(section, permission) {
      var self = this;
      permission = permission.trim();
      var currentUserPermissions = self.$rootScope.currentUser.permissions;
      return currentUserPermissions[$traceurRuntime.toProperty(section)][$traceurRuntime.toProperty(permission)].value;
    },
    hasAccessToProject: function(params, cb) {
      var self = this;
      self.User.checkProjectAccess(params, function() {
        cb(true);
      }, function() {
        cb(false);
      });
    }
  }, {});
  Object.defineProperty(Auth, "annotations", {get: function() {
      return [new Inject('$location, $rootScope, Session, User, $cookieStore')];
    }});
  angular.module('tms').service("Auth", Auth);
  return {get Auth() {
      return Auth;
    }};
});
System.get("../es6/shared/services/auth/auth.service.js" + '');
System.registerModule("../es6/shared/services/session/session.service.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/shared/services/session/session.service.js";
  var Inject = System.get("../es6/annotations.js").Inject;
  var Session = function Session($resource) {
    this.$resource = $resource;
  };
  ($traceurRuntime.createClass)(Session, {get: function() {
      return this.$resource('/auth/session/');
    }}, {});
  var $__default = Session;
  Object.defineProperty(Session, "annotations", {get: function() {
      return [new Inject('$resource')];
    }});
  angular.module('tms').service("Session", Session);
  return {get default() {
      return $__default;
    }};
});
System.get("../es6/shared/services/session/session.service.js" + '');
System.registerModule("../es6/shared/services/user/user.service.js", [], function(require) {
  "use strict";
  var __moduleName = "../es6/shared/services/user/user.service.js";
  var Inject = System.get("../es6/annotations.js").Inject;
  var User = function User() {};
  ($traceurRuntime.createClass)(User, {user: function() {
      return this.$resource('/auth/users/:id/', {id: '@_id'}, {
        'update': {method: 'PUT'},
        checkProjectAccess: {
          url: '/auth/projects/:projectId',
          method: 'GET'
        }
      });
    }}, {});
  var $__default = User;
  Object.defineProperty(User, "annotations", {get: function() {
      return [new InjectAsProperty('$resource')];
    }});
  angular.module('tms').service("User", User);
  return {get default() {
      return $__default;
    }};
});
System.get("../es6/shared/services/user/user.service.js" + '');
System.get("../es6/shared/utils/controller.js" + '');

//# sourceMappingURL=app.js
