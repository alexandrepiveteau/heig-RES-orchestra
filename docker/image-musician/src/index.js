const dgram = require('dgram');
const server = dgram.createSocket('udp4');

if (process.argv.length != 3) {
  console.log('Please provide one argument');
  process.exit(1);
}

const type = process.argv[2];

const map = new Map();
map.set("piano", "ti-ta-ti");
map.set("trumpet", "pouet");
map.set("flute", "trulu");
map.set("violin", "gzi-gzi");
map.set("drum", "boum-boum");

const sound = map.get(type);

function sendSound() {
  console.log("Sending my sound");
  server.send(sound, 0, sound.length, 8080, '233.255.255.255');
}

setInterval(sendSound, 1000);
