/* global RTCIceCandidate, RTCSessionDescription, RTCPeerConnection, EventEmitter */
'use strict';

angular.module('publicApp')
  .factory('Room', function ($rootScope, $q, Io, config) {

    var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
        peerConnections = {},
        currentId, roomId, currentName,
        stream;

    function getPeerConnection(id, name) {

      if (peerConnections[id]) {
        return peerConnections[id];
      }

      var pc = new RTCPeerConnection(iceConfig);
      peerConnections[id] = pc;
      pc.addStream(stream);
      pc.onicecandidate = function (evnt) {
        socket.emit('msg', { by: currentId, byName: currentName, to: id, ice: evnt.candidate, type: 'ice' });
      };
      pc.onaddstream = function (evnt) {
        console.log('Received new stream');
        api.trigger('peer.stream', [{
          id: id,
          stream: evnt.stream,
          name: name
        }]);

        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }

      };
      return pc;
    }

    function makeOffer(id, name) {
      var pc = getPeerConnection(id, name);
      pc.createOffer(function (sdp) {
        pc.setLocalDescription(sdp);
        console.log('Creating an offer for', id);
        socket.emit('msg', { by: currentId, byName: currentName, to: id, sdp: sdp, type: 'sdp-offer' });
      }, function (e) {
        console.log(e);
      },
        {'offerToReceiveAudio':true,'offerToReceiveVideo':true}
      // { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true }}

      );
    }

    function handleMessage(data) {
      var pc = getPeerConnection(data.by, data.byName);
      switch (data.type) {
        case 'sdp-offer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log('Setting remote description by offer');
            pc.createAnswer(function (sdp) {
              pc.setLocalDescription(sdp);
              socket.emit('msg', { by: currentId, byName: currentName, to: data.by, sdp: sdp, type: 'sdp-answer' });
            }, function (e) {
              console.log(e);
            });
          }, function (e) {
            console.log(e);
          });
          break;
        case 'sdp-answer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log('Setting remote description by answer');
          }, function (e) {
            console.error(e);
          });
          break;
        case 'ice':
          if (data.ice) {
            console.log('Adding ice candidates');
            pc.addIceCandidate(new RTCIceCandidate(data.ice));
          }
          break;
      }
    }

    function handleBroadcast(data) {

      switch (data.type) {
        case 'text':
          api.trigger('peer.text', [data]);
           if (!$rootScope.$$digest) {
             $rootScope.$apply();
           }
          break;
      }

    }

    var socket = Io.connect(config.SIGNALIG_SERVER_URL),
        connected = false;

    function addHandlers(socket) {
      socket.on('peer.connected', function (params) {
        makeOffer(params.id, params.name);
      });
      socket.on('peer.disconnected', function (data) {
        api.trigger('peer.disconnected', [data]);

        api.trigger('peer.text', [{name : data.name , text : 'ルーム退室', system: true}]);

        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }
      });
      socket.on('msg', function (data) {
        handleMessage(data);
      });

      socket.on('broadcast', function (data) {
        handleBroadcast(data);
      });

    }

    var api = {
      textMessage: function (text, translateFrom, translateTo, system) {
        if (connected) {
          socket.emit('broadcast', { type: 'text', text: text, id : currentId , name : currentName, system: system, trans_from: translateFrom, trans_to: translateTo} );
        }
      },
      joinRoom: function (r) {
        if (!connected) {
          socket.emit('init', { room: r, name: currentName }, function (roomid, id) {
            currentId = id;
            roomId = roomid;
          });
          connected = true;
        }
      },
      createRoom: function () {
        var d = $q.defer();
        socket.emit('init', {name: currentName}, function (roomid, id) {
          d.resolve(roomid);
          roomId = roomid;
          currentId = id;
          connected = true;
        });
        return d.promise;
      },
      init: function (s, name) {
        stream = s;
        currentName = name;
      }
    };
    EventEmitter.call(api);
    Object.setPrototypeOf(api, EventEmitter.prototype);

    addHandlers(socket);
    return api;
  });
