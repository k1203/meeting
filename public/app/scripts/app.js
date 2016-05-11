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
  .config(function ($routeProvider, $mdIconProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
       .primaryPalette('blue', {'default': '700'})
       .accentPalette('red');

    $mdIconProvider
       .defaultFontSet( 'fa' ) 
       .icon('menu', 'images/menu.svg')
       .icon('chat', 'images/chat.svg');

    $routeProvider
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl as rc',
      })
      .when('/room/:roomId', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl as rc'
      })
      .when('/user/:roomId', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl as uc'
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
