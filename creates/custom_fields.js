const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;
const webhookBotError = require('../util.js').webhookBotErrorMessage;

const getStreams = (z, bundle) => {
    const config = {
        realm: sanitize(bundle.authData.domain),
        username: bundle.authData.username,
        apiKey: bundle.authData.api_key
    };

    return zulip(config).then((client) => {
        const params = {
            include_public: true,
            include_subscribed: true,
            include_owner_subscribed: true
        };
        return client.streams.retrieve(params).then((res) => {
            // If the requesting user can't authenticate because they are
            // an incoming webhook bot, we should simply return the response
            // so that getStreamField can handle it.
            if (res.result !== 'success' && res.msg === webhookBotError) {
                return res;
            }
            else if (res.result !== 'success' && res.msg !== webhookBotError) {
                throw new Error(res.msg);
            }

            var choices = {};
            res.streams.forEach((stream) => {
                choices[stream.stream_id] = stream.name;
            });

            const field = {
                key: 'stream',
                required: true,
                label: 'Stream',
                choices: choices,
            };

            return field;
        });
    });
};

const getStreamField = (z, bundle) => {
    const defaultField =  {
        key: 'stream',
        required: true,
        type: 'string',
        label: 'Stream name'
    };

    return getStreams(z, bundle).then((res) => {
        if (res.result !== 'success' && res.msg === webhookBotError) {
            return defaultField;
        }

        return res;
    });
};

module.exports = {
    'getStreamField': getStreamField
};
