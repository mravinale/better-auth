// test/api.e2e.test.js
import fs from 'fs';
import request from 'supertest';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/infrastructure/auth.js';
import apiRoutes from '../src/infrastructure/routes.js';
import Database from 'better-sqlite3';

let server;
const app = express();
app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json());
app.use('/api', apiRoutes);


beforeAll(async () => {
  const db = new Database('database.sqlite');
  // Check for table existence
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  const requiredTables = ['user', 'session', 'account'];
  const missingTables = requiredTables.filter(t => !tables.includes(t));
  if (missingTables.length > 0) {
    // Run migration SQL from file
    const migrationSQL = fs.readFileSync('./better-auth_migrations/2025-05-28T12-55-38.842Z.sql', 'utf8');
    db.exec(migrationSQL);
  }
  // Clean up all rows from user, session, and account tables
  db.prepare('DELETE FROM session').run();
  db.prepare('DELETE FROM account').run();
  db.prepare('DELETE FROM user').run();
  db.close();
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
    // Log session table contents
    const db = new Database('database.sqlite');
    const sessions = db.prepare('SELECT * FROM session').all();
    console.log('[TEST DEBUG] Session table after signup:', sessions);
    db.close();
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
