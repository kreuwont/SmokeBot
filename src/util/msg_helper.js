const store = require('./store');
const { bot } = require('../config');

const getChatId = (msg) => {
    let chatId = 0;
    if (msg.chat) chatId = msg.chat.id;
    else if (msg.from) chatId = msg.from.id;

    return chatId;
}

const sendAll = async (text) => {
    const chats = await store.ChatIdList();
    chats.map((chatId) => {
        bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    });
};

const isReplyMessage = async(msg) => {
    return msg.reply_to_message && msg.reply_to_message.from;
};

module.exports = {
    getChatId: getChatId,
    sendAll: sendAll,
    isReplyMessage: isReplyMessage
};