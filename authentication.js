const testAuth = {
    method: 'POST',
    url: 'https://{{bundle.authData.subdomain}}.zulipchat.com/api/v1/external/zapier?api_key={{bundle.authData.api_key}}',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ZapierZulipApp'
    }
};

module.exports = {
    type: 'custom',

    fields: [
        {
            key: 'subdomain',
            label: 'Your Zulip subdomain',
            type: 'string',
            required: true,
            helpText: 'Found in your browsers address bar after logging in to Zulip.'
        },
        {
            key: 'api_key',
            label: 'Your Zulip bot\'s API Key',
            required: true,
            type: 'string',
            helpText: 'Found in Settings -> Your bots.'
        }
    ],

    test: testAuth,

    // assuming "result" is a key in the json returned from testAuth
    connectionLabel: (z, bundle) => {
        return bundle.inputData.result;
    }
};
