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
                stream: 2,
                topic: 'Sample topic',
                content: 'Sample content'
            }
        };

        const sample = {
            result: 'success',
            msg: '',
            id: 36,
            message_url: 'https://zulip.yourcompany.org/#narrow/stream/announce/topic/Announcement/near/36'
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/messages')
            .reply(200, sample);

        appTester(App.creates.stream_message.operation.perform, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                json_response.should.have.property('id');
                json_response.should.have.property('message_url');
                done();
            })
            .catch(done);

    });

    it('should send a stream message using a stream name', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/api/v1',
                username: 'zapierbot@zulip.com'
            },
            inputData: {
                stream: '#stream',
                topic: 'Sample topic',
                content: 'Sample content'
            }
        };

        const sample = {
            result: 'success',
            msg: '',
            id: 36,
            message_url: 'https://zulip.yourcompany.org/#narrow/stream/announce/topic/Announcement/near/36'
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/messages')
            .reply(200, sample);

        appTester(App.creates.stream_message.operation.perform, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                json_response.should.have.property('id');
                json_response.should.have.property('message_url');
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

        const sample = {
            result: 'success',
            msg: '',
            id: 36,
            message_url: 'https://yourzulipsubdomain.zulipchat.com/#narrow/id/36'
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/messages')
            .reply(200, sample);

        appTester(App.creates.private_message.operation.perform, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.should.have.property('id');
                json_response.result.should.eql('success');
                json_response.should.have.property('message_url');
                done();
            })
            .catch(done);
    });
});
