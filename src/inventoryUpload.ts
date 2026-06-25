import type { DiscogsClient } from './client.js';
import type { DiscogsCallback } from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

/**
 * Inventory upload namespace — bulk inventory management via CSV upload.
 * @see https://www.discogs.com/developers/#page:inventory-upload
 */
export function inventoryUpload(client: DiscogsClient) {
  const inventoryUpload = {
    /**
     * Upload a CSV of items to add to the inventory.
     */
    add<T = unknown>(
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/inventory/upload/add', authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Upload a CSV of items to update in the inventory.
     */
    change<T = unknown>(
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/inventory/upload/change', authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Upload a CSV of items to remove from the inventory.
     */
    delete<T = unknown>(
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/inventory/upload/delete', authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get a list of the authenticated user's recent uploads.
     */
    getUploads<T = unknown>(callback?: DiscogsCallback<T>): Result<T> {
      return client.get(
        { url: '/inventory/upload', authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get details about a single upload.
     */
    getUpload<T = unknown>(
      id: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        { url: '/inventory/upload/' + id, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },
  };

  return inventoryUpload;
}
