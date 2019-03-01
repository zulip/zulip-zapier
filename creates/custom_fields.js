const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;

const populateUsers = (z, bundle) => {
    const config = {
        realm: sanitize(bundle.authData.domain),
        username: bundle.authData.username,
        apiKey: bundle.authData.api_key
    };

    return zulip(config).then((client) => {
        return client.users.retrieve().then((response) => {
            if (response.result !== 'success') {
                throw new Error(response.msg);
            }

            var choices = {};
            response.members.forEach((user) => {
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

const populateStreams = (z, bundle) => {
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
        return client.streams.retrieve(params).then((response) => {
            if (response.result !== 'success') {
                throw new Error(response.msg);
            }

            var choices = {};
            response.streams.forEach((stream) => {
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

module.exports = {
    'populateUsers': populateUsers,
    'populateStreams': populateStreams
};
