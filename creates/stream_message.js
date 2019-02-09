const URL = require('url-parse');

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
            const parsed_domain = new URL(bundle.authData.domain);
            bundle.authData.domain = parsed_domain.hostname;
            const promise = z.request({
                url: 'https://{{bundle.authData.domain}}/api/v1/external/zapier',
                method: 'POST',
                body: JSON.stringify({
                    type: 'stream',
                    content: bundle.inputData.content,
                    topic: bundle.inputData.topic
                }),
                params: {
                    stream: bundle.inputData.stream
                },
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'ZapierZulipApp'
                }
            });

            return promise.then((response) => {
                const parsed_response = JSON.parse(response.content);
                if (response.status !== 200) {
                    throw new Error(parsed_response.msg);
                }
                return parsed_response;
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
