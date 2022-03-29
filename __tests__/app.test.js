const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a user session/logs a user in via POST', async () => {
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@demo.com', password: 'guest' });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@demo.com'
    });
  });



  
});
