const sanitizeZulipURL = require('../util.js').sanitizeZulipURL;

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
            sanitizeZulipURL(bundle);
            const promise = z.request({
                url: 'https://{{bundle.authData.domain}}/api/v1/external/zapier',
                method: 'POST',
                body: JSON.stringify({
                    type: 'private',
                    content: bundle.inputData.content,
                    to: bundle.inputData.recipients
                }),
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
