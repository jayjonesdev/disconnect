import type { Auth } from './types.js';
interface OAuthConfig {
    requestTokenUrl: string;
    accessTokenUrl: string;
    authorizeUrl: string;
    version: string;
    signatureMethod: 'PLAINTEXT' | 'HMAC-SHA1';
}
type AuthCallback = (err: Error | null, auth: Auth) => void;
export declare class DiscogsOAuth {
    config: OAuthConfig;
    auth: Auth;
    constructor(auth?: Auth);
    /**
     * Override the default configuration.
     */
    setConfig(customConfig: Partial<OAuthConfig>): this;
    /**
     * Get an OAuth request token from Discogs.
     */
    getRequestToken(consumerKey: string, consumerSecret: string, callbackUrl: string, callback?: AuthCallback): this;
    /**
     * Get an OAuth access token from Discogs using the verifier returned after
     * the user authorizes the request token.
     */
    getAccessToken(verifier: string, callback?: AuthCallback): this;
    /**
     * Return the auth object.
     */
    export(): Auth;
    /**
     * Build the OAuth HTTP Authorization header content.
     */
    toHeader(requestMethod: string, requestUrl: string): string;
}
export {};
//# sourceMappingURL=oauth.d.ts.map