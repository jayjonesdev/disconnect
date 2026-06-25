import { util } from './util.js';
import { user } from './user.js';
import type { DiscogsClient } from './client.js';
import type {
  CurrencyAbbr,
  DiscogsCallback,
  PaginationParams,
} from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function marketplace(client: DiscogsClient) {
  const marketplace = {
    /**
     * Get the inventory for the given user (shared with the user namespace).
     */
    getInventory: user(client).getInventory,

    /**
     * Get a marketplace listing.
     */
    getListing<T = unknown>(
      listing: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        '/marketplace/listings/' + listing,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Create a marketplace listing.
     */
    addListing<T = unknown>(
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/marketplace/listings', authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit a marketplace listing.
     */
    editListing<T = unknown>(
      listing: number | string,
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/marketplace/listings/' + listing, authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Delete a marketplace listing.
     */
    deleteListing<T = unknown>(
      listing: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.delete(
        { url: '/marketplace/listings/' + listing, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get a list of the authenticated user's orders.
     */
    getOrders<T = unknown>(
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/marketplace/orders';
      if (typeof params === 'function') {
        callback = params;
      } else if (params && typeof params === 'object') {
        path = util.addParams(path, params);
      }
      return client.get(
        { url: path, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get details of a marketplace order.
     */
    getOrder<T = unknown>(
      order: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        { url: '/marketplace/orders/' + order, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit a marketplace order.
     */
    editOrder<T = unknown>(
      order: string,
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/marketplace/orders/' + order, authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * List the messages for the given order ID.
     */
    getOrderMessages<T = unknown>(
      order: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/marketplace/orders/' + order + '/messages';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(
        { url: path, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Add a message to the given order ID.
     */
    addOrderMessage<T = unknown>(
      order: string,
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/marketplace/orders/' + order + '/messages', authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the marketplace fee for a given price.
     */
    getFee<T = unknown>(
      price: number | string,
      currency?: string | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path =
        '/marketplace/fee/' +
        (typeof price === 'number' ? price.toFixed(2) : price);
      if (typeof currency === 'function') {
        callback = currency;
      } else if (currency) {
        path += '/' + currency;
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get price suggestions for a given release ID in the user's selling currency.
     */
    getPriceSuggestions<T = unknown>(
      release: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        { url: '/marketplace/price_suggestions/' + release, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get community marketplace statistics for a release (lowest price, number
     * for sale, etc.). Does not require authentication.
     */
    getReleaseStatistics<T = unknown>(
      release: number | string,
      currAbbr?: CurrencyAbbr | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      if (typeof currAbbr === 'function') {
        callback = currAbbr;
        currAbbr = undefined;
      }
      const path = util.addParams(
        '/marketplace/release_statistics/' + release,
        currAbbr ? { curr_abbr: currAbbr } : undefined
      );
      return client.get(path, callback as DiscogsCallback<T>);
    },
  };

  return marketplace;
}
