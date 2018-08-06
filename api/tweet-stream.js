const config = require('nconf');
const Twit = require('twit');

const Rx = require('rxjs');
const { filter, map } = require('rxjs/operators');
const { transformTweetData } = require('./utils');

/**
 * Creates a Twit.Stream
 * @param {string} configFile Configuration file
 * @param {Loki} db Database
 * @returns {ReplaySubject<module:twit.Twit.Twitter.Status>} Status
 */
module.exports = (configFile, db) => {
    config.file({ file: configFile }).env();
    const configKeys = {
        consumer_key: config.get('TWITTER_CONSUMER_KEY'),
        consumer_secret: config.get('TWITTER_CONSUMER_SECRET'),
        access_token: config.get('TWITTER_ACCESS_TOKEN'),
        access_token_secret: config.get('TWITTER_ACCESS_TOKEN_SECRET'),
    };
    const streamEndpoint = config.get('TWITTER_STREAM_ENDPOINT');
    const params = config.get('TWITTER_PARAMS');
    const twitter = new Twit(configKeys);
    const stream = twitter.stream(streamEndpoint, params);
    const source = new Rx.ReplaySubject(10);

    /** @type {Collection<SimpleTweet>} */
    const tweetCollection =
        db.getCollection('tweets') || db.addCollection('tweets');

    tweetCollection.find().forEach(tweet => source.next(tweet));

    Rx.fromEvent(stream, 'tweet')
        .pipe(filter(status => !status.retweeted_status))
        .pipe(map(transformTweetData))
        .subscribe(tweet => {
            tweetCollection.insert(tweet);
            source.next(tweet);
        });
    return source;
};
