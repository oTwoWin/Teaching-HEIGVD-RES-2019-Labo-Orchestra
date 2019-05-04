'use strict';

const uuidv1 = require('uuid/v1');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var instrumentMap = new Map();

instrumentMap.set("piano","ti-ta-ti");
instrumentMap.set("trumpet","pouet");
instrumentMap.set("flute","trulu");
instrumentMap.set("violin","gzi-gzi");
instrumentMap.set("drum","boum-boum");

var instrument = process.argv[2];
var uuid = uuidv1();

var payload = JSON.stringify({
	'uuid': uuid,
	'music': instrumentMap.get(instrument), 
	'active' : Date.now()
});

const message = Buffer.from(payload);
client.on('listening', function(){
    client.setBroadcast(true);
    var intervalId = setInterval(function(){
	client.setBroadcast(true);
        client.send(message,0,message.length, 1234, "172.17.255.255");
        console.log(message.toString());
    },1000);

});

client.bind(2205);
