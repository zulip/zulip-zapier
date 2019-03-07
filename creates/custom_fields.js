const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;
const webhookBotError = require('../util.js').webhookBotErrorMessage;

const getUsers = (z, bundle) => {
    const config = {
        realm: sanitize(bundle.authData.domain),
        username: bundle.authData.username,
        apiKey: bundle.authData.api_key
    };

    return zulip(config).then((client) => {
        return client.users.retrieve().then((res) => {
            // If the requesting user can't authenticate because they are
            // an incoming webhook bot, we should simply return the response
            // so that getRecipientField can handle it.
            if (res.result !== 'success' && res.msg === webhookBotError) {
                return res;
            }
            else if (res.result !== 'success' && res.msg !== webhookBotError) {
                throw new Error(res.msg);
            }

            var choices = {};
            res.members.forEach((user) => {
                if (!user.is_bot) {
                    choices[user.user_id] = user.full_name;
                }
            });

            const field = {
                key: 'recipients',
                required: true,
                label: 'Recipient(s)',
                choices: choices,
                list: true
            };

            return field;
        });
    });
};

const getRecipientField = (z, bundle) => {
    const defaultField = {
        key: 'recipients',
        required: true,
        type: 'string',
        label: 'Recipient(s)',
        helpText: 'Email addresses of recipient Zulip users',
        list: true
    };

    return getUsers(z, bundle).then((res) => {
        if (res.result !== 'success' && res.msg === webhookBotError) {
            return defaultField;
        }

        return res;
    });
};

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
    'getRecipientField': getRecipientField,
    'getStreamField': getStreamField
};
