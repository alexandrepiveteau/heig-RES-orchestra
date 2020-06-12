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
const tcp = net.createServer();

// 1. UDP
// When the socket "goes up", we want to listen to multicast
udpSocket.on("listening", () => {
    udpSocket.addMembership(MULTICAST_ADDR);
    const address = udpSocket.address();
    console.log("Listening on " + address.address);
});

// When receiving a messgage on udp socket, add it to the orchestra
udpSocket.on("message", (msg, info) => {
    var musician = JSON.parse(msg);

    if (orchestra.has(musician.uuid)) {
        orchestra.get(musician.uuid).lastSound = moment().format();
        console.log("Updated " + musician.uuid + "'s information");
    } else {
        orchestra.set(musician.uuid, {
            "uuid" : musician.uuid,
            "instrument" : musician.instrument,
            "lastSound" : moment().format(),
            "activeSince" : moment().format()
        });
        console.log("Added " + musician.uuid + "'s information in orchestra");
    }
});

// 2. TCP server
tcp.on("connection", (socket) => {
    var json = [];

    orchestra.forEach((value, key) => {
        var delta = moment().subtract(ACTIVE_TIME, 's').diff(value.lastSound);

        if (delta <= 0) { // add to send value
            json.push({
                "uuid" : key,
                "instrument" : value.instrument,
                "activeSince": value.activeSince
            });
        } else { // clean orchestra
            console.log("Musician " + key + " is inactive.");
            orchestra.delete(key);
        }
    });

    socket.write(JSON.stringify(json, null, 2));
    socket.write("\n");
    socket.end();
});

// Launch
udpSocket.bind(UDP_PORT);
tcp.listen(TCP_PORT, ip.address());
