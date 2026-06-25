import test from 'node:test';
import assert from 'node:assert';
import { DiscogsError, AuthError } from '../src/error.js';

test('DiscogsError has defaults and is an Error', () => {
  const err = new DiscogsError();
  assert.ok(err instanceof Error);
  assert.ok(err instanceof DiscogsError);
  assert.strictEqual(err.statusCode, 404);
  assert.strictEqual(err.message, 'Unknown error.');
  assert.strictEqual(err.name, 'DiscogsError');
});

test('DiscogsError accepts a status code and message', () => {
  const err = new DiscogsError(429, 'Too many requests');
  assert.strictEqual(err.statusCode, 429);
  assert.strictEqual(err.message, 'Too many requests');
  assert.strictEqual(err.toString(), 'DiscogsError: 429 Too many requests');
});

test('AuthError extends DiscogsError with 401', () => {
  const err = new AuthError();
  assert.ok(err instanceof DiscogsError);
  assert.ok(err instanceof AuthError);
  assert.strictEqual(err.statusCode, 401);
  assert.strictEqual(err.name, 'AuthError');
});
