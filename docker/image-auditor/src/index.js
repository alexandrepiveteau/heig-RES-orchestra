const MULTICAST_ADDR="239.1.1.100"
const PORT=9009

const dgram = require('dgram');
const udpSocket = dgram.createSocket('udp4');

udpSocket.on("error", (err) => {
    console.log("Got error: ${err.stack}");
});

udpSocket.on("message", (msg, info) => {
    console.log("Got msg: " + msg);
});

udpSocket.on("listening", () => {
    udpSocket.addMembership(MULTICAST_ADDR);
    const address = udpSocket.address();
    console.log("Listening on " + address.address);
});

udpSocket.bind(PORT);
