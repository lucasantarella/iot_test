'use strict';
const autobahn = require('autobahn');
const uuidv4 = require('uuid/v4');
const gpio = require("gpio");
const gpio4 = gpio.export(4, {
  direction: gpio.DIRECTION.OUT,
  interval: 200,
  ready: function () {
    gpio4.reset();
    console.log("GPIO Instantiated")
  }
});

// Generate UUID
const device_uuid = process.env.BALENA_DEVICE_UUID || uuidv4();
console.log('Device UUID is: ' + device_uuid);

const ws_host = process.env.WS_HOST || '043f38db.ngrok.io';
const ws_realm = process.env.WS_REALM || 'com.lucasantarella.iot';
const ws_port = process.env.WS_PORT || '80';
const ws_wss = process.env.WS_WSS || 'ws';

var connection = new autobahn.Connection({url: ws_wss + '://' + ws_host + ':' + ws_port + '/', realm: ws_realm});

connection.onopen = function (session) {
  // 1) subscribe to a topic
  function onevent(args) {
    console.log("Event:", args[0]);
    gpio4.set(!(gpio4.value), function () {
      console.log("GPIO Set to " + gpio4.value)
    });
  }

  session.subscribe('com.lucasantarella.iot.device.' + device_uuid, onevent);

  session.register('com.lucasantarella.iot.device.' + device_uuid + 'status', function () {
    return gpio4.value;
  });
};

connection.open();