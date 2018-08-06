/**
 * Simple tweet
 * @type {SimpleTweet}
 */
class SimpleTweet {
    /**
     * SimpleTweet constructor
     * @constructor
     * @param {number} id
     * @param {string} username
     * @param {string} avatar
     * @param {string} name
     * @param {Date} date
     * @param {string} text
     * @param {string} photo
     */
    constructor(id, username, avatar, name, date, text, photo) {
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.username = username;
        /** @type {string} */
        this.avatar = avatar;
        /** @type {string} */
        this.name = name;
        /** @type {Date} */
        this.date = date;
        /** @type {string} */
        this.text = text;
        /** @type {string} */
        this.photo = photo;
    }
}

module.exports = {
    SimpleTweet,
};
