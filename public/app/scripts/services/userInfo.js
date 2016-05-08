'use strict';

angular.module('publicApp')
  .factory('UserInfo', function () {
    // var userInfo = {name:'test'};
    var userInfo = {};

    return {
      
      getName: function () {
        return userInfo.name;
      },

      set: function (data) {
        userInfo = data;
      }

    };
    
  });
