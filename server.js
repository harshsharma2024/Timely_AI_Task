const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

const PORT = 5000;
const wsServer = new WebSocket.Server({ port: PORT });

const db = new sqlite3.Database('messages.db');
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, firstName TEXT, text TEXT)');

wsServer.on('connection', function (socket) {
    console.log("A client just connected");

    // Retrieve all messages from the database and send them to the client
    db.all('SELECT * FROM messages', [], (err, rows) => {
        if (err) {
            throw err;
        }

        const messages = rows.map(row => ({
            firstName: row.firstName,
            text: row.text
        }));

        const response = {
            type: 'allMessages',
            messages: messages
        };

        socket.send(JSON.stringify(response));
    });

    socket.on('message', function (msg) {
        console.log("Received message from client: " + msg);
    });

    socket.on('close', function () {
        console.log('Client disconnected');
    });
});

module.exports = { wsServer, db };
