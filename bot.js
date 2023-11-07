const TelegramBot = require('node-telegram-bot-api');
const Queue = require('bull');
const sqlite3 = require('sqlite3').verbose();
const wsServer = require('./server');

const token = '6526118471:AAEMgLkPjOwGyGxeH8OKoDerstUX3wQhyV0';
const bot = new TelegramBot(token, { polling: true });

// Connect to the Redis server (You need to have Redis installed and running)
const queue = new Queue('messages');

const db = new sqlite3.Database('messages.db');

db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, firstName TEXT, text TEXT)');

bot.on('message', async function(msg) {
    console.log('Received a message');

    const messageContent = {
        firstName: msg.from.first_name,
        text: msg.text,
    };

    const res = `Hi ${msg.from.first_name}! I received your message: ${msg.text}`;
    bot.sendMessage(msg.chat.id, res);
    // Add message content to the queue
    await queue.add(messageContent);

    
});


// Process messages from the queue
queue.process(async (job) => {
    const messageContent = job.data;

    wsServer.clients.forEach(function (client) {
        client.send(JSON.stringify(messageContent));
    });
    const WebSocket = require('ws');

const serverAddress = "ws://127.0.0.1:5000";
const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla"
    }
});

ws.on('open', function() {
    ws.send("GetAllMessages"); // Send a request to get all messages
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

    const stmt = db.prepare('INSERT INTO messages (firstName, text) VALUES (?, ?)');
    stmt.run(messageContent.firstName, messageContent.text);
    stmt.finalize();

    // Broadcast content to active clients
    
});
