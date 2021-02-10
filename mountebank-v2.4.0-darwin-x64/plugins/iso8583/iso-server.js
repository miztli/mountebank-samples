// require net to create socket server
const net = require('net');
const fetch = require("node-fetch");

if (process.argv.length !== 3) {
    console.error(`error Expected 1 argument, got ${process.argv.length - 2}: ${process.argv.slice(2).join(' ')}. Make sure to execute this as createCommand in a mountebank protocol.`);
    process.exit(1);
}

let config = JSON.parse(process.argv[2]);
config.callbackURL = config.callbackURLTemplate.replace(':port', config.port);

// message function
var sendMessage = socket => setInterval(() => { socket.write('Connected at: ' + new Date() + '\n') }, 3000);
var sendMountebankMessage = socket => {
    fetch(config.callbackURL, {
        method: 'post',
        body: JSON.stringify({request:{message:"hello"}}),
        headers: {'Content-Type': 'application/json'},
    })
        .then(res => res.json())
        .then(json => json.response)
        .then(response => socket.write(JSON.stringify(response)));
};

// create server
var server = net.createServer(sendMountebankMessage);
server.listen(config.port, '127.0.0.1');

// log sth in order to mountebank know you've finished starting server
console.log('Started ISO8583 server');
