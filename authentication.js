const zulip = require('zulip-js');
const sanitize = require('./util.js').sanitizeZulipURL;

const testAuth = (z, bundle) => {
    const config = {
        realm: sanitize(bundle.authData.domain),
        username: bundle.authData.username,
        apiKey: bundle.authData.api_key
    };

    return zulip(config).then((client) => {
        return client.users.me.getProfile().then((response) => {
            if (response.result !== 'success') {
                throw new Error(response.msg);
            }
            return response;
        });
    });
};

module.exports = {
    type: 'custom',

    fields: [
        {
            key: 'domain',
            label: 'Zulip URL',
            type: 'string',
            required: true,
            helpText: 'It may look like subdomain.zulipchat.com, or zulip.your-company.com.'
        },
        {
            key: 'username',
            label: 'Bot username or email',
            type: 'string',
            required: true,
            helpText: 'After [creating a Zulip bot](https://zulipchat.com/help/add-a-bot-or-integration), you can retrieve its username and API key by going to Settings > Your bots > Active bots.'
        },
        {
            key: 'api_key',
            label: 'Bot API key',
            required: true,
            type: 'string',
            helpText: 'After [creating a Zulip bot](https://zulipchat.com/help/add-a-bot-or-integration), you can retrieve its username and API key by going to Settings > Your bots > Active bots.'
        }
    ],

    test: testAuth,

    connectionLabel: (z, bundle) => {
        return bundle.inputData.full_name;
    }
};
