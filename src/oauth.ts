import OAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';
import { util } from './util.js';
import { DiscogsClient } from './client.js';
import type { Auth } from './types.js';

interface OAuthConfig {
  requestTokenUrl: string;
  accessTokenUrl: string;
  authorizeUrl: string;
  version: string;
  signatureMethod: 'PLAINTEXT' | 'HMAC-SHA1';
}

const defaultConfig: OAuthConfig = {
  requestTokenUrl: 'https://api.discogs.com/oauth/request_token',
  accessTokenUrl: 'https://api.discogs.com/oauth/access_token',
  authorizeUrl: 'https://www.discogs.com/oauth/authorize',
  version: '1.0',
  signatureMethod: 'PLAINTEXT', // Or HMAC-SHA1
};

type AuthCallback = (err: Error | null, auth: Auth) => void;

/**
 * RFC 3986 compliant percent-encoding (encodes !*'() too).
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!*'()]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

export class DiscogsOAuth {
  config: OAuthConfig;
  auth: Auth;

  constructor(auth?: Auth) {
    this.config = { ...defaultConfig };
    this.auth = { method: 'oauth', level: 0 };
    if (auth && typeof auth === 'object' && auth.method === 'oauth') {
      util.merge(this.auth, auth);
    }
  }

  /**
   * Override the default configuration.
   */
  setConfig(customConfig: Partial<OAuthConfig>): this {
    Object.assign(this.config, customConfig);
    return this;
  }

  /**
   * Get an OAuth request token from Discogs.
   */
  getRequestToken(
    consumerKey: string,
    consumerSecret: string,
    callbackUrl: string,
    callback?: AuthCallback
  ): this {
    const auth = this.auth;
    const config = this.config;
    auth.consumerKey = consumerKey;
    auth.consumerSecret = consumerSecret;
    new DiscogsClient(auth).get(
      {
        url:
          config.requestTokenUrl +
          '?oauth_callback=' +
          percentEncode(callbackUrl),
        queue: false,
        json: false,
      },
      (err, data) => {
        if (!err && data) {
          const parsed = new URLSearchParams(data as string);
          auth.token = parsed.get('oauth_token') ?? undefined;
          auth.tokenSecret = parsed.get('oauth_token_secret') ?? undefined;
          auth.authorizeUrl =
            config.authorizeUrl + '?oauth_token=' + parsed.get('oauth_token');
        }
        if (typeof callback === 'function') {
          callback(err, auth);
        }
      }
    );
    return this;
  }

  /**
   * Get an OAuth access token from Discogs.
   *
   * The Discogs API documents this as a POST request (the original library used
   * GET); POST is the correct and future-safe approach.
   */
  getAccessToken(verifier: string, callback?: AuthCallback): this {
    const auth = this.auth;
    new DiscogsClient(auth).post(
      {
        url:
          this.config.accessTokenUrl +
          '?oauth_verifier=' +
          percentEncode(verifier),
        queue: false,
        json: false,
      },
      null,
      (err, data) => {
        if (!err && data) {
          const parsed = new URLSearchParams(data as string);
          auth.token = parsed.get('oauth_token') ?? undefined;
          auth.tokenSecret = parsed.get('oauth_token_secret') ?? undefined;
          auth.level = 2;
          delete auth.authorizeUrl;
        }
        if (typeof callback === 'function') {
          callback(err, auth);
        }
      }
    );
    return this;
  }

  /**
   * Return the auth object.
   */
  export(): Auth {
    return this.auth;
  }

  /**
   * Build the OAuth HTTP Authorization header content.
   */
  toHeader(requestMethod: string, requestUrl: string): string {
    const oAuth = new OAuth({
      consumer: {
        key: this.auth.consumerKey ?? '',
        secret: this.auth.consumerSecret ?? '',
      },
      signature_method: this.config.signatureMethod,
      version: this.config.version,
      hash_function(baseString: string, key: string): string {
        return createHmac('sha1', key).update(baseString).digest('base64');
      },
    });
    // Only pass a token when we actually have one. During the request-token
    // step there is no token yet; sending an empty `oauth_token` makes Discogs
    // reject the request with a 401.
    const token = this.auth.token
      ? { key: this.auth.token, secret: this.auth.tokenSecret ?? '' }
      : undefined;
    const authObj = oAuth.authorize(
      { method: requestMethod, url: requestUrl },
      token
    );
    return oAuth.toHeader(authObj).Authorization;
  }
}
