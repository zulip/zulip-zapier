const testAuth = {
    method: 'POST',
    url: 'https://{{bundle.authData.domain}}/api/v1/external/zapier?api_key={{bundle.authData.api_key}}',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ZapierZulipApp'
    }
};

module.exports = {
    type: 'custom',

    fields: [
        {
            key: 'domain',
            label: 'Your Zulip domain',
            type: 'string',
            required: true,
            helpText: 'Found in your browsers address bar after logging in to Zulip, e.g. yourzulipdomain.zulipchat.com.'
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
