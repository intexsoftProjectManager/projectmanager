'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.directive('checklistTreeView', function () {
  return {
    restrict: 'C',
    replace: false,
    templateUrl: "app/projects/project/checklists/checklist-folder-tree.html",
    scope: {
      folders: "="
    },
    link: function () {
    }
  };
});
