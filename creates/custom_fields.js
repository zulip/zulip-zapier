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

module.exports = {
    'populateUsers': populateUsers,
};
