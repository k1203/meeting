'use strict';

var http = require('http');
var https = require('https');
var qs = require('querystring');


exports.getAccessToken = function(callback) {
    
    var body = '';
    var req = https.request({
        host: 'datamarket.accesscontrol.windows.net',
        path: '/v2/OAuth2-13',
        method: 'POST'
    }, function (res) {
        
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            var resData = JSON.parse(body);
            callback(resData.access_token);
        });
    }).on('error', function (err) {
        console.log(err);
    });
    var data = {
        'client_id': 'K1203',
        'client_secret': 'uBq3Lla4XFiA86s0DDyVBfANQwzjPOPztnFh3CHopa4=',
    'scope': 'http://api.microsofttranslator.com',
        'grant_type': 'client_credentials'
    };

    req.write(qs.stringify(data));
    req.end();
}

exports.translate= function(token,text ,from, to, callback) {
    var options = 'to=' + to + '&from=' + from + '&text=' + qs.escape(text) +
        '&oncomplete=translated';
    var body = '';
    var req = http.request({
        host: 'api.microsofttranslator.com',
        path: '/V2/Ajax.svc/Translate?' + options,
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + token
        }
    }, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            eval(body);
        });
    }).on('error', function (err) {
        console.log(err);
    });

    req.end();

    function translated(text) {
        callback(text);
    }
}
