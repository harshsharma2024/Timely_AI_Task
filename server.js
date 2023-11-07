const WebSocket = require('ws');
const { queue } = require('./bot.js');
// Configure a DataBase
const sqlite3 = require('sqlite3').verbose();



const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

const db = new sqlite3.Database('messages.db');


wsServer.on('connection', function (socket) {
    console.log("A client just connected");


    // Commented as Clint never Speaks
    // socket.on('message', async function (msg) {
    //     console.log("Received message from client: "  + msg);

    //     // Broadcast that message to all connected clients
    //     wsServer.clients.forEach(function (client) {
    //         client.send("Someone said: " + msg);
    //     });

    //     // Add the message to the queue
    //     await queue.add({ firstName: 'Server', text: msg });
    // });

    //  Getting messages from Database
    db.all("SELECT * FROM messages", (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        rows.forEach(row => {
            socket.send(row.text);
        });
    });

    socket.on('close', function () {
        console.log('Client disconnected');
    })
});

// Process messages from the queue
queue.process(async (job) => {
    try {
        const messageContent = job.data;
        console.log(`Message received from ${messageContent.firstName}: ${messageContent.text}`);

        // Store the message in the SQLite database
        db.run("INSERT INTO messages (firstName, text) VALUES (?, ?)", [messageContent.firstName, messageContent.text], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        // Send the message to all connected clients
        wsServer.clients.forEach(function (client) {
            client.send(`${messageContent.firstName} says: ${messageContent.text}`);
        });
    } catch (error) {
        console.error('Error processing job:', error);
    }
});

console.log( (new Date()) + " Server is listening on port " + PORT);
