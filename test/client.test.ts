import test from 'node:test';
import assert from 'node:assert';
import { DiscogsClient } from '../src/client.js';
import type { RequestOptions } from '../src/types.js';

interface Captured {
  url?: string;
  method?: string;
  data?: unknown;
}

function stub(client: DiscogsClient, response = '{"result":"success"}'): Captured {
  const captured: Captured = {};
  client._rawRequest = function (
    options: RequestOptions,
    callback: (err: Error | null, data?: string) => void
  ) {
    captured.url = options.url;
    captured.method = options.method;
    captured.data = options.data;
    callback(null, response);
    return client;
  };
  return captured;
}

test('DiscogsClient is constructable', () => {
  assert.ok(new DiscogsClient() instanceof DiscogsClient);
});

test('authenticated() is false without auth', () => {
  assert.strictEqual(new DiscogsClient().authenticated(1), false);
});

test('authenticated() reflects user token (level 2)', () => {
  const client = new DiscogsClient('agent', { userToken: 'abc' } as never);
  assert.strictEqual(client.authenticated(), true);
  assert.strictEqual(client.authenticated(1), true);
  assert.strictEqual(client.authenticated(2), true);
});

test('auth object can be passed as the first argument', () => {
  const client = new DiscogsClient({ userToken: 'abc' } as never);
  assert.strictEqual(client.auth?.method, 'discogs');
  assert.strictEqual(client.auth?.level, 2);
});

test('setConfig overrides config', () => {
  const client = new DiscogsClient().setConfig({ host: 'www.example.com' });
  assert.strictEqual(client.config.host, 'www.example.com');
});

test('get() parses a JSON response (callback)', (t, done) => {
  const client = new DiscogsClient();
  stub(client, '{"id":1}');
  client.get({ url: '/labels/1' }, (err, data) => {
    assert.strictEqual(err, null);
    assert.deepStrictEqual(data, { id: 1 });
    done();
  });
});

test('get() returns a Promise when no callback is given', async () => {
  const client = new DiscogsClient();
  stub(client, '{"id":1}');
  const data = await client.get({ url: '/labels/1' });
  assert.deepStrictEqual(data, { id: 1 });
});

test('about() resolves with disconnect client info', async () => {
  const client = new DiscogsClient();
  stub(client, '{"hello":"world"}');
  const data = (await client.about()) as Record<string, unknown>;
  assert.ok(data.disconnect, 'disconnect info attached');
  assert.strictEqual(
    (data.disconnect as { authLevel: number }).authLevel,
    0
  );
});

test('authLevel-gated request without auth yields AuthError', async () => {
  const client = new DiscogsClient();
  await assert.rejects(
    () => client.get({ url: '/oauth/identity', authLevel: 2 }) as Promise<unknown>,
    /authenticate/i
  );
});
