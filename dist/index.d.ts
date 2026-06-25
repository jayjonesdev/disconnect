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
/**
 * Default export mirroring the original `require('disconnect')` shape:
 * `{ Client, util }`.
 */
declare const _default: {
    Client: typeof DiscogsClient;
    util: {
        stripVariation(name: string): string;
        addParams(url: string, data?: Record<string, unknown> | null): string;
        escape(str: string): string;
        merge<T extends object>(target: T, source: object): T;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map