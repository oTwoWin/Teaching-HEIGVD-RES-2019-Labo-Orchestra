
function treatMsg(msg) {
	var json = JSON.parse(msg.toString());
	if(!musicians.has(json.uuid)){
		var instru = instrument(json.music);
		var actualTime = Date.now();
		musicians.set(json.uuid, [instru,json.active,actualTime]);
	}
}

function instrument(music) {
	if(instrumentMap.has(music)){
		return instrumentMap.get(music);
	}
	return "undifined instrument";
}

function cleanMap() {
	for (var [key, value] of musicians.entries()) {
  		if(Date.now()-value[2] > 5) {
			musicians.delete(key);
		}
	}
}

var intervalId = setInterval(cleanMap,5000);

var instrumentMap = new Map();

instrumentMap.set("ti-ta-ti", "piano");
instrumentMap.set("pouet", "trumpet");
instrumentMap.set("trulu", "flute");
instrumentMap.set("gzi-gzi","violin");
instrumentMap.set("boum-boum", "drum");

var moment = require("moment");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var musicians = new Map();

server.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
  treatMsg(msg);
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(1234);

var net = require('net');

var stringTCP = "";

var server_tcp = net.createServer(function(socket) {
	console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);

	stringTCP = "[";
	musicians.forEach(tcpString);
	stringTCP = stringTCP.substring(0, stringTCP.length - 1 );
	stringTCP += "]";
	socket.write(stringTCP);
	socket.pipe(socket);
	socket.end();
});

function tcpString(value, key, map) {
	stringTCP += JSON.stringify({
		'uuid' : key,
		'instrument' : value[0],
		'activeSince' : moment(value[1]).format()
	});
	stringTCP += ","; 
}

server_tcp.listen(2205);
