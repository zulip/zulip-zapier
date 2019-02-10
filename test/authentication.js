/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('App.authentication.test', () => {

    it('passes authentication and returns json', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'subdomain.zulipchat.com/',
            }
        };

        const payload = {
            result: 'success',
            msg: '',
            bot_name: 'Zulip Webhook Bot'
        };

        // mocks the next request that matches this url and querystring
        nock('https://subdomain.zulipchat.com')
            .post('/api/v1/external/zapier?api_key=secret', { type: 'auth' })
            .reply(200, payload);

        appTester(App.authentication.test, bundle)
            .then((json_response) => {
                json_response.should.have.property('msg');
                json_response.result.should.eql('success');
                done();
            })
            .catch(done);

    });
});
