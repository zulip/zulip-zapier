/* global it */
/* global describe */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const nock = require('nock');

describe('custom fields', () => {
    it('should return a custom/dynamic recipients field', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/api/v1',
                username: 'zapierbot@zulip.com'
            },
        };

        const payload = {
            'members': [
                {
                    'is_active': true,
                    'email': 'AARON@zulip.com',
                    'avatar_url': 'https://secure.gravatar.com/avatar/818c212b9f8830dfef491b3f7da99a14?d=identicon&version=1',
                    'is_admin': false,
                    'bot_type': null,
                    'is_bot': false,
                    'is_guest': false,
                    'full_name': 'aaron',
                    'user_id': 1
                },
                {
                    'is_active': true,
                    'email': 'cordelia@zulip.com',
                    'avatar_url': 'https://secure.gravatar.com/avatar/77c3871a68c8d70356156029fd0a4999?d=identicon&version=1',
                    'is_admin': false,
                    'bot_type': null,
                    'is_bot': false,
                    'is_guest': false,
                    'full_name': 'Cordelia Lear',
                    'user_id': 3
                }
            ],
            'result': 'success',
            'msg': ''
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .get('/api/v1/users')
            .reply(200, payload);

        appTester(App.creates.private_message.operation.inputFields[0], bundle)
            .then((json_response) => {
                json_response.choices.should.eql({
                    1: 'aaron',
                    3: 'Cordelia Lear'
                });
                done();
            })
            .catch(done);
    });

    it('should return the default recipients field', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/api/v1',
                username: 'zapierbot@zulip.com'
            },
        };

        const errorPayload = {
            'msg': 'This API is not available to incoming webhook bots.',
            'result': 'error',
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .get('/api/v1/users')
            .reply(400, errorPayload);

        appTester(App.creates.private_message.operation.inputFields[0], bundle)
            .then((json_response) => {
                const helpText = 'Email addresses of recipient Zulip users';
                json_response.type.should.eql('string');
                json_response.helpText.should.eql(helpText);
                json_response.should.not.have.property('choices');
                done();
            })
            .catch(done);
    });

    it('should return an object with stream_id:stream_name pairs', (done) => {

        const bundle = {
            authData: {
                api_key: 'secret',
                domain: 'https://yourzulipsubdomain.zulipchat.com/api/v1',
                username: 'zapierbot@zulip.com'
            },
        };

        const payload = {
            'msg': '',
            'result': 'success',
            'streams': [
                {
                    'name': 'Denmark',
                    'rendered_description': '<p>A Scandinavian country</p>',
                    'stream_id': 1,
                    'is_announcement_only': false,
                    'invite_only': false,
                    'description': 'A Scandinavian country',
                    'history_public_to_subscribers': true
                },
                {
                    'name': 'Rome',
                    'rendered_description': '<p>Yet another Italian city</p>',
                    'stream_id': 2,
                    'is_announcement_only': false,
                    'invite_only': false,
                    'description': 'Yet another Italian city',
                    'history_public_to_subscribers': true
                }
            ]
        };

        // mocks the next request that matches this url and querystring
        nock('https://yourzulipsubdomain.zulipchat.com')
            .get('/api/v1/streams?include_public=true&include_subscribed=true&include_owner_subscribed=true')
            .reply(200, payload);

        appTester(App.creates.stream_message.operation.inputFields[0], bundle)
            .then((json_response) => {
                json_response.choices.should.eql({
                    1: 'Denmark',
                    2: 'Rome'
                });
                done();
            })
            .catch(done);
    });
});
