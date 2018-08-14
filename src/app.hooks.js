const log = require('./hooks/log');

module.exports = {
  before: {
    all: [ log() ],
  },

  after: {
    all: [ log() ],
  },

  error: {
    all: [ log() ],
  }
};
