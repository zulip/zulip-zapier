const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;

module.exports = {
    key: 'stream_message',
    noun: 'Stream message',
    display: {
        label: 'Send a Stream Message',
        description: 'Sends a message to a given Zulip stream'
    },

    operation: {
        inputFields: [
            {
                key: 'stream',
                required: true,
                type: 'string',
                label: 'Stream'
            },
            {
                key: 'topic',
                required: true,
                type: 'string',
                label: 'Topic'
            },
            {
                key: 'content',
                required: true,
                type: 'text',
                label: 'Message content'
            }
        ],

        perform: (z, bundle) => {
            const params = {
                type: 'stream',
                client: 'ZulipZapierApp',
                to: bundle.inputData.stream,
                content: bundle.inputData.content,
                topic: bundle.inputData.topic
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
