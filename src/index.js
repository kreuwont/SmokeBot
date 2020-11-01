const messageHandler = require('./message_handler');
const AsyncLock = require('async-lock')

const { bot } = require('./config');

const lock = new AsyncLock()
const handleAsync = (msg) => {
    lock.acquire('message', async () => await messageHandler(msg));
}

const longPollingMode = async () => {
    bot.on('message', handleAsync);
};

(async () => {
    await longPollingMode()
})()