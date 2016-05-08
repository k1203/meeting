'use strict';

angular.module('publicApp')
  .controller('UserCtrl', function ($sce, $routeParams, $scope, $location, UserInfo) {
    
    if ($routeParams.roomId === 'newRoom') {
      $scope.message = '新規ルームを作成し入室します';
    } else {
      $scope.message = 'ルーム「' + $routeParams.roomId.split('/').reverse()[0] + '」へ入室します';
    }

    $scope.handleKeydown = function(e) {
      if (e.which === 13) {
        $scope.roomIn();
      }
    };
    
    $scope.roomIn = function () {
      
      console.log($scope.userName);

      UserInfo.set({name : $scope.userName});
      
      $location.path('/room/' + $routeParams.roomId);
    };
    
  });



