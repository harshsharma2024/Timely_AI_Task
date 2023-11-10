TELEGRAM BOT BROADCASTING

Installation Process:
npm install
node server.js   // For Server
node client.js   // For Clients (Can be multiple)


Functionality:
I have created 3 files 
1. bot.js
    It basically handles the Telegram bot (demoserverchat_bot) and It will export all the messages it receives from the Telegram groups to server.js

2. server.js
    It receives all the messages from bot.js and put them in a queue (redis), and the queue handles it in two ways:
     i. displays to all the active clients
     ii. Stores in the local database

    whenever a new clients join all the previous messages stored in the database are displayed.

3. client.js
    WebSocket is being implemented, and It reveives data from server.js to diplay


FUTURE SCOPES:

1. Deploying the server.js, bot.js on glitch.com
2. Deploying the datbase using psql on supabase and then getting request from server.js for data
3. developing a front-end for client.js

