const URL = require('url').URL;

const webhookBotErrorMessage = 'This API is not available to incoming webhook bots.';

const sanitizeZulipURL = (domain) => {
    if (!domain.match(/^[a-zA-Z]+:\/\//))
    {
        domain = 'https://' + domain;
    }
    const parsed_url = new URL(domain);
    return parsed_url.origin;
};

module.exports = {
    'sanitizeZulipURL': sanitizeZulipURL,
    'webhookBotErrorMessage': webhookBotErrorMessage
};
