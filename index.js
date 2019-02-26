const authentication = require('./authentication');
const stream_message = require('./creates/stream_message');
const private_message = require('./creates/private_message');

const App = {
    // This is just shorthand to reference the installed dependencies
    // for the app. Zapier will need to know these before we can upload.
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: authentication,

    beforeRequest: [
    ],

    afterResponse: [
    ],

    resources: {
    },

    // If you want your trigger to show up, you better include it here!
    triggers: {
    },

    // If you want your searches to show up, you better include it here!
    searches: {
    },

    // If you want your creates to show up, you better include it here!
    creates: {
        [stream_message.key]: stream_message,
        [private_message.key]: private_message
    }
};

// Finally, export the app.
module.exports = App;
