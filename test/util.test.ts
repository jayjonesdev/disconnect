import test from 'node:test';
import assert from 'node:assert';
import { util } from '../src/util.js';

test('util.stripVariation strips the trailing number', () => {
  assert.strictEqual(util.stripVariation('Artist (2)'), 'Artist');
  assert.strictEqual(util.stripVariation('Artist'), 'Artist');
});

test('util.escape escapes a string for query use', () => {
  assert.strictEqual(util.escape('!@#$%^&*()+'), '!%40%23%24%25%5E%26*()%2B');
});

test('util.addParams appends params correctly', () => {
  assert.strictEqual(
    util.addParams('http://an-url.com', { foo: 'bar', baz: 1 }),
    'http://an-url.com?foo=bar&baz=1'
  );
  assert.strictEqual(
    util.addParams('http://an-url.com?y=5', { foo: 'bar', baz: 1 }),
    'http://an-url.com?y=5&foo=bar&baz=1'
  );
  assert.strictEqual(util.addParams('http://an-url.com', {}), 'http://an-url.com');
  assert.strictEqual(util.addParams('http://an-url.com'), 'http://an-url.com');
});

test('util.addParams skips null/undefined values', () => {
  assert.strictEqual(
    util.addParams('/path', { a: 1, b: null, c: undefined }),
    '/path?a=1'
  );
});

test('util.merge deep-clones nested objects', () => {
  const source = { a: 1, nested: { x: 1 } };
  const target = util.merge({}, source);
  assert.deepStrictEqual(target, source);
  (target as { nested: { x: number } }).nested.x = 2;
  assert.strictEqual(source.nested.x, 1, 'source must not be mutated');
});
