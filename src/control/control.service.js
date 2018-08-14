module.exports = function (app) {
  const tweetsService = app.service('tweets');
  app.use('/control', {
    create(data, params) {
      return tweetsService
        .find({
          query: {
            $limit: params.query.max,
            $not: { blocked: true },
            $sort: { date: -1}
          }
        })
        .then((tweets) => {
          let selectedIndex = tweets.findIndex(tweet => tweet.selected);
          const lastIndex =  tweets.length - 1;
          if(++selectedIndex <= lastIndex){
            return tweets[selectedIndex];
          }else{
            return tweets[0];
          }
        });
    },
    remove(data, params) {
      return tweetsService
        .find({
          query: {
            $limit: params.query.max,
            $not: { blocked: true },
            $sort: { date: -1}
          }
        })
        .then((tweets) => {
          let selectedIndex = tweets.findIndex(tweet => tweet.selected);
          const lastIndex =  tweets.length - 1;
          if(--selectedIndex >= 0){
            return tweets[selectedIndex];
          }else{
            return tweets[lastIndex];
          }
        });
    }
  });
};
