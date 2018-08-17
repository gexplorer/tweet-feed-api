const createService = require('feathers-nedb');
const createModel = require('./tweets.model');
const hooks = require('./tweets.hooks');
const config = require('./twit.config');
const createTwitStream = require('./twit.stream');

module.exports = function (app) {
  const Model = createModel(app);
  const options = {
    Model,
    events: ['selected', 'next']
  };
  app.use('/tweets', createService(options));

  const service = app.service('tweets');

  createTwitStream(config)
    .subscribe(tweet => {
      service
        .find({ query: { id: tweet.id } })
        .then((tweets) => {
          if (tweets.length === 0){
            service.create(tweet);
          }
        });
    });

  service.hooks(hooks);
};
