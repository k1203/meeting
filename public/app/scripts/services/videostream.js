'use strict';

angular.module('publicApp')
  .factory('VideoStream', function ($q) {
    var stream;
    return {
      get: function () {
        if (stream) {
          return $q.when(stream);
        } else {
          var d = $q.defer();

          // var constraints = {
          //   "audio": true,
          //   // "video": true
          //
          //   "video": {
          //     "mandatory": {
          //       // "minWidth": "600",
          //       // "minHeight": "600",
          //       // "maxWidth": "500",
          //       // "maxHeight": "600"
          //     },
          //     "optional": []
          //   }
          // };

          navigator.getUserMedia({
             video: true,
             audio: true
          }, function (s) {

           // navigator.getUserMedia(
           //   constraints
           //  , function (s) {
            stream = s;
            d.resolve(stream);
          }, function (e) {
            d.reject(e);
          });
          return d.promise;
        }
      },
      
      set: function (data) {
        
        switch (data.type) {
          case 'camera' :
            stream.getVideoTracks()[0].enabled = ! stream.getVideoTracks()[0].enabled;
            break;
          case 'audio' :
            stream.getAudioTracks()[0].enabled = ! stream.getAudioTracks()[0].enabled;
            break;
        }
        
      },
      
      svgSrc: function (data) {
        
        var svgSrc = '';
        
        switch (data.type) {
          case 'camera' :
            svgSrc = !stream || stream.getVideoTracks()[0].enabled ? 'images/videocam_off.svg' : 'images/videocam.svg';
            break;
          case 'audio' :
            svgSrc = !stream || stream.getAudioTracks()[0].enabled ? 'images/audio_off.svg' : 'images/audio.svg';
            // svgSrc = 'images/audio_off.svg';
            break;
        }
        
        return svgSrc;
        
      }
      
    };
  });
