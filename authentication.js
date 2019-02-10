const sanitize_zulip_url = require('./util.js').sanitize_zulip_url;

const testAuth = (z, bundle) => {
    sanitize_zulip_url(bundle);
    const url = 'https://{{bundle.authData.domain}}/api/v1/external/zapier?api_key={{bundle.authData.api_key}}';
    const payload = {'type': 'auth'};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ZapierZulipApp'
        },
        body: JSON.stringify(payload)
    };

    return z.request(url, options).then((response) => {
        const parsed_response = JSON.parse(response.content);
        if (response.status !== 200) {
            throw new Error(parsed_response.msg);
        }
        return parsed_response;
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
            key: 'api_key',
            label: 'Bot API key',
            required: true,
            type: 'string',
            helpText: 'After [creating a Zulip bot](https://zulipchat.com/help/add-a-bot-or-integration), you can retrieve its API key by following [these instructions](https://zulipchat.com/api/api-keys#get-a-bots-api-key).'
        }
    ],

    test: testAuth,

    connectionLabel: (z, bundle) => {
        return bundle.inputData.bot_name;
    }
};
