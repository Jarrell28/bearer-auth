'use strict';

process.env.SECRET = "testtesttest";

require('@code-fellows/supergoose');
const middleware = require('../../../src/auth/middleware/bearer.js');
const Users = require('../../../src/auth/models/users.js');
const jwt = require('jsonwebtoken');

let users = {
    admin: { username: 'admin', password: 'password' }
};

beforeAll(async (done) => {
    await new Users(users.admin).save();
    done();
});

describe('Auth Middleware', () => {

    const req = {};
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(() => res)
    };
    const next = jest.fn();

    describe('user authentication', () => {

        it('fails a login for a user with an incorrect token', () => {
            req.headers = {
                authorization: 'Bearer thisisabadtoken'
            };

            return middleware(req, res, next)
                .then(() => {
                    expect(next).not.toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(403);
                })
        })

        it('logs in a user with a proper token', () => {

            const user = { username: 'admin', password: 'password' };
            const token = jwt.sign(user, process.env.SECRET);

            req.headers = {
                authorization: `Bearer ${token}`
            };

            return middleware(req, res, next)
                .then(() => {
                    expect(next).toHaveBeenCalled();
                })
        })
    })
})