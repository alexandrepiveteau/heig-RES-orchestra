const MULTICAST_ADDR="239.1.1.100"
const UDP_PORT=9009
const TCP_PORT=2205
const ACTIVE_TIME=5 // in seconds

var ip = require("ip");
const dgram = require('dgram');
const net = require('net');
const moment = require('moment');

const orchestra = new Map();

const udpSocket = dgram.createSocket('udp4');
const tcp = net.createServer((socket) => {
    var json = [];
    orchestra.forEach((value, key) => {
        var delta = moment().subtract(ACTIVE_TIME, 's').diff(value.lastSound);
        console.log("Time diff for uuid " + key + ": " + delta);
        if (delta <= 0) {
            json.push({
                "uuid" : key,
                "instrument" : value.instrument,
                "activeSince": value.activeSince
            });
        }
    });
    socket.write(JSON.stringify(json, null, 2));
    socket.end();
});


udpSocket.on("message", (msg, info) => {
    var musician = JSON.parse(msg);

    if (orchestra.has(musician.uuid)) {
        orchestra.get(musician.uuid).lastSound = moment().format();
    } else {
        orchestra.set(musician.uuid, {
            "uuid" : musician.uuid,
            "instrument" : musician.instrument,
            "lastSound" : moment().format(),
            "activeSince" : moment().format()
        });
    }

    console.log("Updated " + musician.uuid + "'s information");
});

udpSocket.on("listening", () => {
    udpSocket.addMembership(MULTICAST_ADDR);
    const address = udpSocket.address();
    console.log("Listening on " + address.address);
});

udpSocket.bind(UDP_PORT);
tcp.listen(TCP_PORT, ip.address());
