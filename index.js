
const authentication = require('./authentication');

// Include the API key on all outbound requests.
// This function runs before each request is sent out.
const includeApiKey = (request, z, bundle) => {
    if (bundle.authData.apiKey) {
        request.params = request.params || {};
        request.params.api_key = bundle.authData.apiKey;
    }
    return request;
};

const App = {
    // This is just shorthand to reference the installed dependencies
    // for the app. Zapier will need to know these before we can upload.
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: authentication,

    beforeRequest: [
        includeApiKey
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
    }
};

// Finally, export the app.
module.exports = App;
