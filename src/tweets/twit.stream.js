const Twit = require('twit');
const Rx = require('rxjs');
const { filter, map } = require('rxjs/operators');
const transformTweetData = require('./twit.utils');

module.exports = function(config) {
  const configKeys = {
    consumer_key: config['TWITTER_CONSUMER_KEY'],
    consumer_secret: config['TWITTER_CONSUMER_SECRET'],
    access_token: config['TWITTER_ACCESS_TOKEN'],
    access_token_secret: config['TWITTER_ACCESS_TOKEN_SECRET'],
  };
  const streamEndpoint = config['TWITTER_STREAM_ENDPOINT'];
  const params = config['TWITTER_PARAMS'];
  const twitter = new Twit(configKeys);
  const history = twitter.get('search/tweets', {q: '#trikileaks'});
  const stream = twitter.stream(streamEndpoint, params);

  return Rx.Observable
    .create((observer) => {
      history.then((response) => {
        response.data.statuses
          .forEach((status) => observer.next(status));
      });

      stream.on('tweet', (status) => observer.next(status));
    })
    .pipe(filter(status => !status.retweeted_status))
    .pipe(map(transformTweetData));
};
