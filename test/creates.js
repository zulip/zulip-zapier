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
                domain: 'yourzulipsubdomain.zulipchat.com',
            },
            inputData: {
                stream: 'test',
                topic: 'Sample topic',
                content: 'Sample content'
            }
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/external/zapier?stream=test&api_key=secret')
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
                domain: 'yourzulipsubdomain.zulipchat.com',
            },
            inputData: {
                to: ['iago@zulip.com', 'cordelia@zulip.com'],
                content: 'Sample content'
            }
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/external/zapier?api_key=secret')
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
