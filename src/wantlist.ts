import { util } from './util.js';
import type { DiscogsClient } from './client.js';
import type { DiscogsCallback, PaginationParams } from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function wantlist(client: DiscogsClient) {
  const wantlist = {
    /**
     * Get the list of wantlisted releases for the given user name.
     */
    getReleases<T = unknown>(
      username: string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/users/' + util.escape(username) + '/wants';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Add a release to the user's wantlist.
     */
    addRelease<T = unknown>(
      username: string,
      release: number | string,
      data?: Record<string, unknown> | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let body: Record<string, unknown> | null =
        data && typeof data === 'object' ? data : null;
      if (typeof data === 'function') {
        callback = data;
        body = null;
      }
      return client.put(
        { url: '/users/' + util.escape(username) + '/wants/' + release, authLevel: 2 },
        body,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit the notes or rating on a release in the user's wantlist.
     */
    editNotes<T = unknown>(
      username: string,
      release: number | string,
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.put(
        { url: '/users/' + util.escape(username) + '/wants/' + release, authLevel: 2 },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Remove a release from the user's wantlist.
     */
    removeRelease<T = unknown>(
      username: string,
      release: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.delete(
        { url: '/users/' + util.escape(username) + '/wants/' + release, authLevel: 2 },
        callback as DiscogsCallback<T>
      );
    },
  };

  return wantlist;
}
