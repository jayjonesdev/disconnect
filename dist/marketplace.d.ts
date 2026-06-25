import type { DiscogsClient } from './client.js';
import type { CurrencyAbbr, DiscogsCallback, PaginationParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function marketplace(client: DiscogsClient): {
    /**
     * Get the inventory for the given user (shared with the user namespace).
     */
    getInventory: <T = unknown>(username: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>) => DiscogsClient | Promise<T>;
    /**
     * Get a marketplace listing.
     */
    getListing<T = unknown>(listing: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Create a marketplace listing.
     */
    addListing<T = unknown>(data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit a marketplace listing.
     */
    editListing<T = unknown>(listing: number | string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Delete a marketplace listing.
     */
    deleteListing<T = unknown>(listing: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get a list of the authenticated user's orders.
     */
    getOrders<T = unknown>(params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get details of a marketplace order.
     */
    getOrder<T = unknown>(order: string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Edit a marketplace order.
     */
    editOrder<T = unknown>(order: string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * List the messages for the given order ID.
     */
    getOrderMessages<T = unknown>(order: string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Add a message to the given order ID.
     */
    addOrderMessage<T = unknown>(order: string, data: Record<string, unknown>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get the marketplace fee for a given price.
     */
    getFee<T = unknown>(price: number | string, currency?: string | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get price suggestions for a given release ID in the user's selling currency.
     */
    getPriceSuggestions<T = unknown>(release: number | string, callback?: DiscogsCallback<T>): Result<T>;
    /**
     * Get community marketplace statistics for a release (lowest price, number
     * for sale, etc.). Does not require authentication.
     */
    getReleaseStatistics<T = unknown>(release: number | string, currAbbr?: CurrencyAbbr | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=marketplace.d.ts.map