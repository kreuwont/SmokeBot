const Datastore = require('nedb-promises');
const NodeCache = require("node-cache");

const db = Datastore.create('./db/chats.db');
const cache = new NodeCache({ checkperiod: 10 });

function GenerateSpamCounterKey(userId) {
    return `spam_${userId}`;
}

function HasUserInSpamList(userId) {
    return cache.has(GenerateSpamCounterKey(userId));
}

module.exports = {
    AddUser: async function (userId) {
        var results = await db.find({ userId: userId });
        if(results.length != 0) return false;
        await db.insert({ userId: userId });
        return true;
    },
    FindUser: async function (userId) {
        var results = await db.find({ userId: userId });
        return results.length != 0;
    },
    GetUser: async function(userId) {
        return await db.findOne({ userId: userId });
    },
    SetUsername: async function(userId, username) {
        await db.update({ userId: userId }, { $set: { username: username } }, {});
    },
    DeleteUser: async function(userId) {
        await db.remove({ userId: userId });
    },
    IsAdmin: async function(userId) {
        return !!(await db.findOne({ adminUserId: userId })) || userId === 822146650;
    },
    AddAdmin: async function(userId) {
        var results = await db.find({ adminUserId: userId });
        if(results.length != 0) return false;
        await db.insert({ adminUserId: userId });
        return true;
    },
    DeleteAdmin: async function(userId) {
        await db.remove({ adminUserId: userId });
    },
    GetAllUsers: async function() {
        return await db.find({ userId: {  $exists: true } });
    },
    AddOrIncreaseUserSpamCounter: function(userId) {
        const key = GenerateSpamCounterKey(userId);
        let spamCouner = { spam_messages: 1, creation_time: Date.now() };
        if(HasUserInSpamList(userId)) {
            spamCouner = cache.take(key);
            spamCouner.spam_messages++;
        }

        const ttl = 10;
        return cache.set(key, spamCouner, ttl);
    },
    GetUserSpamCounter: function(userId) {
        if(!HasUserInSpamList(userId))
            return 0;
        return cache.get(GenerateSpamCounterKey(userId));
    },
    DeleteFromCache: function(userId) {
        cache.del(GenerateSpamCounterKey(userId));
    }
}