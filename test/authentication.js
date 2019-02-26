/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('authentication', () => {

    it('passes authentication and returns json', (done) => {

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
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                json_response.should.have.property('full_name');
                done();
            })
            .catch(done);

    });
});
