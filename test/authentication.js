/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('authentication', () => {

    it('passes generic bot authentication', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'subdomain.zulipchat.com',
            }
        };

        const payload = {
            'pointer': -1,
            'msg': '',
            'max_message_id': 28,
            'result': 'success',
            'is_bot': true,
            'email': 'webhook-bot@zulip.com',
            'client_id': '14a85cb43284d3b05dcae36d8e1c12db',
            'user_id': 5,
            'short_name': 'webhook-bot',
            'is_admin': true,
            'full_name': 'Zulip Webhook Bot'
        };

        // mocks the next request that matches this url and querystring
        nock('https://subdomain.zulipchat.com')
            .get('/api/v1/users/me')
            .reply(200, payload);

        appTester(App.authentication.test, bundle)
            .then((json_response) => {
                json_response.msg.should.eql('');
                json_response.result.should.eql('success');
                json_response.full_name.should.eql('Zulip Webhook Bot');
                done();
            })
            .catch(done);

    });

    it('passes incoming webhook bot authentication', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'subdomain.zulipchat.com',
            }
        };

        const errorPayload = {
            'msg': 'This API is not available to incoming webhook bots.',
            'result': 'error',
        };

        const successPayload = {
            'msg': '',
            'result': 'success',
            'full_name': 'Zulip Webhook Bot',
            'email': 'bot-name@zulip.com',
            'id': '5'
        };

        // mocks the next request that matches this url and querystring
        nock('https://subdomain.zulipchat.com')
            .get('/api/v1/users/me')
            .reply(400, errorPayload);

        nock('https://subdomain.zulipchat.com')
            .post('/api/v1/external/zapier?api_key=secret', { type: 'auth' })
            .reply(200, successPayload);

        appTester(App.authentication.test, bundle)
            .then((json_response) => {
                json_response.msg.should.eql('');
                json_response.result.should.eql('success');
                json_response.full_name.should.eql('Zulip Webhook Bot');
                json_response.email.should.eql('bot-name@zulip.com');
                json_response.should.have.property('id');
                done();
            })
            .catch(done);
    });
});
