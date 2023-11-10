const TelegramBot = require('node-telegram-bot-api');
const Queue = require('bull');

require('dotenv').config();

const token = process.env.API_KEY;

const bot = new TelegramBot(token, { polling: true });

const queue = new Queue('messages', {
    redis: { host: '127.0.0.1', port: 6379 }
});

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

module.exports = {
    queue
};
