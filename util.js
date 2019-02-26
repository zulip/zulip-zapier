const URL = require('url').URL;

const sanitizeZulipURL = (domain) => {
    if (!domain.match(/^[a-zA-Z]+:\/\//))
    {
        domain = 'http://' + domain;
    }
    const parsed_url = new URL(domain);
    return parsed_url.origin;
};

module.exports = {
    'sanitizeZulipURL': sanitizeZulipURL
};
