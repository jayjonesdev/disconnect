"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscogsOAuth = void 0;
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const crypto_1 = require("crypto");
const util_js_1 = require("./util.js");
const client_js_1 = require("./client.js");
const defaultConfig = {
    requestTokenUrl: 'https://api.discogs.com/oauth/request_token',
    accessTokenUrl: 'https://api.discogs.com/oauth/access_token',
    authorizeUrl: 'https://www.discogs.com/oauth/authorize',
    version: '1.0',
    signatureMethod: 'PLAINTEXT', // Or HMAC-SHA1
};
/**
 * RFC 3986 compliant percent-encoding (encodes !*'() too).
 */
function percentEncode(str) {
    return encodeURIComponent(str).replace(/[!*'()]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}
class DiscogsOAuth {
    constructor(auth) {
        this.config = { ...defaultConfig };
        this.auth = { method: 'oauth', level: 0 };
        if (auth && typeof auth === 'object' && auth.method === 'oauth') {
            util_js_1.util.merge(this.auth, auth);
        }
    }
    /**
     * Override the default configuration.
     */
    setConfig(customConfig) {
        Object.assign(this.config, customConfig);
        return this;
    }
    /**
     * Get an OAuth request token from Discogs.
     */
    getRequestToken(consumerKey, consumerSecret, callbackUrl, callback) {
        const auth = this.auth;
        const config = this.config;
        auth.consumerKey = consumerKey;
        auth.consumerSecret = consumerSecret;
        new client_js_1.DiscogsClient(auth).get({
            url: config.requestTokenUrl +
                '?oauth_callback=' +
                percentEncode(callbackUrl),
            queue: false,
            json: false,
        }, (err, data) => {
            if (!err && data) {
                const parsed = new URLSearchParams(data);
                auth.token = parsed.get('oauth_token') ?? undefined;
                auth.tokenSecret = parsed.get('oauth_token_secret') ?? undefined;
                auth.authorizeUrl =
                    config.authorizeUrl + '?oauth_token=' + parsed.get('oauth_token');
            }
            if (typeof callback === 'function') {
                callback(err, auth);
            }
        });
        return this;
    }
    /**
     * Get an OAuth access token from Discogs.
     *
     * The Discogs API documents this as a POST request (the original library used
     * GET); POST is the correct and future-safe approach.
     */
    getAccessToken(verifier, callback) {
        const auth = this.auth;
        new client_js_1.DiscogsClient(auth).post({
            url: this.config.accessTokenUrl +
                '?oauth_verifier=' +
                percentEncode(verifier),
            queue: false,
            json: false,
        }, null, (err, data) => {
            if (!err && data) {
                const parsed = new URLSearchParams(data);
                auth.token = parsed.get('oauth_token') ?? undefined;
                auth.tokenSecret = parsed.get('oauth_token_secret') ?? undefined;
                auth.level = 2;
                delete auth.authorizeUrl;
            }
            if (typeof callback === 'function') {
                callback(err, auth);
            }
        });
        return this;
    }
    /**
     * Return the auth object.
     */
    export() {
        return this.auth;
    }
    /**
     * Build the OAuth HTTP Authorization header content.
     */
    toHeader(requestMethod, requestUrl) {
        const options = {
            consumer: {
                key: this.auth.consumerKey ?? '',
                secret: this.auth.consumerSecret ?? '',
            },
            signature_method: this.config.signatureMethod,
            version: this.config.version,
        };
        // Only wire in an HMAC hash function for HMAC-SHA1. For PLAINTEXT,
        // oauth-1.0a uses the signing key as the signature itself — passing a
        // hash_function here would override that and produce an HMAC signature
        // while still advertising signature_method=PLAINTEXT, which Discogs
        // rejects with a 401.
        if (this.config.signatureMethod === 'HMAC-SHA1') {
            options.hash_function = (baseString, key) => (0, crypto_1.createHmac)('sha1', key).update(baseString).digest('base64');
        }
        const oAuth = new oauth_1_0a_1.default(options);
        // Only pass a token when we actually have one. During the request-token
        // step there is no token yet; sending an empty `oauth_token` makes Discogs
        // reject the request with a 401.
        const token = this.auth.token
            ? { key: this.auth.token, secret: this.auth.tokenSecret ?? '' }
            : undefined;
        const authObj = oAuth.authorize({ method: requestMethod, url: requestUrl }, token);
        return oAuth.toHeader(authObj).Authorization;
    }
}
exports.DiscogsOAuth = DiscogsOAuth;
//# sourceMappingURL=oauth.js.map