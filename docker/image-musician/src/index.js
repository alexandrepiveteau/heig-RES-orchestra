const dgram = require('dgram');
const server = dgram.createSocket('udp4');

if (process.argv.length != 3) {
  console.log('Please provide one argument');
  process.exit(1);
}

const type = process.argv[2];

function sendSound() {
  console.log("Sending my sound");
  const message = "salut";
  server.send(message, 0, message.length, 8080, '233.255.255.255');
}

setInterval(sendSound, 1000);
