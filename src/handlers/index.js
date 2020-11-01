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

        let userName = msg.from.username;
        if(!userName) 
        {
            userName = msg.from.first_name;
            if(!userName) return;
        }

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
            return;
        }

        for (let handler of Object.values(handlers)) {
            await handler(command, msg);
        }
    } catch (err) {
        log.error(err);
    }
};