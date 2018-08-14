const Twit = require('twit');
const Rx = require('rxjs');
const { filter, map } = require('rxjs/operators');

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
  const stream = twitter.stream(streamEndpoint, params);

  return Rx.fromEvent(stream, 'tweet')
    .pipe(filter(status => !status.retweeted_status))
    .pipe(map(transformTweetData));
};

function transformTweetData(status) {
  let text = status.text;
  if (status.hasOwnProperty('extended_tweet')) {
    text = status.extended_tweet.full_text;
  }

  let photo = null;
  if (status.hasOwnProperty('extended_entities')) {
    let url = status.extended_entities.media
      .filter(media => media.type === 'photo')
      .map(media => media.media_url)[0];
    photo = url || null;
  }

  return {
    id: status.id,
    username: status.user.screen_name,
    avatar: status.user.profile_image_url,
    name: status.user.name,
    date: new Date(status.created_at),
    text: text,
    photo: photo,
  };
}
