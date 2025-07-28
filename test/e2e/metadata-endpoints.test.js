// test/metadata-endpoints.test.js
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

describe('Metadata Endpoints', () => {
  it('should serve JWKS endpoint', async () => {
    const res = await request(server)
      .get('/api/auth/jwks');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('keys');
    expect(Array.isArray(res.body.keys)).toBe(true);
    expect(res.body.keys.length).toBeGreaterThan(0);
    
    // Verify JWKS structure (Better Auth uses Ed25519 keys)
    const key = res.body.keys[0];
    expect(key).toHaveProperty('kty'); // key type
    expect(key).toHaveProperty('alg'); // algorithm
    expect(key).toHaveProperty('crv'); // curve
    expect(key).toHaveProperty('x'); // x coordinate
    // Note: Ed25519 keys may not have 'kid' or 'use' property in Better Auth
  });

  it('should serve Better Auth reference', async () => {
    const res = await request(server)
      .get('/api/auth/reference');
    
    expect(res.statusCode).toBe(200);
    // Should return some content (could be HTML or JSON)
    expect(res.body || res.text).toBeTruthy();
  });
}); 