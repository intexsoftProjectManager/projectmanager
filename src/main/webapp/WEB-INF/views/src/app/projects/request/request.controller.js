'use strict';
app.controller('ProjectRequestController', ProjectRequestController);

function ProjectRequestController($timeout, Mail) {
  var vm = this;
  vm.request = {};
  vm.newRequest = {};
  vm.select2ProjectsOptions = {
    ajax: {
      url: "api/projects",
      quietMillis: 100,
      data: function (term) {
        term = {name: term};
        return {filter: JSON.stringify(term)};
      },
      results: function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          array.push({id: data[i]._id, text: data[i].name});
        }
        return {results: array};
      }
    },
    formatSelection: function (exercise) {
      vm.currentSelect = exercise;
      return exercise.text;
    },
    initSelection: function (element, callback) {
      callback(vm.currentSelect);
    }
  };

  vm.change = function (form, field) {
    if (field !== {}) {
      form.project.$setValidity('mongoose', true);
    }
  };

  vm.submit = function (form, request) {
    Mail.sent({
      request: request,
      type: 'requestTesting'
    }, function () {
      vm.requestTestingSuccess = true;
      $timeout(function () {
        vm.requestTestingSuccess = false;
      }, 5000);
      vm.request = {};
    }, function (errors) {
      vm.errors = {};
      angular.forEach(errors.data.errors, function (error, field) {
        form[field].$setValidity('mongoose', false);
        vm.errors[field] = error.type;
      });
    });
  };

  vm.submitNew = function (form, request) {
    Mail.sent({
      request: request,
      type: 'requestNewTesting'
    }, function () {
      vm.requestNewTestingSuccess = true;
      $timeout(function () {
        vm.requestNewTestingSuccess = false;
      }, 5000);
      vm.newRequest = {};
    }, function (errors) {
      vm.errors = {};
      angular.forEach(errors.data.errors, function (error, field) {
        form[field].$setValidity('mongoose', false);
        vm.errors[field] = error.type;
      });
      vm.errors.other = errors.data.message;
    });
  };
}
