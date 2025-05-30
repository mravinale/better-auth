// test/api.e2e.test.js
import request from 'supertest';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/infrastructure/auth.js';

let server;
const app = express();
app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json());

beforeAll(async () => {
  // Assumes the PostgreSQL schema is already migrated and clean
  server = app.listen(0);
});

afterAll(async () => { 
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  }); 
  if (auth.database && typeof auth.database.end === 'function') {
    await auth.database.end(); 
  } 
});

describe('Better Auth API E2E', () => {
  let bearerToken;
  const email = `testuser${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  it('should sign up a new user', async () => {
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


  it('should log out the user', async () => {
    const res = await request(server)
      .post('/api/auth/sign-out')
      .set('Authorization', `Bearer ${bearerToken.split('.')[0]}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
 

  it('should sign in again', async () => {
    const res = await request(server)
      .post('/api/auth/sign-in/email')
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.headers['set-auth-token']).toBeDefined();
    bearerToken = decodeURIComponent(res.headers['set-auth-token']);
 
  });
 
});
