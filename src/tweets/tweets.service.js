const createService = require('feathers-nedb');
const createModel = require('./tweets.model');
const hooks = require('./tweets.hooks');
const createTwitStream = require('./twit.stream');
const config = require('./twit.config');

module.exports = function (app) {
  const Model = createModel(app);
  const options = {
    Model,
    events: ['selected', 'next']
  };
  app.use('/tweets', createService(options));

  const tweetStream = createTwitStream(config);

  const service = app.service('tweets');

  tweetStream
    .subscribe(tweet => {
      service.create(tweet);
    });

  service.hooks(hooks);
};
