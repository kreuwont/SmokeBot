const log = require('./util/logger');
const handler = require('./handlers');

module.exports = async (msg) => {
    try {
        if(msg.chat.id != -1001121056081) return;

        const command = msg.text ? msg.text.trim() : '';
        await handler(command, msg);

    } catch (err) {
        log.error(err);
    }
};