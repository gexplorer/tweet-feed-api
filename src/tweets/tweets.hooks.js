function createMockTweet (context) {
  if(!context.data.hasOwnProperty('id')) {
    let id = Math.round(Math.random() * 1000);
    context.data.id = id;
    context.data.avatar = 'https://pbs.twimg.com/profile_images/448763140730142720/ZwFeJ-S2_normal.jpeg';
    context.data.name = 'Trikimailu Konpartsa';
    context.data.username = 'trikimailuK';
    context.data.starred = true;
    context.data.date = new Date();
  }
}

function filterBlockedUsers (context) {
  return context.service
    .find({
      query: {
        blocked: true,
        username: context.data.username
      },
    })
    .then((blockedTweets) => {
      if (blockedTweets.length > 0) {
        throw new Error(`User ${context.data.username} is blocked`);
      }
    });
}

async function preventSelectedAndBlocked (context) {
  let tweet = await context.service.get(context.id);
  if(context.data.selected && tweet.blocked){
    throw new Error('Unable to select a blocked tweet');
  }
  if(context.data.blocked && tweet.selected){
    throw new Error('Unable to block a selected tweet');
  }
}

async function unselectOthersOnSelection (context) {
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

module.exports = {
  before: {
    create: [
      createMockTweet,
      filterBlockedUsers
    ],
    patch: [
      preventSelectedAndBlocked
    ],
  },
  after: {
    patch: [
      unselectOthersOnSelection
    ],
  },
};
