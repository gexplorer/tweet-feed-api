const express = require('express');
const router = express.Router();

/**
 * Initializes index router
 * @param {Loki} db Database
 * @returns {Router}
 */
module.exports = (db) => {
    let tweetsDb = db.getCollection('tweets') || db.addCollection('tweets');
    let blacklistDb = db.getCollection('blacklist') || db.addCollection('blacklist');

    router.get('/', function(req, res) {
        res.render('index', {
            title: 'TweetFeedApi',
            tweets: tweetsDb.data.length,
            blacklist: blacklistDb.data.length
        });
    });
    return router;
};
