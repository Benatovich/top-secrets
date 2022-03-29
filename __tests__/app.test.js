const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'test@demo.com', password: 'guest' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@demo.com'
    });
  });

  it.only('logs in an existing user by creating a new user session', async () => {
    const user = await UserService.create({
      email: 'test@demo.com', 
      password: 'OneTwoThreeFourFive'
    });

    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({
        email: 'test@demo.com', 
        password: 'OneTwoThreeFourFive'  
      });

    expect(res.body).toEqual({
      message: 'Logged in successfully',
      user
    });
  });


});
