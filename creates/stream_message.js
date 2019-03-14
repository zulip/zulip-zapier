const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;
const getStreamField = require('./custom_fields.js').getStreamField;

module.exports = {
    key: 'stream_message',
    noun: 'Stream message',
    display: {
        label: 'Send a Stream Message',
        description: 'Send a message to a Zulip stream'
    },

    operation: {
        inputFields: [
            getStreamField,
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
            let stream = bundle.inputData.stream;
            if (!isNaN(parseInt(stream, 10))) {
                stream = JSON.stringify([parseInt(stream, 10)]);
            }

            const params = {
                type: 'stream',
                client: 'ZulipZapierApp',
                to: stream,
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
