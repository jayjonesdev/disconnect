/**
 * disconnect — a full-featured Discogs API v2.0 client library.
 */
export { DiscogsClient } from './client.js';
export { DiscogsOAuth } from './oauth.js';
export { Queue } from './queue.js';
export { DiscogsError, AuthError } from './error.js';
export { util } from './util.js';

export * from './types.js';

import { DiscogsClient } from './client.js';
import { util } from './util.js';

/**
 * Default export mirroring the original `require('disconnect')` shape:
 * `{ Client, util }`.
 */
export default {
  Client: DiscogsClient,
  util,
};
