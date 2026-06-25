import { util } from './util.js';
import { collection } from './collection.js';
import { wantlist } from './wantlist.js';
import { list } from './list.js';
import type { DiscogsClient } from './client.js';
import type {
  DiscogsCallback,
  EditProfileData,
  PaginationParams,
} from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function user(client: DiscogsClient) {
  const user = {
    /**
     * Get the profile for the given user.
     */
    getProfile<T = unknown>(
      username: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        '/users/' + util.escape(username),
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit the profile of the authenticated user.
     */
    editProfile<T = unknown>(
      username: string,
      data: EditProfileData,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/users/' + util.escape(username), authLevel: 2 },
        data as Record<string, unknown>,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the inventory for the given user.
     */
    getInventory<T = unknown>(
      username: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/users/' + util.escape(username) + '/inventory';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Test authentication by getting the identity resource for the user.
     */
    getIdentity<T = unknown>(callback?: DiscogsCallback<T>): Result<T> {
      return client.getIdentity(callback as DiscogsCallback<T>);
    },

    /**
     * Expose the collection functions, bound to the client.
     */
    collection() {
      return collection(client);
    },

    /**
     * Expose the wantlist functions, bound to the client.
     */
    wantlist() {
      return wantlist(client);
    },

    /**
     * Expose the list functions, bound to the client.
     */
    list() {
      return list(client);
    },

    /**
     * Get the contributions for the given user.
     */
    getContributions<T = unknown>(
      username: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/users/' + util.escape(username) + '/contributions';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get the submissions for the given user.
     */
    getSubmissions<T = unknown>(
      username: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/users/' + util.escape(username) + '/submissions';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get the lists for the given user.
     */
    getLists<T = unknown>(
      username: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/users/' + util.escape(username) + '/lists';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },
  };

  return user;
}
