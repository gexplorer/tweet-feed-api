module.exports = function (app) {
  const controlService = app.service('control');
  const tweetService = app.service('tweets');

  let timer = null;
  app.use('/status', {
    create(data, params) {
      let max = params.query.max;
      let delay = params.query.delay;

      if(!timer){
        timer = setInterval(() => {
          controlService.create({}, { query: { max: max }})
            .then(tweet => {
              tweetService
                .patch(tweet._id, {
                  selected: true
                });
            });
        }, delay);
      }

      return new Promise(resolve => resolve(true));
    },
    remove() {
      clearInterval(timer);
      timer = null;
      return new Promise(resolve => resolve(true));
    }
  });
};
