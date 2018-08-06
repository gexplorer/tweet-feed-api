module.exports = {
    "env": {
        "es6": true,
        "node": true
    },

    extends: ['eslint:recommended'],
    "parserOptions": {
        "ecmaVersion": 2017
    },
    rules: {
        eqeqeq: ['error', 'always'], // adding some custom ESLint rules
        "no-console": 1,
        "indent": ["error", 4]
    }
};
