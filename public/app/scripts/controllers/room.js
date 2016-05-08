'use strict';

angular.module('publicApp')
  .controller('RoomCtrl', function ($sce, VideoStream, $location, $routeParams, $scope, Room, $mdDialog, UserInfo) {

    if (!UserInfo.getName()) {
      $location.path('/user/' + ($routeParams.roomId || 'newRoom'));
      return;
    }

    $scope.userName = UserInfo.getName();

    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      return;
    }

    var stream;

    VideoStream.get()
    .then(function (s) {
      stream = s;
      Room.init(stream, UserInfo.getName());
      stream = URL.createObjectURL(stream);
      // console.log('roomId eqauls:' + ($routeParams.roomId == 'newRoom'));
      if (!$routeParams.roomId || $routeParams.roomId == 'newRoom') {
        console.log('createRoom');
        Room.createRoom()
        .then(function (roomId) {
          // $location.path('/room/' + roomId + '/' + $routeParams.userName);
          $location.path('/room/' + roomId);
        });
      } else {
        Room.joinRoom($routeParams.roomId);
        Room.textMessage('ルーム入室', 'non','non', true);
      }
    }, function () {
      $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });

    $scope.peers = [];
    $scope.peerslength = 0;

    Room.on('peer.stream', function (peer) {

      console.log('Client connected, adding new stream');
      console.log('peerName : ' + peer.name);

      $scope.peers.push({
        id: peer.id,
        name: peer.name,
        stream: URL.createObjectURL(peer.stream)
      });

      $scope.peerslength = Object.keys($scope.peers).length;

    });

    Room.on('peer.disconnected', function (peer) {
      console.log('Client disconnected, removing stream');

      $scope.peers = $scope.peers.filter(function (p) {
        return p.id !== peer.id;
      });
    });

    Room.on('peer.text', function (data) {
      $scope.messages.push({"username" : data.name , "message" : data.text, 'timestamp' : new Date(), system: data.system});
    });


    $scope.getLocalVideo = function () {
      return $sce.trustAsResourceUrl(stream);
    };

    $scope.messages = [];
    $scope.handleKeydown = function(e) {
      if (e.which === 13) {
        
        console.log('translatefrom:' + translateFrom);
        console.log('translateto:' + translateTo);
        
        Room.textMessage($scope.newMessage, translateFrom, translateTo, false);
        $scope.newMessage = '';
      }
    };

    var typeCamera = {type: 'camera'};
    $scope.cameraSvgSrc = VideoStream.svgSrc(typeCamera);

    $scope.setCamera = function () {
      VideoStream.set(typeCamera);
      $scope.cameraSvgSrc = VideoStream.svgSrc(typeCamera);
    };

    var typeAudio = {type: 'audio'};
    $scope.audioSvgSrc = VideoStream.svgSrc(typeAudio);

    $scope.setAudio = function () {
      VideoStream.set(typeAudio);
      $scope.audioSvgSrc = VideoStream.svgSrc(typeAudio);
    };

    $scope.showAlert2 = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('あなたのルーム')
          .textContent('' + $location.absUrl())
          .ariaLabel('share url')
          .ok('close')
          .targetEvent(ev)
      );
    };

    $scope.showAlert = function(ev) {

      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        });

    };

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    var translateFrom = 'non';
    var translateTo = 'non';
    $scope.inputMessage = 'チャットメッセージ';
    $scope.translateSet = function(from, to) {
      translateFrom = from;
      translateTo = to;

      if (from != 'non') {
        $scope.inputMessage = 'チャットメッセージ (' + getLangDisp(from) + '→' + getLangDisp(to) + ')';
      } else {
        $scope.inputMessage = 'チャットメッセージ';
      }
      
    };
    

});

function getLangDisp(lang) {
  var ret;
  switch (lang) {
    case 'ja':
      ret = '日';
      break;
    case 'en':
      ret = '英';
      break;
    case 'zh-cn':
      ret = '中';
      break;
    case 'ko':
      ret = '韓';
      break;
  }

  return ret;
}

function DialogController($scope, $mdDialog, $location) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.mailto = function() {
    window.location.href = 'mailto:参加者アドレス@xxx.xxx.xxx?subject=【lets-meeting】招待URL&body=' + $scope.roomUrl;
  };

  $scope.roomUrl = $location.absUrl();
}
