const { bot } = require('../config');
const { msgHelper, store } = require('../util');

const CommandOff = '/stickers_off';
const CommandOn = '/stickers_on';

module.exports = async (command, msg) => {
    const chatId = msgHelper.getChatId(msg);
    let userId = msg.from.id;
    const isAdmin = await store.IsAdmin(userId);
    if(!isAdmin || (!command.startsWith(CommandOff) && !command.startsWith(CommandOn))) return;

    if(!msgHelper.isReplyMessage(msg))
    {
        bot.sendMessage(chatId, "Нужно зареплаить сообщение.", { reply_to_message_id: msg.message_id });
        return;
    }

    userId = msg.reply_to_message.from.id;
    if(command.startsWith(CommandOff))
    {
        if(!await store.FindUser(userId)) {
            await bot.sendMessage(chatId, "Этот человек не принадлежит к элитномым пациентам дурки!", { reply_to_message_id: msg.message_id });
            return;
        }

        await store.DeleteUser(userId);
        bot.sendMessage(chatId, "Петух исключен из наших рядов.", { reply_to_message_id: msg.message_id });
    }
    else if(command.startsWith(CommandOn))
    {
        if(await store.FindUser(userId)) {
            await bot.sendMessage(chatId, "Он уже в списке элиты.", { reply_to_message_id: msg.message_id });
            return;
        }

        await store.AddUser(userId);
        bot.sendMessage(chatId, "У нас новый шиз!", { reply_to_message_id: msg.message_id });
    }
};