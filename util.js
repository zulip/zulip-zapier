const URL = require('url').URL;

const sanitize_zulip_url = (bundle) => {
    if (!bundle.authData.domain.match(/^[a-zA-Z]+:\/\//))
    {
        bundle.authData.domain = 'http://' + bundle.authData.domain;
    }
    const parsed_url = new URL(bundle.authData.domain);
    bundle.authData.domain = parsed_url.hostname;
};

module.exports = {
    'sanitize_zulip_url': sanitize_zulip_url
};
