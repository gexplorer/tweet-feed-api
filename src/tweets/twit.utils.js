module.exports = function (status) {
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
    starred: false
  };
};
