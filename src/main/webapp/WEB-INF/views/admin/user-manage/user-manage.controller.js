'use strict';
app.controller('UserManageController', UserManageController);

function UserManageController($scope, User, ngDialog) {
  $scope.selectedUser = {};
  $scope.newUser = {};
  User.query(function (users) {
    $scope.users = users;
    $scope.selectedUser = users[0];
    users[0].$selected = true;
  });
  $scope.addRole = function () {
    var addRole = ngDialog.openConfirm({
      template: 'app/admin/user-manage/modals/add-role.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    addRole.then(function () {
      //do something here
    });
  };

  $scope.addUser = function () {
    var addUser = ngDialog.openConfirm({
      template: 'app/admin/user-manage/modals/add-user.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    addUser.then(function () {
      var user = new User($scope.newUser);
      user.$save(function (user) {
        $scope.selectedUser.$selected = false;
        user.$selected = true;
        $scope.users.push(user);
        $scope.selectedUser = user;
      });
    });
  };

  $scope.editUser = function () {
    var editUser = ngDialog.openConfirm({
      template: 'app/admin/user-manage/modals/edit-user.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: true
    });
    editUser.then(function () {
      $scope.selectedUser.$update(function () {
        $scope.selectedUser.$selected = true;
      });
    });
  };

  $scope.selectUser = function (user) {
    $scope.selectedUser.$selected = false;
    $scope.selectedUser = user;
    $scope.selectedUser.$selected = true;
  };

  $scope.update = function () {
    $scope.selectedUser.$update(function () {
      $scope.selectedUser.$selected = true;
    });
  };
}
