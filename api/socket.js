const {
    ADD_TWEET,
    SELECT_TWEET,
    BLOCK_USER,
    UNBLOCK_USER,
    UPDATE_BLACKLIST,
} = require('./utils');
const initializeTweetStream = require('./tweet-stream');
const path = require('path');

/**
 * Initializes the socket.
 *
 * @param {SocketIO.Server} io SocketIO
 * @param {Loki} db Database
 */
module.exports = (io, db) => {
    const tweetStream = initializeTweetStream(
        path.join(__dirname, 'config.json'),
        db,
    );
    const blacklistDb =
        db.getCollection('blacklist') || db.addCollection('blacklist');
    const blacklist = [];

    io.on('connection', socket => {
        console.debug(`[${socket.id}] Connection`);

        socket.emit(UPDATE_BLACKLIST, blacklist);

        tweetStream.subscribe(tweet => {
            socket.emit(ADD_TWEET, tweet);
        });

        socket.on(BLOCK_USER, username => {
            blacklistDb.insert({ username });
            const index = blacklist.indexOf(username);
            if (index < 0) {
                blacklist.push(username);
                io.emit(UPDATE_BLACKLIST, blacklist);
            }
        });

        socket.on(UNBLOCK_USER, username => {
            const index = blacklist.indexOf(username);
            if (index >= 0) {
                blacklist.splice(index, 1);
                io.emit(UPDATE_BLACKLIST, blacklist);
            }
        });

        socket.on(SELECT_TWEET, tweet => {
            io.emit(SELECT_TWEET, tweet);
        });
    });
};
