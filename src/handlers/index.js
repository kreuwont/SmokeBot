const { bot } = require('../config');
const { msgHelper, store } = require('../util');

const handlers = require('require-all')({
    dirname: __dirname,
    filter: /(.+handler)\.js$/,
    recursive: true
});

async function saveUsername(msg, userId) {
    if(await store.FindUser(userId))
    {
        let userInfo = await store.GetUser(userId);
        if(userInfo && userInfo.username) return;

        let userName = msgHelper.getUsername(msg);
        await store.SetUsername(userId, userName);
    }
}

module.exports = async (command, msg) => {
    
    try {
        const chatId = msgHelper.getChatId(msg);
        const userId = msg.from.id;
        const allowStickers = !await store.FindUser(userId);
        
        await saveUsername(msg, userId);
            
        if(allowStickers && (msg.animation || msg.sticker)) {
            bot.deleteMessage(chatId, msg.message_id);
            store.AddOrIncreaseUserSpamCounter(userId);
            const spamCounter = store.GetUserSpamCounter(userId);

            const diffSeconds = new Date(Date.now() - spamCounter.creation_time).getSeconds();
            if(spamCounter && diffSeconds <= 10) {
                if(spamCounter.spam_messages > 8)
                {
                    const userName = msgHelper.getUsername(msg);
                    bot.restrictChatMember(chatId, userId, { can_send_messages: true });
                    const answer = await bot.sendMessage(chatId, `@${userName} минус стики и гифки.`);
                    setTimeout(() => {
                        bot.deleteMessage(chatId, answer.message_id);
                    }, 5000);
                    store.DeleteFromCache(userId);
                }
                else if(spamCounter.spam_messages === 3)
                {
                    const userName = msgHelper.getUsername(msg);
                    const answer = await bot.sendMessage(chatId, `@${userName} заебал уже спамить, мудак! Отберу медиа, если будешь продолжать.`);
                    setTimeout(() => {
                        bot.deleteMessage(chatId, answer.message_id);
                    }, 5000);
                }
            }    
            return;
        }

        for (let handler of Object.values(handlers)) {
            await handler(command, msg);
        }
    } catch (err) {
        log.error(err);
    }
};