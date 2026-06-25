import type { DiscogsClient } from './client.js';
import type { DiscogsCallback, PaginationParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function wantlist(client: DiscogsClient): {
    /**
     * Get the list of wantlisted releases for the given user name.
     */
    getReleases<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Add a release to the user's wantlist.
     */
    addRelease<T = unknown>(username: string, release: number | string, data?: Record<string, unknown> | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit the notes or rating on a release in the user's wantlist.
     */
    editNotes<T = unknown>(username: string, release: number | string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Remove a release from the user's wantlist.
     */
    removeRelease<T = unknown>(username: string, release: number | string, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=wantlist.d.ts.map