const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

// const mockSecret = {
//   title: 'Test',
//   description: 'confidential',
//   created_at: '',
//   user_id: ''
// };

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it.only('creates a secret', async () => {
    const res = await request(app)
      .post('/api/v1/secrets')
      .send({ });
    // const { title, description, created_at } = mockSecret;

    expect(res.body).toEqual({
      id: expect.any(String),
      ...mockSecret
    });
  });


  
});
