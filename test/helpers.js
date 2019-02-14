/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('helpers', () => {

    it('should return a list of streams', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/',
            }
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .post('/api/v1/external/zapier?api_key=secret', { 'type': 'list_streams' })
            .reply(200, { result: 'success', msg: '', streams: ['all', 'test'] });

        appTester(App.creates.stream_message.operation.inputFields[0], bundle)
            .then((json_response) => {
                json_response.choices.should.eql(['all', 'test']);
                done();
            })
            .catch(done);

    });
});