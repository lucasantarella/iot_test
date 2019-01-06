'use strict';
const autobahn = require('autobahn');
const prompt = require('prompt');

const ws_host = process.env.WS_HOST || 'localhost';
const ws_realm = process.env.WS_REALM || 'com.lucasantarella.iot';
const ws_port = process.env.WS_PORT || '8080';
const ws_wss = process.env.WS_WSS || 'ws';

let device_uuid = '';
prompt.start();
prompt.get(['uuid'], function (err, result) {
  device_uuid = result.uuid;
  loop(device_uuid);
});


function loop(device_uuid) {
  let connection = new autobahn.Connection({url: ws_wss + '://' + ws_host + ':' + ws_port + '/', realm: ws_realm});

  connection.onopen = function (session) {
    setInterval(function () {
      session.call('com.lucasantarella.iot.device.' + device_uuid + 'status').then(
        function (resp) {
          console.log('Device is currently: ' + resp);
        }
      );
      session.publish('com.lucasantarella.iot.device.' + device_uuid, ['1']);
    }, 2000)
  };

  connection.open();
}