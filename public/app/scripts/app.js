'use strict';


angular
  .module('publicApp', [
    'ngRoute', 
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'angularMoment',
    'angular-clipboard',
    'luegg.directives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .when('/room/:roomId', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .when('/user/:roomId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/user/newRoom'
      });
  });

angular.module('publicApp')
  .constant('config', {
      SIGNALIG_SERVER_URL: undefined
  });

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj; 
};
