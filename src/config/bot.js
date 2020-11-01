const log = require('../util/logger');
const TelegramBot = require('node-telegram-bot-api');

const requestOptions = {};

module.exports = (() => {
    try {
        const bot = new TelegramBot(process.env.BOT_TOKEN, {
            polling: true,
            requestOptions: requestOptions
        });
        return bot;
    }
    catch (err) {
        log.error(err);
        process.exit();
    }
})()