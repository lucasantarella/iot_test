'use strict';
const autobahn = require('autobahn');
const prompt = require('prompt');

const ws_host = process.env.WS_HOST || 'iot.lucasantarella.com';
const ws_realm = process.env.WS_REALM || 'com.lucasantarella.iot';
const ws_port = process.env.WS_PORT || '9443';
const ws_wss = process.env.WS_WSS || 'wss';

let device_uuid = '';
prompt.start();
prompt.get(['uuid'], function (err, result) {
  device_uuid = result.uuid;
  loop(device_uuid);
});


function loop(device_uuid) {
  let connection = new autobahn.Connection({
    url: ws_wss + '://' + ws_host + ':' + ws_port + '/',
    realm: ws_realm,
    tlsConfiguration: {}
  });

  connection.onopen = function (session) {
    setInterval(function () {
      session.call('com.lucasantarella.iot.devices.' + device_uuid + '.status').then(
        function (resp) {
          console.log('Device is currently: ' + resp);
        }
      );
      session.publish('com.lucasantarella.iot.devices.' + device_uuid, ['1']);
    }, 2000)
  };

  connection.open();
}