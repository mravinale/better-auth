// test/api.e2e.test.js
import request from 'supertest';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/infrastructure/auth.js';
import apiRoutes from '../src/infrastructure/routes.js';

let server;
const app = express();
app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json());
app.use('/api', apiRoutes);

beforeAll(async () => {
  // Assumes the PostgreSQL schema is already migrated and clean
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('Better Auth API E2E', () => {
  let bearerToken;
  const email = `testuser${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  it('should sign up a new user', async () => {
    console.log('[E2E] About to send sign-up request');
    const res = await request(server)
      .post('/api/auth/sign-up/email')
      .send({ email, password, name });
    if (res.statusCode !== 200) {
      console.error('[TEST DEBUG] Sign-up failed response:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.headers['set-auth-token']).toBeDefined();
    bearerToken = decodeURIComponent(res.headers['set-auth-token']);
    console.log('[TEST DEBUG] Bearer token after signup:', bearerToken);

  });

  it('should access the protected endpoint with Bearer token', async () => {
    const rawToken = bearerToken.split('.')[0];
    const authHeader = `Bearer ${rawToken}`;
    console.log('[TEST DEBUG] Using Authorization header for /api/protected:', authHeader);
    const res = await request(server)
      .get('/api/protected')
      .set('Authorization', authHeader);
    console.log('[TEST DEBUG] /api/protected response:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(email);
  });

  it('should log out the user', async () => {
    const res = await request(server)
      .post('/api/auth/sign-out')
      .set('Authorization', `Bearer ${bearerToken.split('.')[0]}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail to access protected endpoint after logout', async () => {
    const res = await request(server)
      .get('/api/protected')
      .set('Authorization', `Bearer ${bearerToken.split('.')[0]}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('should sign in again and access protected endpoint', async () => {
    const res = await request(server)
      .post('/api/auth/sign-in/email')
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.headers['set-auth-token']).toBeDefined();
    bearerToken = decodeURIComponent(res.headers['set-auth-token']);

    const protectedRes = await request(server)
      .get('/api/protected')
      .set('Authorization', `Bearer ${bearerToken.split('.')[0]}`);
    expect(protectedRes.statusCode).toBe(200);
    expect(protectedRes.body.status).toBe('success');
    expect(protectedRes.body.data.user.email).toBe(email);


  });

  it('should return health check', async () => {
    const res = await request(server)
      .get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
