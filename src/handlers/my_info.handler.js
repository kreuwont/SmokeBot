const { bot } = require('../config');
const { msgHelper, store } = require('../util');

const Command = '/info';

module.exports = async (command, msg) => {
    if(!command.startsWith(Command)) return;

    const chatId = msgHelper.getChatId(msg);
    let userId = msg.from.id;

    let preffics = "Вам ";
    if(msgHelper.isReplyMessage(msg))
    {
        userId = msg.reply_to_message.from.id;
        preffics = "Ему ";
    }

    const inAllowedList = await store.FindUser(userId);
    const message = inAllowedList ? preffics + "разрешено использовать стикеры и гифки" : preffics + "нельзя использовать стикеры и гифки";
    const answer = await bot.sendMessage(chatId, message, { reply_to_message_id: msg.message_id });
    setTimeout(() => {
        bot.deleteMessage(chatId, answer.message_id);
        bot.deleteMessage(chatId, msg.message_id);
    }, 4000);
}