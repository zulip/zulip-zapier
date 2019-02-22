const URL = require('url').URL;

const sanitizeZulipURL = (bundle) => {
    if (!bundle.authData.domain.match(/^[a-zA-Z]+:\/\//))
    {
        bundle.authData.domain = 'http://' + bundle.authData.domain;
    }
    const parsed_url = new URL(bundle.authData.domain);
    bundle.authData.domain = parsed_url.hostname;
};

module.exports = {
    'sanitizeZulipURL': sanitizeZulipURL
};
