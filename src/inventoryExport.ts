import type { DiscogsClient } from './client.js';
import type { DiscogsCallback } from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

/**
 * Inventory export namespace.
 * @see https://www.discogs.com/developers/#page:inventory-export
 */
export function inventoryExport(client: DiscogsClient) {
  const inventoryExport = {
    /**
     * Request an export of the authenticated user's inventory as a CSV.
     */
    export<T = unknown>(callback?: DiscogsCallback<T>): Result<T> {
      return client.post(
        { url: '/inventory/export', authLevel: 2 },
        null,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get a list of the authenticated user's recent exports.
     */
    getExports<T = unknown>(callback?: DiscogsCallback<T>): Result<T> {
      return client.get(
        { url: '/inventory/export', authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get details about a single export.
     */
    getExport<T = unknown>(
      id: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        { url: '/inventory/export/' + id, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Download the CSV for a finished export.
     */
    download<T = unknown>(
      id: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        {
          url: '/inventory/export/' + id + '/download',
          authLevel: 2,
          json: false,
          queue: false,
        },
        callback as DiscogsCallback<T>
      );
    },
  };

  return inventoryExport;
}
