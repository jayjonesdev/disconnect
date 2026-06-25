"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscogsClient = void 0;
const https = __importStar(require("https"));
const zlib = __importStar(require("zlib"));
const url = __importStar(require("url"));
const error_js_1 = require("./error.js");
const util_js_1 = require("./util.js");
const queue_js_1 = require("./queue.js");
const oauth_js_1 = require("./oauth.js");
const database_js_1 = require("./database.js");
const marketplace_js_1 = require("./marketplace.js");
const user_js_1 = require("./user.js");
const inventoryExport_js_1 = require("./inventoryExport.js");
const inventoryUpload_js_1 = require("./inventoryUpload.js");
// Read package metadata at runtime (resolves to the package root from dist/).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
/**
 * Default configuration.
 */
const defaultConfig = {
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
const queue = new queue_js_1.Queue({
    maxCalls: defaultConfig.requestLimit,
    interval: defaultConfig.requestLimitInterval,
});
class DiscogsClient {
    /**
     * @param userAgent - The user agent string, or an auth object as first arg
     * @param auth - Optional authorization data object
     */
    constructor(userAgent, auth) {
        // Start from a clone of the default configuration
        this.config = util_js_1.util.merge({}, defaultConfig);
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
                }
                else if (auth.consumerKey && auth.consumerSecret) {
                    auth.level = 1;
                }
                else {
                    auth.level = 0;
                }
            }
            this.auth = util_js_1.util.merge({}, auth);
        }
        else {
            // Unauthenticated clients use the lower shared request limit
            queue.setConfig({ maxCalls: this.config.requestLimit });
        }
    }
    /**
     * Override the default configuration.
     */
    setConfig(customConfig) {
        util_js_1.util.merge(this.config, customConfig);
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
    authenticated(level = 0) {
        return (typeof this.auth !== 'undefined' &&
            this.auth.level > 0 &&
            this.auth.level >= level);
    }
    getIdentity(callback) {
        return this.get({ url: '/oauth/identity', authLevel: 2 }, callback);
    }
    about(callback) {
        const clientInfo = {
            version: pkg.version,
            userAgent: this.config.userAgent,
            authMethod: this.auth ? this.auth.method : 'none',
            authLevel: this.auth ? this.auth.level : 0,
        };
        if (typeof callback === 'function') {
            return this.get('', (err, data) => {
                const d = data;
                if (d) {
                    d.disconnect = clientInfo;
                }
                callback(err, d);
            });
        }
        return this.get('').then((data) => {
            if (data) {
                data.disconnect = clientInfo;
            }
            return data;
        });
    }
    /**
     * Send a raw request.
     */
    _rawRequest(options, callback) {
        let data = options.data || null;
        const method = options.method || 'GET';
        const urlParts = url.parse(options.url);
        const encoding = options.encoding || 'utf8';
        // Build request headers
        const headers = {
            'User-Agent': this.config.userAgent,
            Accept: 'application/vnd.discogs.' +
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
            headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        // Add Authorization header when authenticated (or authenticating)
        if (this.auth && (this.auth.consumerKey || this.auth.userToken)) {
            let authHeader = '';
            if (this.auth.method === 'oauth') {
                const fullUrl = urlParts.protocol && urlParts.host
                    ? urlParts.href
                    : 'https://' + this.config.host + (urlParts.path || '');
                authHeader = this.oauth().toHeader(method, fullUrl);
            }
            else if (this.auth.method === 'discogs') {
                authHeader = 'Discogs';
                if (this.auth.userToken) {
                    authHeader += ' token=' + this.auth.userToken;
                }
                else if (this.auth.consumerKey) {
                    authHeader +=
                        ' key=' +
                            this.auth.consumerKey +
                            ', secret=' +
                            this.auth.consumerSecret;
                }
            }
            headers['Authorization'] = authHeader;
        }
        const requestOptions = {
            host: urlParts.host || this.config.host,
            port: urlParts.port || this.config.port,
            path: urlParts.path || undefined,
            method,
            headers,
        };
        const req = https
            .request(requestOptions, (res) => {
            let body = '';
            let rateLimit = null;
            const add = (chunk) => {
                body += chunk.toString();
            };
            const passData = () => {
                let err = null;
                const status = res.statusCode || 0;
                if (status > 399) {
                    const match = body.match(/^\{"message": "(.+)"\}/i);
                    err = new error_js_1.DiscogsError(status, match && match[1] ? match[1] : undefined);
                }
                callback(err, body, rateLimit);
            };
            // Find and add rate limiting when present
            const limitHeader = res.headers['x-discogs-ratelimit'];
            if (limitHeader) {
                rateLimit = {
                    limit: parseInt(String(limitHeader), 10),
                    used: parseInt(String(res.headers['x-discogs-ratelimit-used']), 10),
                    remaining: parseInt(String(res.headers['x-discogs-ratelimit-remaining']), 10),
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
    _request(options, callback) {
        const doRequest = (cb) => {
            this._rawRequest(options, (err, data, rateLimit) => {
                let parsed = data;
                if (data &&
                    options.json &&
                    typeof data === 'string' &&
                    data.indexOf('<!') !== 0) {
                    parsed = JSON.parse(data);
                }
                cb(err, parsed, rateLimit);
            });
        };
        const prepareRequest = (cb) => {
            // Check whether authentication is required
            if (!options.authLevel || this.authenticated(options.authLevel)) {
                if (options.queue) {
                    queue.add((err) => {
                        if (!err) {
                            doRequest(cb);
                        }
                        else {
                            cb(err);
                        }
                    });
                }
                else {
                    doRequest(cb);
                }
            }
            else {
                cb(new error_js_1.AuthError());
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
        return new Promise((resolve, reject) => {
            prepareRequest((err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    get(options, callback) {
        const opts = typeof options === 'string' ? { url: options } : options;
        return this._request(opts, callback);
    }
    post(options, data, callback) {
        const opts = typeof options === 'string' ? { url: options } : options;
        return this._request({ ...opts, method: 'POST', data }, callback);
    }
    put(options, data, callback) {
        const opts = typeof options === 'string' ? { url: options } : options;
        return this._request({ ...opts, method: 'PUT', data }, callback);
    }
    delete(options, callback) {
        const opts = typeof options === 'string' ? { url: options } : options;
        return this._request({ ...opts, method: 'DELETE' }, callback);
    }
    /**
     * Get an instance of the Discogs OAuth class.
     */
    oauth() {
        return new oauth_js_1.DiscogsOAuth(this.auth);
    }
    /**
     * Expose the database functions, bound to this client.
     */
    database() {
        return (0, database_js_1.database)(this);
    }
    /**
     * Expose the marketplace functions, bound to this client.
     */
    marketplace() {
        return (0, marketplace_js_1.marketplace)(this);
    }
    /**
     * Expose the user functions, bound to this client.
     */
    user() {
        return (0, user_js_1.user)(this);
    }
    /**
     * Expose the inventory export functions, bound to this client.
     */
    inventoryExport() {
        return (0, inventoryExport_js_1.inventoryExport)(this);
    }
    /**
     * Expose the inventory upload functions, bound to this client.
     */
    inventoryUpload() {
        return (0, inventoryUpload_js_1.inventoryUpload)(this);
    }
}
exports.DiscogsClient = DiscogsClient;
//# sourceMappingURL=client.js.map