const zulip = require('zulip-js');
const sanitize = require('./util.js').sanitizeZulipURL;
const webhookBotError = require('./util.js').webhookBotErrorMessage;

const genericBotAuth = (z, bundle) => {
    const config = {
        realm: sanitize(bundle.authData.domain),
        username: bundle.authData.username,
        apiKey: bundle.authData.api_key
    };

    return zulip(config).then((client) => {
        return client.users.me.getProfile().then((res) => {
            // If the requesting user can't authenticate because they are
            // an incoming webhook bot, we should simply return the response
            // so that incomingWebhookBotAuth can handle it.
            if (res.result !== 'success' && res.msg !== webhookBotError) {
                throw new Error(res.msg);
            }
            return res;
        });
    });
};

const incomingWebhookBotAuth = (z, bundle) => {
    bundle.authData.domain = sanitize(bundle.authData.domain);
    const url = '{{bundle.authData.domain}}/api/v1/external/zapier?api_key={{bundle.authData.api_key}}';
    const payload = {'type': 'auth'};
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: z.JSON.stringify(payload)
    };

    return z.request(url, options).then((response) => {
        const parsed_response = z.JSON.parse(response.content);
        if (response.status !== 200) {
            throw new Error(parsed_response.msg);
        }
        return parsed_response;
    });
};

const testAuth = (z, bundle) => {
    return genericBotAuth(z, bundle).then((res1) => {
        if (res1.result !== 'success' && res1.msg === webhookBotError) {
            return incomingWebhookBotAuth(z, bundle).then((res2) => res2);
        }

        return res1;
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
            helpText: 'It may look like subdomain.zulipchat.com, or zulip.your-company.com. For more details, you can visit [the official Zulip documentation](https://zulip.com/integrations/doc/zapier).'
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
