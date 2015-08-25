'use strict';
app.controller('GPSMapController', function ($scope, Socket, $timeout, poollingFactory) {
  $scope.client = {};
  $scope.clients = [];
  $scope.elevationPath = [];
  $scope.execute = {distance: 0, state: 0};
  $scope.map = {
    options: {
      disableDoubleClickZoom: true,
      panControl: true,
      scrollWheel: true,
      draggable: true
    },
    draggable: true,
    center: {
      latitude: 45,
      longitude: -73
    },
    zoom: 8,
    markers: [],
    polylines: [],
    events: {
      dblclick: function (mapModel, eventName, originalEventArgs) {
        // 'this' is the directive's scope
        //$log.log("user defined event: " + eventName, mapModel, originalEventArgs);
        var e = originalEventArgs[0];
        var lat = e.latLng.lat(),
            lon = e.latLng.lng();
        $scope.map.clickedMarker = {
          id: 0,
          title: '',
          latitude: lat,
          longitude: lon
        };
        $scope.map.markers.push($scope.map.clickedMarker);
        //scope apply required because this event handler is outside of the angular domain
        $scope.$apply();
      }
    }
  };

  Socket.emit('gpsmap:clients:get');
  Socket.on('gpsmap:clients', function (data) {
    $scope.clients = data;
    $scope.clients.unshift({value: '', text: "All"});
  });

  var getRoute = function (from, to, callback) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(
        directionsRequest,
        function (response) {
          callback(response);
        }
    );
  };

  var getElevator = function (route, length, callback) {
    // Create an ElevationService.
    var elevator = new google.maps.ElevationService();
    elevator.getElevationAlongPath({
      'path': route,
      'samples': length
    }, function (results) {
      callback(results);
    });
  };

  $scope.$watch('map.markers', function () {
    if ($scope.map.markers.length > 1 && $scope.map.polylines.length === 0) {
      getRoute(new google.maps.LatLng($scope.map.markers[0].latitude, $scope.map.markers[0].longitude),
          new google.maps.LatLng($scope.map.markers[1].latitude, $scope.map.markers[1].longitude),
          function (response) {
            getElevator(response.routes[0].overview_path, response.routes[0].overview_path.length,
                function (results) {
                  $scope.elevationPath = results;
                  $scope.$apply();
                }
            );
            $scope.map.polylines.push(
                {
                  id: 1,
                  path: response.routes[0].overview_path,
                  stroke: {
                    color: '#6060FB',
                    weight: 3
                  },
                  editable: false,
                  draggable: false,
                  geodesic: true,
                  visible: true,
                  icons: [
                    {
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                      },
                      offset: '25px',
                      repeat: '100px'
                    }
                  ]
                }
            );
            $scope.$apply();
          }
      );
    } else if ($scope.map.markers.length > 1) {
      getRoute(new google.maps.LatLng($scope.map.markers[$scope.map.markers.length - 2].latitude, $scope.map.markers[$scope.map.markers.length - 2].longitude),
          new google.maps.LatLng($scope.map.markers[$scope.map.markers.length - 1].latitude, $scope.map.markers[$scope.map.markers.length - 1].longitude),
          function (response) {
            getElevator(response.routes[0].overview_path, response.routes[0].overview_path.length,
                function (results) {
                  for (var i = 0; i < results.length; i++) {
                    $scope.elevationPath.push(results[i]);
                  }
                  $scope.$apply();
                }
            );
            $scope.map.polylines.push(
                {
                  id: 2,
                  path: response.routes[0].overview_path,
                  stroke: {
                    color: '#6060FB',
                    weight: 3
                  },
                  editable: false,
                  draggable: false,
                  geodesic: true,
                  visible: true,
                  icons: [
                    {
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                      },
                      offset: '25px',
                      repeat: '100px'
                    }
                  ]
                }
            );
            $scope.$apply();
          }
      );

    }
  }, true);

  $scope.executePath = function () {
    $scope.startTime = new Date();
    for (var i = 0; i < $scope.elevationPath.length - 1; i++) {
      $scope.elevationPath[i].distance = google.maps.geometry.spherical.computeDistanceBetween(
          $scope.elevationPath[i].location,
          $scope.elevationPath[i + 1].location
      );
    }

    poollingFactory.callFnOnInterval(function () {
      $scope.execute.distance += 1;
      if ($scope.execute.distance + 1 >= $scope.elevationPath.length) {
        $scope.execute.distance = 0;
        $scope.execute.state = 0;
        poollingFactory.stop();
        return;
      }
      $scope.locationMarker.coords = {
        latitude: $scope.elevationPath[$scope.execute.distance].location.k,
        longitude: $scope.elevationPath[$scope.execute.distance].location.B
      };
      return Socket.emit('gpsmap:send', {
        client: $scope.client,
        latitude: $scope.elevationPath[$scope.execute.distance].location.k,
        longitude: $scope.elevationPath[$scope.execute.distance].location.B,
        altitude: $scope.elevationPath[$scope.execute.distance].elevation,
        bearing: getBearing($scope.elevationPath[$scope.execute.distance].location.k,
            $scope.elevationPath[$scope.execute.distance].location.B,
            $scope.elevationPath[$scope.execute.distance + 1].location.k,
            $scope.elevationPath[$scope.execute.distance + 1].location.B
        ),
        speed: $scope.speed
      });
    }, 500);

  };

  $scope.stopExecutePath = function () {
    poollingFactory.stop();
  };

  $scope.clearPath = function () {
    $scope.elevationPath = [];
    $scope.map.markers = [];
    $scope.map.polylines = [];
    $scope.locationMarker.coords = {};
    $scope.execute.distance = 0;
    $scope.execute.state = 0;
  };

  function radians(n) {
    return n * (Math.PI / 180);
  }

  function degrees(n) {
    return n * (180 / Math.PI);
  }

  var horseIcon = new google.maps.MarkerImage(
      "http://maps.google.com/mapfiles/kml/shapes/horsebackriding.png",
      null,
      null,
      null,
      new google.maps.Size(32, 32)
  );

  $scope.locationMarker = {
    id: 0,
    icon: horseIcon,
    coords: {},
    options: {draggable: false},
    events: {}
  };

  function getBearing(startLat, startLong, endLat, endLong) {
    startLat = radians(startLat);
    startLong = radians(startLong);
    endLat = radians(endLat);
    endLong = radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0) {
        dLong = -(2.0 * Math.PI - dLong);
      } else {
        dLong = (2.0 * Math.PI + dLong);
      }
    }

    return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }
});
