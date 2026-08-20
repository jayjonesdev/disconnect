import type { DiscogsClient } from './client.js';
import type { CommunityRatingResponse, CurrencyAbbr, DiscogsCallback, MasterVersionsParams, PaginationParams, ReleaseStatsResponse, SearchParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function database(client: DiscogsClient): {
    /**
     * Discogs database status constants.
     */
    status: {
        accepted: string;
        draft: string;
        deleted: string;
        rejected: string;
    };
    /**
     * Get artist data.
     */
    getArtist<T = unknown>(artist: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get artist release data.
     */
    getArtistReleases<T = unknown>(artist: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get release data, optionally in a specific marketplace currency.
     */
    getRelease<T = unknown>(release: number | string, currAbbr?: CurrencyAbbr | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the release rating for the given user.
     */
    getReleaseRating<T = unknown>(release: number | string, user: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Set (or remove) a release rating for the given logged in user.
     */
    setReleaseRating<T = unknown>(release: number | string, user: string, rating: number | null, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the community average rating and count for a release.
     */
    getCommunityReleaseRating(release: number | string, callback?: DiscogsCallback<CommunityRatingResponse>): Result<CommunityRatingResponse>;
    /**
     * Get the "have" and "want" counts for a release.
     */
    getReleaseStats(release: number | string, callback?: DiscogsCallback<ReleaseStatsResponse>): Result<ReleaseStatsResponse>;
    /**
     * Get master release data.
     */
    getMaster<T = unknown>(master: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the release versions contained in the given master release.
     */
    getMasterVersions<T = unknown>(master: number | string, params?: MasterVersionsParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get label data.
     */
    getLabel<T = unknown>(label: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get label release data.
     */
    getLabelReleases<T = unknown>(label: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get an image by its full url.
     */
    getImage<T = unknown>(url: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Search the database.
     * @see https://www.discogs.com/developers/#page:database,header:database-search
     */
    search<T = unknown>(query: string | SearchParams, params?: SearchParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=database.d.ts.map