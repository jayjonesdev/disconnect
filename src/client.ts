import * as https from 'https';
import * as zlib from 'zlib';
import * as url from 'url';
import { DiscogsError, AuthError } from './error.js';
import { util } from './util.js';
import { Queue } from './queue.js';
import { DiscogsOAuth } from './oauth.js';
import { database } from './database.js';
import { marketplace } from './marketplace.js';
import { user } from './user.js';
import { inventoryExport } from './inventoryExport.js';
import { inventoryUpload } from './inventoryUpload.js';
import type {
  Auth,
  ClientConfig,
  DiscogsCallback,
  RateLimit,
  RequestOptions,
} from './types.js';

// Read package metadata at runtime (resolves to the package root from dist/).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg: { version: string; homepage: string } = require('../package.json');

/**
 * Default configuration.
 */
const defaultConfig: ClientConfig = {
  host: 'api.discogs.com',
  port: 443,
  userAgent: 'DisConnectClient/' + pkg.version + ' +' + pkg.homepage,
  apiVersion: 'v2',
  outputFormat: 'discogs', // 'discogs' / 'plaintext' / 'html'
  requestLimit: 25, // Max requests per interval (unauthenticated)
  requestLimitAuth: 60, // Max requests per interval (authenticated)
  requestLimitInterval: 60000, // Request interval in milliseconds
};

/**
 * The request queue, shared by all DiscogsClient instances.
 */
const queue = new Queue({
  maxCalls: defaultConfig.requestLimit,
  interval: defaultConfig.requestLimitInterval,
});

export class DiscogsClient {
  config: ClientConfig;
  auth?: Auth;

  /**
   * @param userAgent - The user agent string, or an auth object as first arg
   * @param auth - Optional authorization data object
   */
  constructor(userAgent?: string | Auth, auth?: Auth) {
    // Start from a clone of the default configuration
    this.config = util.merge({} as ClientConfig, defaultConfig);

    // Set a custom User Agent when provided
    if (typeof userAgent === 'string') {
      this.config.userAgent = userAgent;
    }

    // No userAgent provided, but instead an auth object as the first argument
    if (typeof userAgent === 'object' && userAgent !== null) {
      auth = userAgent;
    }

    if (auth && typeof auth === 'object') {
      queue.setConfig({ maxCalls: this.config.requestLimitAuth });
      if (!('method' in auth) || !auth.method) {
        auth.method = 'discogs';
      }
      if (!('level' in auth) || auth.level === undefined) {
        if (auth.userToken) {
          auth.level = 2;
        } else if (auth.consumerKey && auth.consumerSecret) {
          auth.level = 1;
        } else {
          auth.level = 0;
        }
      }
      this.auth = util.merge({} as Auth, auth);
    } else {
      // Unauthenticated clients use the lower shared request limit
      queue.setConfig({ maxCalls: this.config.requestLimit });
    }
  }

  /**
   * Override the default configuration.
   */
  setConfig(customConfig: Partial<ClientConfig>): this {
    util.merge(this.config, customConfig);
    queue.setConfig({
      maxCalls: this.authenticated()
        ? this.config.requestLimitAuth
        : this.config.requestLimit,
      interval: this.config.requestLimitInterval,
    });
    return this;
  }

  /**
   * Return whether the client is authenticated for the optionally given level.
   */
  authenticated(level = 0): boolean {
    return (
      typeof this.auth !== 'undefined' &&
      this.auth.level > 0 &&
      this.auth.level >= level
    );
  }

  /**
   * Test authentication by getting the identity resource for the user.
   */
  getIdentity<T = unknown>(callback: DiscogsCallback<T>): this;
  getIdentity<T = unknown>(): Promise<T>;
  getIdentity<T = unknown>(
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    return this.get<T>({ url: '/oauth/identity', authLevel: 2 }, callback as DiscogsCallback<T>);
  }

