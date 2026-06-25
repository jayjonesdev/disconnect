import type { DiscogsClient } from './client.js';
import type { CollectionValueResponse, DiscogsCallback, PaginationParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function collection(client: DiscogsClient): {
    /**
     * Get a list of all collection folders for the given user.
     */
    getFolders<T = unknown>(username: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get metadata for a specified collection folder.
     */
    getFolder<T = unknown>(username: string, folder: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Add a new collection folder.
     */
    addFolder<T = unknown>(username: string, name: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Change a folder name. The name of folder 0 and 1 can't be changed.
     */
    setFolderName<T = unknown>(username: string, folder: number | string, name: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Delete a folder. A folder must be empty before it can be deleted.
     */
    deleteFolder<T = unknown>(username: string, folder: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the releases in a user's collection folder (0 = public folder).
     */
    getReleases<T = unknown>(username: string, folder: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the instances of a release in a user's collection.
     */
    getReleaseInstances<T = unknown>(username: string, release: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Add a release instance to the (optionally) given collection folder.
     */
    addRelease<T = unknown>(username: string, folder: number | string | undefined, release: number | string | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit a release instance in the given collection folder.
     */
    editRelease<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Delete a release instance from the given folder.
     */
    removeRelease<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the list of custom fields defined in a user's collection.
     */
    getCustomFields<T = unknown>(username: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit the value of a custom field for a release instance.
     */
    editInstanceField<T = unknown>(username: string, folder: number | string, release: number | string, instance: number | string, fieldId: number | string, value: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the minimum, median, and maximum value of a user's collection.
     */
    getValue(username: string, callback?: DiscogsCallback<CollectionValueResponse>): Result<CollectionValueResponse>;
};
export {};
//# sourceMappingURL=collection.d.ts.map