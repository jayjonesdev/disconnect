import type { DiscogsClient } from './client.js';
import type { DiscogsCallback, PaginationParams } from './types.js';
type Result<T> = DiscogsClient | Promise<T>;
export declare function list(client: DiscogsClient): {
    /**
     * Get the items in a list by list ID.
     */
    getItems<T = unknown>(listId: number | string, params?: PaginationParams | DiscogsCallback<T>, callback?: DiscogsCallback<T>): Result<T>;
};
export {};
//# sourceMappingURL=list.d.ts.map