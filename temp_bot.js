const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');

const token = '6526118471:AAEMgLkPjOwGyGxeH8OKoDerstUX3wQhyV0';
const bot = new TelegramBot(token, { polling: true });

// const ws = new WebSocket('ws://localhost:5000');

const PORT = 5000;

const ws = new WebSocket.Server({
    port: PORT
});

bot.on('message', function(msg) {
    console.log('Received a message');

    const messageContent = {
        firstName: msg.from.first_name,
        text: msg.text,
    };

    const res = `Hi ${msg.from.first_name}! I received your message: ${msg.text}`;
    bot.sendMessage(msg.chat.id, res);

    // Send message to WebSocket server
    ws.send("Good");
});
