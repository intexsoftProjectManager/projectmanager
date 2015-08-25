'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.directive('tmsChecklist', function () {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: "app/projects/project/checklists/checklist.html",
    scope: {
      group: "="
    },
    link: function () {
    }
  };
});
