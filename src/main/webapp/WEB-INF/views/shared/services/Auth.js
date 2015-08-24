'use strict';

app.factory('Auth', function ($location, $rootScope, Session, User, $cookieStore) {
  $rootScope.currentUser = $cookieStore.get('user') || null;
  $cookieStore.remove('user');

  return {
    login: function (provider, user, callback) {
      var cb = callback || angular.noop;
      Session.save({
        provider: provider,
        email: user.email,
        password: user.password,
        rememberMe: user.rememberMe
      }, function (user) {
        $rootScope.currentUser = user;
        $rootScope.$emit('user:changed');
        return cb();
      }, function (err) {
        return cb(err.data);
      });
    },

    logout: function (callback) {
      var cb = callback || angular.noop;
      Session.delete(function () {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
            $rootScope.$emit('user:changed');
            return cb();
          },
          function (err) {
            return cb(err.data);
          });
    },

    createUser: function (userinfo, callback) {
      var cb = callback || angular.noop;
      User.save(userinfo,
          function (user) {
            $rootScope.currentUser = user;
            $rootScope.$emit('user:changed');
            return cb();
          },
          function (err) {
            return cb(err.data);
          });
    },

    currentUser: function () {
      Session.get(function (user) {
        $rootScope.currentUser = user;
      });
    },

    changePassword: function (email, oldPassword, newPassword, callback) {
      var cb = callback || angular.noop;
      User.update({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, function () {
        return cb();
      }, function (err) {
        return cb(err.data);
      });
    },

    removeUser: function (email, password, callback) {
      var cb = callback || angular.noop;
      User.delete({
        email: email,
        password: password
      }, function () {
        return cb();
      }, function (err) {
        return cb(err.data);
      });
    },
    hasPermission: function (section, permission) {
      permission = permission.trim();
      var currentUserPermissions = $rootScope.currentUser.permissions;
      return currentUserPermissions[section][permission].value;
    },
    hasAccessToProject: function(params, cb){
      User.checkProjectAccess(params, function(){
        cb(true);
      }, function(){
        cb(false);
      })
    }
  };
});
