const dgram = require('dgram');
const server = dgram.createSocket('udp4');

function sendSound() {
  console.log("Sending my sound");
  server.send("salut", port=123, address='255.255.255.255');
}

setInterval(sendSound, 1000);
server.bind(1234, undefined, function() {
  //  server.setBroadcast(true);
});
