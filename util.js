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

const constructStreamMessageURL = (data) => {
    let stream_info = data.stream;
    if (!isNaN(parseInt(stream_info, 10))) {
        stream_info = stream_info + '-';
    }
    const url = `${data.realm}/#narrow/stream/${stream_info}/topic/${data.topic}/near/${data.id}`;
    return encodeURI(url);
};

module.exports = {
    'sanitizeZulipURL': sanitizeZulipURL,
    'webhookBotErrorMessage': webhookBotErrorMessage,
    'constructStreamMessageURL': constructStreamMessageURL
};
