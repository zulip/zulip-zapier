/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('creates', () => {

    it('should send a stream message', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/api/v1',
                username: 'zapierbot@zulip.com'
            },
            inputData: {
                stream: 'test',
                topic: 'Sample topic',
                content: 'Sample content'
            }
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/messages')
            .reply(200, { result: 'success', msg: '' });

        appTester(App.creates.stream_message.operation.perform, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                done();
            })
            .catch(done);

    });

    it('should send a private message', (done) => {
        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/',
                username: 'zapierbot@zulip.com'
            },
            inputData: {
                recipients: [1, 3],
                content: 'Sample content'
            }
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/messages')
            .reply(200, { result: 'success', msg: '' });

        appTester(App.creates.private_message.operation.perform, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                done();
            })
            .catch(done);
    });
});
