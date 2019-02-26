const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;

module.exports = {
    key: 'private_message',

    noun: 'Private message',
    display: {
        label: 'Send a Private Message',
        description: 'Sends a private message to one or more Zulip users'
    },

    operation: {
        inputFields: [
            {
                key: 'recipients',
                required: true,
                type: 'string',
                label: 'Recipient(s)',
                helpText: 'Email addresses of recipient Zulip users',
                list: true
            },
            {
                key: 'content',
                required: true,
                type: 'text',
                label: 'Message content',
            }
        ],

        perform: (z, bundle) => {
            const params = {
                type: 'private',
                client: 'ZulipZapierApp',
                to: JSON.stringify(bundle.inputData.recipients),
                content: bundle.inputData.content
            };

            const config = {
                realm: sanitize(bundle.authData.domain),
                username: bundle.authData.username,
                apiKey: bundle.authData.api_key
            };

            return zulip(config).then((client) => {
                return client.messages.send(params).then((response) => {
                    if (response.result !== 'success') {
                        throw new Error(response.msg);
                    }
                    return response;
                });
            });
        },

        // In cases where Zapier needs to show an example record to the user,
        // but we are unable to get a live example from the API, Zapier will
        // fallback to this hard-coded sample.
        sample: {
            result: 'success',
            msg: ''
        },
    }
};
