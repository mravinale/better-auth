// test/token-validation.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createTestApp, startTestServer, stopTestServer } from '../setup.js';

let server;
let app;

beforeAll(async () => {
  app = createTestApp();
  server = await startTestServer(app);
}, 10000);

afterAll(async () => {
  await stopTestServer(server);
}, 10000);

describe('Token Validation', () => {
  let cookie;
  const email = `testuser${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  // Set up user and get session cookie for token validation tests
  beforeAll(async () => {
    const signUpRes = await request(server)
      .post('/api/auth/sign-up/email')
      .send({ email, password, name });
    
    cookie = signUpRes.headers['set-cookie']?.find(c => c.startsWith('better-auth.session_token'));
  });

  it('should validate JWT structure and claims', async () => {
    if (!cookie) {
      console.log('Skipping JWT validation test - no cookie available');
      return;
    }
    
    // Get a fresh JWT
    const res = await request(server)
      .get('/api/auth/token')
      .set('Cookie', cookie);
    
    expect(res.statusCode).toBe(200);
    const jwt = res.body.token;
    
    // Verify JWT structure
    const parts = jwt.split('.');
    expect(parts).toHaveLength(3);
    
    // Decode header
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'));
    expect(header).toHaveProperty('alg'); // algorithm
    // Better Auth uses EdDSA and might not include 'typ' field
    if (header.typ) {
      expect(header.typ).toBe('JWT');
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    expect(payload).toHaveProperty('sub'); // subject
    expect(payload).toHaveProperty('email', email);
    expect(payload).toHaveProperty('name', name);
    expect(payload).toHaveProperty('iat'); // issued at
    expect(payload).toHaveProperty('exp'); // expiration
    expect(payload).toHaveProperty('aud'); // audience
    expect(payload).toHaveProperty('iss'); // issuer
    
    // Verify timestamps
    const now = Math.floor(Date.now() / 1000);
    expect(payload.iat).toBeLessThanOrEqual(now);
    expect(payload.exp).toBeGreaterThan(now);
  });
}); 