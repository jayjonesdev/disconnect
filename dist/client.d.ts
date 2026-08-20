import { DiscogsOAuth } from './oauth.js';
import { database } from './database.js';
import { marketplace } from './marketplace.js';
import { user } from './user.js';
import { inventoryExport } from './inventoryExport.js';
import { inventoryUpload } from './inventoryUpload.js';
import type { Auth, ClientConfig, DiscogsCallback, RateLimit, RequestOptions } from './types.js';
export declare class DiscogsClient {
    config: ClientConfig;
    auth?: Auth;
    /**
     * @param userAgent - The user agent string, or an auth object as first arg
     * @param auth - Optional authorization data object
     */
    constructor(userAgent?: string | Auth, auth?: Auth);
    /**
     * Override the default configuration.
     */
    setConfig(customConfig: Partial<ClientConfig>): this;
    /**
     * Return whether the client is authenticated for the optionally given level.
     */
    authenticated(level?: number): boolean;
    /**
     * Test authentication by getting the identity resource for the user.
     */
    getIdentity<T = unknown>(callback: DiscogsCallback<T>): this;
    getIdentity<T = unknown>(): Promise<T>;
    /**
     * Get info about the Discogs API and this client.
     */
    about(callback: DiscogsCallback): this;
    about(): Promise<Record<string, unknown>>;
    /**
     * Send a raw request.
     */
    _rawRequest(options: RequestOptions, callback: (err: Error | null, data?: string, rateLimit?: RateLimit | null) => void): this;
    /**
     * Send a request and parse a text response to JSON.
     */
    private _request;
    /**
     * Perform a GET request against the Discogs API.
     */
    get<T = unknown>(options: RequestOptions | string, callback: DiscogsCallback<T>): this;
    get<T = unknown>(options: RequestOptions | string): Promise<T>;
    /**
     * Perform a POST request against the Discogs API.
     */
    post<T = unknown>(options: RequestOptions | string, data: Record<string, unknown> | null, callback: DiscogsCallback<T>): this;
    post<T = unknown>(options: RequestOptions | string, data: Record<string, unknown> | null): Promise<T>;
    /**
     * Perform a PUT request against the Discogs API.
     */
    put<T = unknown>(options: RequestOptions | string, data: Record<string, unknown> | null, callback: DiscogsCallback<T>): this;
    put<T = unknown>(options: RequestOptions | string, data: Record<string, unknown> | null): Promise<T>;
    /**
     * Perform a DELETE request against the Discogs API.
     */
    delete<T = unknown>(options: RequestOptions | string, callback: DiscogsCallback<T>): this;
    delete<T = unknown>(options: RequestOptions | string): Promise<T>;
    /**
     * Get an instance of the Discogs OAuth class.
     */
    oauth(): DiscogsOAuth;
    /**
     * Expose the database functions, bound to this client.
     */
    database(): ReturnType<typeof database>;
    /**
     * Expose the marketplace functions, bound to this client.
     */
    marketplace(): ReturnType<typeof marketplace>;
    /**
     * Expose the user functions, bound to this client.
     */
    user(): ReturnType<typeof user>;
    /**
     * Expose the inventory export functions, bound to this client.
     */
    inventoryExport(): ReturnType<typeof inventoryExport>;
    /**
     * Expose the inventory upload functions, bound to this client.
     */
    inventoryUpload(): ReturnType<typeof inventoryUpload>;
}
//# sourceMappingURL=client.d.ts.map