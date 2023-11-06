const TelegramBot = require('node-telegram-bot-api');
const Queue = require('bull');

const token = '6526118471:AAEMgLkPjOwGyGxeH8OKoDerstUX3wQhyV0';
const bot = new TelegramBot(token, { polling: true });

// Connect to the Redis server (You need to have Redis installed and running)
const queue = new Queue('messages');

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
    console.log(`Message received from ${messageContent.firstName}: ${messageContent.text}`);
});
