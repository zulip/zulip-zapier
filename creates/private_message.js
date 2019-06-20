const zulip = require('zulip-js');
const sanitize = require('../util.js').sanitizeZulipURL;
const constructPrivateMessageURL = require('../util.js').constructPrivateMessageURL;

module.exports = {
    key: 'private_message',

    noun: 'Private message',
    display: {
        label: 'Send a Private Message',
        description: 'Send a private or group message'
    },

    operation: {
        inputFields: [
            {
                key: 'recipients',
                required: true,
                type: 'string',
                label: 'Recipient(s)',
                helpText: 'Email addresses of recipients. Use the **+** on the far right to add more than one.',
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
            const userIDs = [];
            bundle.inputData.recipients.forEach((id) => {
                if (!isNaN(parseInt(id))) {
                    userIDs.push(parseInt(id));
                }
                else {
                    userIDs.push(id);
                }
            });

            const params = {
                type: 'private',
                client: 'ZulipZapierApp',
                to: z.JSON.stringify(userIDs),
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

                    const data = {
                        realm: config.realm,
                        id: response.id
                    };
                    response.message_url = constructPrivateMessageURL(data);

                    return response;
                });
            });
        },

        // In cases where Zapier needs to show an example record to the user,
        // but we are unable to get a live example from the API, Zapier will
        // fallback to this hard-coded sample.
        sample: {
            result: 'success',
            msg: '',
            id: 36,
            message_url: 'https://yourzulipsubdomain.zulipchat.com/#narrow/id/36'
        },
    }
};
