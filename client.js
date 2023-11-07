const WebSocket = require('ws');

const serverAddress = "ws://127.0.0.1:5000";
const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla"
    }
});

ws.on('open', function() {
    console.log("Connected to server");
});

ws.on('message', function(msg) {
    const message = JSON.parse(msg);

    if (message.type === 'allMessages') {
        const messages = message.messages;

        messages.forEach((msg) => {
            const firstName = msg.firstName;
            const text = msg.text;

            console.log(`Received message from ${firstName}: ${text}`);
        });
    }
});
