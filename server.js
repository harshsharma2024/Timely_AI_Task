const WebSocket = require('ws');
const { queue } = require('./bot.js');
const Database = require('better-sqlite3');

const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

const db = new Database('messages.db');

wsServer.on('connection', function (socket) {
    console.log("A client just connected");

    const stmt = db.prepare("SELECT * FROM messages");
    const rows = stmt.all();

    rows.forEach(row => {
        socket.send(row.text);
    });

    socket.on('close', function () {
        console.log('Client disconnected');
    });
});

queue.process(async (job) => {
    try {
        const messageContent = job.data;
        console.log(`Message received from ${messageContent.firstName}: ${messageContent.text}`);

        db.prepare("INSERT INTO messages (firstName, text) VALUES (?, ?)")
            .run(messageContent.firstName, messageContent.text);

        wsServer.clients.forEach(function (client) {
            client.send(`${messageContent.firstName} says: ${messageContent.text}`);
        });
    } catch (error) {
        console.error('Error processing job:', error);
    }
});

console.log( (new Date()) + " Server is listening on port " + PORT);
