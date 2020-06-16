const MULTICAST_ADDR="239.1.1.100"
const PORT=9009
const INTERVAL=1000

const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const map = new Map();
map.set("piano", "ti-ta-ti");
map.set("trumpet", "pouet");
map.set("flute", "trulu");
map.set("violin", "gzi-gzi");
map.set("drum", "boum-boum");

// When socket is ready, send sound
server.on("listening", () => {
    setInterval(sendSound, INTERVAL);
});

function sendSound() {
    console.log("Sending my sound as a " + type + " with uuid " + uuid);
    const msg = JSON.stringify({
        "instrument" : type,
        "sound"      : sound,
        "uuid"       : uuid
    })
    server.send(msg, 0, msg.length, PORT, MULTICAST_ADDR);
}

// Start processing
if (process.argv.length != 3) {
    console.log('Please provide one argument');
    process.exit(1);
}

const type = process.argv[2];

if (! map.has(type)) {
    console.log('The given instrument is unknown.');
    process.exit(1);
}

const sound = map.get(type);

server.bind(PORT);