  /**
   * Get info about the Discogs API and this client.
   */
  about(callback: DiscogsCallback): this;
  about(): Promise<Record<string, unknown>>;
  about(
    callback?: DiscogsCallback
  ): this | Promise<Record<string, unknown>> {
    const clientInfo = {
      version: pkg.version,
      userAgent: this.config.userAgent,
      authMethod: this.auth ? this.auth.method : 'none',
      authLevel: this.auth ? this.auth.level : 0,
    };
    if (typeof callback === 'function') {
      return this.get('', (err, data) => {
        const d = data as Record<string, unknown> | undefined;
        if (d) {
          d.disconnect = clientInfo;
        }
        callback(err, d);
      });
    }
    return (this.get('') as Promise<Record<string, unknown>>).then((data) => {
      if (data) {
        data.disconnect = clientInfo;
      }
      return data;
    });
  }

  /**
   * Send a raw request.
   */
  _rawRequest(
    options: RequestOptions,
    callback: (
      err: Error | null,
      data?: string,
      rateLimit?: RateLimit | null
    ) => void
  ): this {
    let data: string | Record<string, unknown> | null = options.data || null;
    const method = options.method || 'GET';
    const urlParts = url.parse(options.url);
    const encoding = options.encoding || 'utf8';

    // Build request headers
    const headers: Record<string, string | number> = {
      'User-Agent': this.config.userAgent,
      Accept:
        'application/vnd.discogs.' +
        this.config.apiVersion +
        '.' +
        this.config.outputFormat +
        '+json,application/octet-stream',
      'Accept-Encoding': 'gzip,deflate',
      Host: urlParts.host || this.config.host,
      Connection: 'close',
      'Content-Length': 0,
    };

    // Add content headers for POST/PUT requests that contain data
    if (data) {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      }
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data as string, 'utf8');
    }

    // Add Authorization header when authenticated (or authenticating)
    if (this.auth && (this.auth.consumerKey || this.auth.userToken)) {
      let authHeader = '';
      if (this.auth.method === 'oauth') {
        const fullUrl =
          urlParts.protocol && urlParts.host
            ? urlParts.href
            : 'https://' + this.config.host + (urlParts.path || '');
        authHeader = this.oauth().toHeader(method, fullUrl);
      } else if (this.auth.method === 'discogs') {
        authHeader = 'Discogs';
        if (this.auth.userToken) {
          authHeader += ' token=' + this.auth.userToken;
        } else if (this.auth.consumerKey) {
          authHeader +=
            ' key=' +
            this.auth.consumerKey +
            ', secret=' +
            this.auth.consumerSecret;
        }
      }
      headers['Authorization'] = authHeader;
    }

    const requestOptions: https.RequestOptions = {
      host: urlParts.host || this.config.host,
      port: urlParts.port || this.config.port,
      path: urlParts.path || undefined,
      method,
      headers,
    };

    const req = https
      .request(requestOptions, (res) => {
        let body = '';
        let rateLimit: RateLimit | null = null;
        const add = (chunk: Buffer | string): void => {
          body += chunk.toString();
        };

        const passData = (): void => {
          let err: DiscogsError | null = null;
          const status = res.statusCode || 0;
          if (status > 399) {
            const match = body.match(/^\{"message": "(.+)"\}/i);
            err = new DiscogsError(
              status,
              match && match[1] ? match[1] : undefined
            );
          }
          callback(err, body, rateLimit);
        };

        // Find and add rate limiting when present
        const limitHeader = res.headers['x-discogs-ratelimit'];
        if (limitHeader) {
          rateLimit = {
            limit: parseInt(String(limitHeader), 10),
            used: parseInt(String(res.headers['x-discogs-ratelimit-used']), 10),
            remaining: parseInt(
              String(res.headers['x-discogs-ratelimit-remaining']),
              10
            ),
          };
        }

        switch (res.headers['content-encoding']) {
          case 'gzip': {
            const gunzip = zlib
              .createGunzip()
              .on('data', add)
              .on('end', passData);
            res.pipe(gunzip);
            break;
          }
          case 'deflate': {
            const inflate = zlib
              .createInflate()
              .on('data', add)
              .on('end', passData);
            res.pipe(inflate);
            break;
          }
          default:
            res.setEncoding(encoding);
            res.on('data', add).on('end', passData);
        }
      })
      .on('error', (err) => {
        callback(err);
      });

    if (data) {
      req.write(data);
    }

    req.end();
    return this;
  }

  /**
   * Send a request and parse a text response to JSON.
   */
  private _request<T = unknown>(
    options: RequestOptions,
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    const doRequest = (cb: DiscogsCallback<T>): void => {
      this._rawRequest(options, (err, data, rateLimit) => {
        let parsed: unknown = data;
        if (
          data &&
          options.json &&
          typeof data === 'string' &&
          data.indexOf('<!') !== 0
        ) {
          parsed = JSON.parse(data);
        }
        cb(err, parsed as T, rateLimit);
      });
    };

    const prepareRequest = (cb: DiscogsCallback<T>): void => {
      // Check whether authentication is required
      if (!options.authLevel || this.authenticated(options.authLevel)) {
        if (options.queue) {
          queue.add((err) => {
            if (!err) {
              doRequest(cb);
            } else {
              cb(err);
            }
          });
        } else {
          doRequest(cb);
        }
      } else {
        cb(new AuthError());
      }
    };

    // By default, queue requests
    if (!('queue' in options)) {
      options.queue = true;
    }
    // By default, expect responses to be JSON
    if (!('json' in options)) {
      options.json = true;
    }

    if (typeof callback === 'function') {
      prepareRequest(callback);
      return this;
    }
    // No callback provided? Return a Promise
    return new Promise<T>((resolve, reject) => {
      prepareRequest((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data as T);
        }
      });
    });
  }

  /**
   * Perform a GET request against the Discogs API.
   */
  get<T = unknown>(options: RequestOptions | string, callback: DiscogsCallback<T>): this;
  get<T = unknown>(options: RequestOptions | string): Promise<T>;
  get<T = unknown>(
    options: RequestOptions | string,
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    const opts: RequestOptions =
      typeof options === 'string' ? { url: options } : options;
    return this._request<T>(opts, callback);
  }

  /**
   * Perform a POST request against the Discogs API.
   */
  post<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null,
    callback: DiscogsCallback<T>
  ): this;
  post<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null
  ): Promise<T>;
  post<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null,
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    const opts: RequestOptions =
      typeof options === 'string' ? { url: options } : options;
    return this._request<T>({ ...opts, method: 'POST', data }, callback);
  }

  /**
   * Perform a PUT request against the Discogs API.
   */
  put<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null,
    callback: DiscogsCallback<T>
  ): this;
  put<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null
  ): Promise<T>;
  put<T = unknown>(
    options: RequestOptions | string,
    data: Record<string, unknown> | null,
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    const opts: RequestOptions =
      typeof options === 'string' ? { url: options } : options;
    return this._request<T>({ ...opts, method: 'PUT', data }, callback);
  }

  /**
   * Perform a DELETE request against the Discogs API.
   */
  delete<T = unknown>(options: RequestOptions | string, callback: DiscogsCallback<T>): this;
  delete<T = unknown>(options: RequestOptions | string): Promise<T>;
  delete<T = unknown>(
    options: RequestOptions | string,
    callback?: DiscogsCallback<T>
  ): this | Promise<T> {
    const opts: RequestOptions =
      typeof options === 'string' ? { url: options } : options;
    return this._request<T>({ ...opts, method: 'DELETE' }, callback);
  }

  /**
   * Get an instance of the Discogs OAuth class.
   */
  oauth(): DiscogsOAuth {
    return new DiscogsOAuth(this.auth);
  }

  /**
   * Expose the database functions, bound to this client.
   */
  database(): ReturnType<typeof database> {
    return database(this);
  }

  /**
   * Expose the marketplace functions, bound to this client.
   */
  marketplace(): ReturnType<typeof marketplace> {
    return marketplace(this);
  }

  /**
   * Expose the user functions, bound to this client.
   */
  user(): ReturnType<typeof user> {
    return user(this);
  }

  /**
   * Expose the inventory export functions, bound to this client.
   */
  inventoryExport(): ReturnType<typeof inventoryExport> {
    return inventoryExport(this);
  }

  /**
   * Expose the inventory upload functions, bound to this client.
   */
  inventoryUpload(): ReturnType<typeof inventoryUpload> {
    return inventoryUpload(this);
  }
}
