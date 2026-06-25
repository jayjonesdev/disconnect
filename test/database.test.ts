import test from 'node:test';
import assert from 'node:assert';
import { DiscogsClient } from '../src/client.js';
import type { RequestOptions } from '../src/types.js';

function authedClientWithStub(): { client: DiscogsClient; captured: { url?: string } } {
  const client = new DiscogsClient('agent', {
    consumerKey: 'u',
    consumerSecret: 'p',
  } as never);
  const captured: { url?: string } = {};
  client._rawRequest = function (
    options: RequestOptions,
    callback: (err: Error | null, data?: string) => void
  ) {
    captured.url = options.url;
    callback(null, '{"result":"success"}');
    return client;
  };
  return { client, captured };
}

test('search with params object only', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().search({ artist: 'X', title: 'Y' }, (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/database/search?artist=X&title=Y');
    done();
  });
});

test('search with query and params', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().search('somequery', { artist: 'X', title: 'Y' }, (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(
      captured.url,
      '/database/search?artist=X&title=Y&q=somequery'
    );
    done();
  });
});

test('search with query only', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().search('somequery', (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/database/search?q=somequery');
    done();
  });
});

test('getReleaseStats builds the stats path', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().getReleaseStats(249504, (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/releases/249504/stats');
    done();
  });
});

test('getCommunityReleaseRating builds the rating path', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().getCommunityReleaseRating(249504, (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/releases/249504/rating');
    done();
  });
});

test('getRelease appends curr_abbr when provided', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().getRelease(249504, 'USD', (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/releases/249504?curr_abbr=USD');
    done();
  });
});

test('getRelease without currency omits the param (callback as 2nd arg)', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.database().getRelease(249504, (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(captured.url, '/releases/249504');
    done();
  });
});

test('marketplace.getReleaseStatistics builds the statistics path', (t, done) => {
  const { client, captured } = authedClientWithStub();
  client.marketplace().getReleaseStatistics(249504, 'EUR', (err) => {
    assert.strictEqual(err, null);
    assert.strictEqual(
      captured.url,
      '/marketplace/release_statistics/249504?curr_abbr=EUR'
    );
    done();
  });
});
