const { SimpleTweet } = require('./SimpleTweet');

/**
 * Transforms a tweet data into a SimpleTweet
 * @param {module:twit.Twit.Twitter.Status} status A Tweet status
 * @returns {SimpleTweet}
 */
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

    return new SimpleTweet(
        status.id,
        status.user.screen_name,
        status.user.profile_image_url,
        status.user.name,
        new Date(status.created_at),
        text,
        photo,
    );
}

const SELECT_TWEET = 'selectTweet';
const ADD_TWEET = 'addTweet';
const BLOCK_USER = 'blockUser';
const UNBLOCK_USER = 'unblockUser';
const UPDATE_BLACKLIST = 'updateBlacklist';

module.exports = {
    transformTweetData,
    SELECT_TWEET,
    ADD_TWEET,
    BLOCK_USER,
    UNBLOCK_USER,
    UPDATE_BLACKLIST,
};
