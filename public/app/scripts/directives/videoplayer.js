'use strict';

angular.module('publicApp')
  .directive('videoPlayer', function ($sce) {
    return {
      template: '<section flex="{{flexSize()}}" class="relative"><div class="video-area"><video ng-src="{{trustSrc()}}" autoplay></video></div><div flex layout="row" class="name-area">{{name()}}</div></section>',
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@',
        vidLength: '@',
        vidIndex: '@',
        vidName: '@'
      },
      link: function (scope) {

        console.log('Initializing video-player');

        scope.name = function () {

          if (!scope.vidName) {
            return undefined;
          }
          
          return scope.vidName;
          
        };
        
        scope.trustSrc = function () {

          if (!scope.vidSrc) {
            return undefined;
          }
          return $sce.trustAsResourceUrl(scope.vidSrc);
        };

        scope.flexSize = function () {

          var index = Number(scope.vidIndex) + 1;

          console.log('vidLength : ' + scope.vidLength);
          console.log('vidIndex + 1 : ' + index);
          console.log('vidLength % 2 : ' + (scope.vidLength % 2));


          if (scope.vidLength == 2 ||
            (index == scope.vidLength) && ((scope.vidLength % 2) != 0)) {
            return "100";
          } else {
            return "50";
          }

        }

      }
    };
  });
