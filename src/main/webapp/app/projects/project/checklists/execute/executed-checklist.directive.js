'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.directive('tmsExecutedChecklist', function () {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: "app/projects/project/checklists/execute/executed-checklist.html",
    scope: {
      group: "=",
      envs:"=",
      filters:"="
    },
    link: function () {
    }
  };
});
