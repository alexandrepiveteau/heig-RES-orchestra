const MULTICAST_ADDR="239.1.1.100"
const PORT=9009
const INTERVAL=1000

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
  console.log("Sending my sound as a " + type);
  server.send(sound, 0, sound.length, PORT, MULTICAST_ADDR);
}

server.on("error", (err) => {
    console.log("Got error: ${err.stack}");
});

server.on("message", (msg, info) => {
    console.log("Got msg: ${msg}");
});

server.on("listening", () => {
    setInterval(sendSound, INTERVAL); // When the socket is ready, send msg
});

server.bind(PORT);
