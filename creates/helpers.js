const sanitizeZulipURL = require('../util.js').sanitizeZulipURL;

const listStreams = (z, bundle) => {
    sanitizeZulipURL(bundle);
    const promise = z.request({
        url: 'https://{{bundle.authData.domain}}/api/v1/external/zapier',
        method: 'POST',
        body: JSON.stringify({ type: 'list_streams' }),
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

        const field = {
            key: 'stream',
            required: true,
            type: 'string',
            label: 'Stream',
            choices: parsed_response.streams
        };

        return field;
    });
};

module.exports = {
    'listStreams': listStreams
};
