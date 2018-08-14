module.exports = {
  before: {
    patch: [
      async (context) => {
        let tweet = await context.service.get(context.id);
        if(context.data.selected && tweet.blocked){
          throw new Error('Unable to select a blocked tweet');
        }
        if(context.data.blocked && tweet.selected){
          throw new Error('Unable to block a selected tweet');
        }
      }],
  },
  after: {
    patch: [
      async (context) => {
        if(context.data.selected){
          let tweet = await context.service.get(context.id);
          context.service.emit('selected', tweet);
          const query = {
            query: {
              selected: true,
              $not:{ _id: context.id }
            }
          };
          context.service
            .find(query)
            .then(tweets => {
              tweets.forEach(tweet => {
                context.service.patch(tweet._id, { selected: false });
              });
            });
        }
      }
    ],
  },
};
