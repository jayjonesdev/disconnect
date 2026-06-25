/**
 * Shared interfaces and type aliases used across the library.
 */
export type AuthMethod = 'discogs' | 'oauth';
export interface Auth {
    method: AuthMethod;
    level: number;
    userToken?: string;
    consumerKey?: string;
    consumerSecret?: string;
    token?: string;
    tokenSecret?: string;
    authorizeUrl?: string;
}
export interface RateLimit {
    limit: number;
    used: number;
    remaining: number;
}
export type DiscogsCallback<T = unknown> = (err: Error | null, data?: T, rateLimit?: RateLimit | null) => void;
export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: Record<string, unknown> | null;
    authLevel?: number;
    queue?: boolean;
    json?: boolean;
    encoding?: BufferEncoding;
}
export interface ClientConfig {
    host: string;
    port: number;
    userAgent: string;
    apiVersion: string;
    outputFormat: 'discogs' | 'plaintext' | 'html';
    requestLimit: number;
    requestLimitAuth: number;
    requestLimitInterval: number;
}
export interface QueueConfig {
    maxStack: number;
    maxCalls: number;
    interval: number;
}
export interface PaginationParams {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_order?: 'asc' | 'desc';
    [key: string]: unknown;
}
/**
 * Currency abbreviations accepted by the Discogs marketplace pricing endpoints.
 */
export type CurrencyAbbr = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'MXN' | 'BRL' | 'NZD' | 'SEK' | 'ZAR';
/**
 * Response of GET /releases/{id}/rating
 */
export interface CommunityRatingResponse {
    release_id: number;
    rating: {
        count: number;
        average: number;
    };
}
/**
 * Response of GET /releases/{id}/stats
 */
export interface ReleaseStatsResponse {
    num_have: number;
    num_want: number;
}
/**
 * Response of GET /users/{username}/collection/value
 */
export interface CollectionValueResponse {
    minimum: string;
    median: string;
    maximum: string;
}
/**
 * Body accepted by POST /users/{username} (edit profile)
 */
export interface EditProfileData {
    name?: string;
    home_page?: string;
    location?: string;
    profile?: string;
    curr_abbr?: CurrencyAbbr;
}
/**
 * Optional filter params for GET /masters/{id}/versions
 */
export interface MasterVersionsParams extends PaginationParams {
    format?: string;
    label?: string;
    released?: string;
    country?: string;
}
/**
 * Search params for GET /database/search
 * @see https://www.discogs.com/developers/#page:database,header:database-search
 */
export interface SearchParams {
    q?: string;
    query?: string;
    type?: 'release' | 'master' | 'artist' | 'label';
    title?: string;
    release_title?: string;
    credit?: string;
    artist?: string;
    anv?: string;
    label?: string;
    genre?: string;
    style?: string;
    country?: string;
    year?: string | number;
    format?: string;
    catno?: string;
    barcode?: string;
    track?: string;
    submitter?: string;
    contributor?: string;
    [key: string]: unknown;
}
//# sourceMappingURL=types.d.ts.map