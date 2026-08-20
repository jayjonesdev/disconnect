import type { DiscogsClient } from './client.js';
import type { DiscogsCallback, EditProfileData, PaginationParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function user(client: DiscogsClient): {
    /**
     * Get the profile for the given user.
     */
    getProfile<T = unknown>(username: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit the profile of the authenticated user.
     */
    editProfile<T = unknown>(username: string, data: EditProfileData, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the inventory for the given user.
     */
    getInventory<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Test authentication by getting the identity resource for the user.
     */
    getIdentity<T = unknown>(callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Expose the collection functions, bound to the client.
     */
    collection(): {
        getFolders<T = unknown>(username: string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        getFolder<T = unknown>(username: string, folder: number | string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        addFolder<T = unknown>(username: string, name: string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        setFolderName<T = unknown>(username: string, folder: number | string, name: string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        deleteFolder<T = unknown>(username: string, folder: number | string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        getReleases<T = unknown>(username: string, folder: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        getReleaseInstances<T = unknown>(username: string, release: number | string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        addRelease<T = unknown>(username: string, folder: number | string | undefined, release: number | string | DiscogsCallback<T>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        editRelease<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        removeRelease<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        getCustomFields<T = unknown>(username: string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        editInstanceField<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, fieldId: number | string, value: string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        getValue(username: string, callback?: DiscogsCallback<import("./types.js").CollectionValueResponse>): DiscogsClient | Promise<import("./types.js").CollectionValueResponse>;
    };
    /**
     * Expose the wantlist functions, bound to the client.
     */
    wantlist(): {
        getReleases<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        addRelease<T = unknown>(username: string, release: number | string, data?: Record<string, unknown> | DiscogsCallback<T>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        editNotes<T = unknown>(username: string, release: number | string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
        removeRelease<T = unknown>(username: string, release: number | string, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
    };
    /**
     * Expose the list functions, bound to the client.
     */
    list(): {
        getItems<T = unknown>(listId: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): DiscogsClient | Promise<T>;
    };
    /**
     * Get the contributions for the given user.
     */
    getContributions<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the submissions for the given user.
     */
    getSubmissions<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the lists for the given user.
     */
    getLists<T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=user.d.ts.map