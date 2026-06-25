import type { DiscogsClient } from './client.js';
import type { DiscogsCallback } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
/**
 * Inventory export namespace.
 * @see https://www.discogs.com/developers/#page:inventory-export
 */
export declare function inventoryExport(client: DiscogsClient): {
    /**
     * Request an export of the authenticated user's inventory as a CSV.
     */
    export<T = unknown>(callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get a list of the authenticated user's recent exports.
     */
    getExports<T = unknown>(callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get details about a single export.
     */
    getExport<T = unknown>(id: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Download the CSV for a finished export.
     */
    download<T = unknown>(id: number | string, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=inventoryExport.d.ts.map