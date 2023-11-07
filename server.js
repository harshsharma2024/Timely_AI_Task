const WebSocket = require('ws');
const { queue } = require('./bot.js');
// Configure a DataBase


const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

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

    socket.on('close', function () {
        console.log('Client disconnected');
    })
});

// Process messages from the queue
queue.process(async (job) => {
    try {
        const messageContent = job.data;
        console.log(`Message received from ${messageContent.firstName}: ${messageContent.text}`);

        // Send the message to all connected clients
        wsServer.clients.forEach(function (client) {
            client.send(`${messageContent.firstName} says: ${messageContent.text}`);
        });
    } catch (error) {
        console.error('Error processing job:', error);
    }
});

console.log( (new Date()) + " Server is listening on port " + PORT);
