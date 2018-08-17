module.exports = function (app) {
  const tweetsService = app.service('tweets');

  function getActiveTweets(max){
    return tweetsService
      .find({
        query: {
          $limit: max,
          $not: { blocked: true },
          $sort: {
            starred: -1,
            date: -1
          }
        }
      });
  }

  app.use('/control', {
    create(data, params) {
      return getActiveTweets(params.query.max)
        .then((tweets) => {
          let selectedIndex = tweets.findIndex(tweet => tweet.selected);
          const lastIndex =  tweets.length - 1;
          if(--selectedIndex >= 0){
            return tweets[selectedIndex];
          }else{
            return tweets[lastIndex];
          }
        });
    },
    remove(data, params) {
      return getActiveTweets(params.query.max)
        .then((tweets) => {
          let selectedIndex = tweets.findIndex(tweet => tweet.selected);
          const lastIndex =  tweets.length - 1;
          if(++selectedIndex <= lastIndex){
            return tweets[selectedIndex];
          }else{
            return tweets[0];
          }


        });
    }
  });
};
