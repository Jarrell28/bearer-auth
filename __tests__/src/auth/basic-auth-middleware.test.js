'use strict';

require('@code-fellows/supergoose');
const middleware = require('../../../src/auth/middleware/basic.js');
const Users = require('../../../src/auth/models/users.js');

let users = {
    admin: { username: 'admin', password: 'password' }
};

beforeAll(async (done) => {
    await new Users(users.admin).save();
    done();
});

describe('Auth Middleware', () => {

    // admin:password: YWRtaW46cGFzc3dvcmQ=
    // admin:foo: YWRtaW46Zm9v

    const req = {};
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(() => res)
    }
    const next = jest.fn();


    describe('user authentication', () => {

        it('fails a login for a user (admin) with the incorrect basic credentials', () => {

            req.headers = {
                authorization: 'Basic YWRtaW46Zm9v',
            }

            return middleware(req, res, next)
                .then(() => {
                    expect(next).not.toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(403);
                })
        });

        it('logs in an admin user with the right credentials', () => {

            req.headers = {
                authorization: 'Basic YWRtaW46cGFzc3dvcmQ='
            };

            return middleware(req, res, next)
                .then(() => {
                    expect(next).toHaveBeenCalled();
                })
        })
    })
})
