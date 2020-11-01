const { bot } = require('../config');
const { msgHelper, store } = require('../util');
const OS = require('os');

const Command = '/whitelist';

module.exports = async (command, msg) => {
    if(!command.startsWith(Command)) return;

    const chatId = msgHelper.getChatId(msg);
    const userId = msg.from.id;
    if(!await store.IsAdmin(userId)) return;

    const users = await store.GetAllUsers();
    if(users.length == 0)
    {
        bot.sendMessage(chatId, "Список пользователей пуст.", { reply_to_message_id: msg.message_id });
        return;
    }

    const text = users.filter(user => user.username).map(user => {
        return user.username; 
    });
    bot.sendMessage(chatId, `Пользователи с правами на медиа-контент:${OS.EOL}<code>${text.join(OS.EOL)}</code>` , { reply_to_message_id: msg.message_id, parse_mode: 'HTML' });
}