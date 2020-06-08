const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.setBroadcast(true);

function sendSound() {
  console.log("Sending my sound");
  server.send("salut", port=123, address='255.255.255.255');
}

setInterval(sendSound, 5 * 1000);
