const URL = require('url-parse');

const testAuth = (z, bundle) => {
    const parsed_domain = new URL(bundle.authData.domain);
    bundle.authData.domain = parsed_domain.hostname;
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
            label: 'Your organization\'s Zulip domain',
            type: 'string',
            required: true,
            helpText: 'Your domain URL is found in your browser\'s address bar after logging into Zulip, e.g. **subdomain.zulipchat.com**.'
        },
        {
            key: 'api_key',
            label: 'Your Zulip bot\'s API Key',
            required: true,
            type: 'string',
            helpText: 'After [creating a Zulip bot](https://zulipchat.com/help/add-a-bot-or-integration), you can find its API key by following [these instructions](https://zulipchat.com/api/api-keys#get-a-bots-api-key).'
        }
    ],

    test: testAuth,

    // assuming "result" is a key in the json returned from testAuth
    connectionLabel: (z, bundle) => {
        return bundle.inputData.result;
    }
};
