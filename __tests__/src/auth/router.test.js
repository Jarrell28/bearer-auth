'use strict';

process.env.SECRET = "testtesttest";

const server = require('../../../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../../../src/auth/middleware/bearer.js');

const mockRequest = supergoose(server);

let users = {
    admin: { username: 'admin', password: 'password' },
    editor: { username: 'editor', password: 'password' },
    user: { username: 'user', password: 'password' },
};

describe('Auth Router', () => {

    Object.keys(users).forEach(userType => {
        describe(`${userType} users`, () => {

            it('can create one', async () => {

                const response = await mockRequest.post('/signup').send(users[userType]);
                const userObject = response.body;

                expect(response.status).toBe(201);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username);
            });

            it('can signin with basic', async () => {
                const response = await mockRequest.post('/signin')
                    .auth(users[userType].username, users[userType].password);

                const userObject = response.body;

                expect(response.status).toBe(200);
                expect(userObject.token).toBeDefined();
                expect(userObject.user._id).toBeDefined();
                expect(userObject.user.username).toEqual(users[userType].username);
            });

            it('can signin with bearer', async () => {

                const response = await mockRequest.post('/signin')
                    .auth(users[userType].username, users[userType].password);

                const token = response.body.token;

                const bearerResponse = await mockRequest
                    .get('/users')
                    .set('Authorization', `Bearer ${token}`);

                expect(bearerResponse.status).toBe(200);
            });
        });


        describe('bad login', () => {
            it('basic fails with known user and wrong password', async () => {

                const response = await mockRequest
                    .post('/signin')
                    .auth('admin', 'xyz');

                const userObject = response.body;

                expect(response.status).toBe(403);
                expect(userObject.user).not.toBeDefined();
                expect(userObject.token).not.toBeDefined();
            });

            it('basic fails with unknown user', async () => {
                const response = await mockRequest
                    .post('/signin')
                    .auth('nobody', 'xyz');

                const userObject = response.body;

                expect(response.status).toBe(403);
                expect(userObject.user).not.toBeDefined();
                expect(userObject.token).not.toBeDefined();
            });

            it('bearer fails with an invalid token', async () => {
                const bearerResponse = await mockRequest
                    .get('/users')
                    .set('Authorization', 'Bearer foobar')

                expect(bearerResponse.status).toBe(403);
            })
        })
    })

})