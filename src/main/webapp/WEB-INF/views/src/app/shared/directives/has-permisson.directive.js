'use strict';
/**
 * Created by vchadyuk on 26.05.2014.
 */

app.directive('hasPermission', function(Auth) {
  return {
    link: function(scope, element, attrs) {
      if(!_.isString(attrs.hasPermission))
        throw "hasPermission value must be a string";

      var values = attrs.hasPermission.split();

    }
  };
});
