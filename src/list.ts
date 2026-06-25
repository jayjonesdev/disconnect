import { util } from './util.js';
import type { DiscogsClient } from './client.js';
import type { DiscogsCallback, PaginationParams } from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function list(client: DiscogsClient) {
  const list = {
    /**
     * Get the items in a list by list ID.
     */
    getItems<T = unknown>(
      listId: number | string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/lists/' + util.escape(String(listId));
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },
  };

  return list;
}
