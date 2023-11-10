
const WebSocket = require('ws');

const serverAddress = "ws://127.0.0.1:5000";
// const serverAddress = 'wss://kindly-rain-circle.glitch.me/';

const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla"
    }
});

ws.on('open', function() {
    ws.send("WELCOME TO THE SERVER");
});

ws.on('message', function(msg) {
    console.log("Received msg from the server: " + msg);
});