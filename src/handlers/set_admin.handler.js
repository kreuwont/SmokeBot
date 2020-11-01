const { bot } = require('../config');
const { msgHelper, store } = require('../util');

const AddAdminCommand = '/add_admin';
const RemoveAdminCommand = '/remove_admin';

module.exports = async (command, msg) => {
    if(!command.startsWith(AddAdminCommand) && !command.startsWith(!command.startsWith(AddAdminCommand))) return;

    const chatId = msgHelper.getChatId(msg);
    let userId = msg.from.id;

    if(userId !== 822146650) return;
    if(!msgHelper.isReplyMessage(msg))
    {
        bot.sendMessage(chatId, "Нужно зареплаить сообщение.", { reply_to_message_id: msg.message_id });
        return;
    }

    userId = msg.reply_to_message.from.id;
    if(command.startsWith(AddAdminCommand))
    {
        if(await store.IsAdmin(userId))
        {
            bot.sendMessage(chatId, "Пользователь уже является администратором.", { reply_to_message_id: msg.message_id });
            return;
        }

        await store.AddAdmin(userId);
        bot.sendMessage(chatId, "Новый администратор добавлен.", { reply_to_message_id: msg.message_id });
    }
    else if (command.startsWith(RemoveAdminCommand))
    {
        if(!await store.IsAdmin(userId))
        {
            bot.sendMessage(chatId, "Пользователь не является администратором.", { reply_to_message_id: msg.message_id });
            return;
        }

        await store.DeleteAdmin(userId);
        bot.sendMessage(chatId, "Администратор удален.", { reply_to_message_id: msg.message_id });
    }
}