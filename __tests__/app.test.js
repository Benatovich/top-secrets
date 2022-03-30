const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Secret = require('../lib/models/Secret');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@demo.com',
  password: 'guest'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  
  const agent = request.agent(app);
  
  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

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
      .send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email
    });
  });

  it('logs in an existing user by creating a new user session', async () => {
    const user = await UserService.create(mockUser);

    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);

    expect(res.body).toEqual({
      message: 'Logged in successfully',
      user
    });
  });

  it('logs a user out by deleting the session', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/sessions');
    const expected = {
      message: 'Signed out successfully',
      success: true
    };

    expect(res.body).toEqual(expected);
  });

  it('returns the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('returns a list of secrets if logged in', async () => {
    await Secret.insert({ title: 'Northwoods', description: 'false flag' });
    const [agent] = await registerAndLogin(mockUser);
    // const res = await agent.get('/api/v1/secrets');
    const res = await agent
      .get('/api/v1/secrets');

    expect(res.body).toEqual([{
      id: expect.any(String),
      title: 'Northwoods',
      description: 'false flag',
      createdAt: expect.any(String)
    }]);
  });

  it('creates a new secret if user is logged in', async () => {
    const res = await request(app)
      .post('/api/v1/secrets')
      .send({
        title: 'Northwoods',
        description: 'false flag',
      });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Northwoods',
      description: 'false flag',
      createdAt: expect.any(String)
    });
  });
});

  

