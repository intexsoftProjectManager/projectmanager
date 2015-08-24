'use strict';

app.controller('MainController', MainController);

function MainController(FileUploader) {
  var vm = this;
  vm.onFileSelect = new FileUploader({
    url: '/api/report/performance'
  });
}
