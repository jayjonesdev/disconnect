import { util } from './util.js';
import { AuthError } from './error.js';
import type { DiscogsClient } from './client.js';
import type {
  CollectionValueResponse,
  DiscogsCallback,
  PaginationParams,
} from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function collection(client: DiscogsClient) {
  const collection = {
    /**
     * Get a list of all collection folders for the given user.
     */
    getFolders<T = unknown>(
      username: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        '/users/' + util.escape(username) + '/collection/folders',
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get metadata for a specified collection folder.
     */
    getFolder<T = unknown>(
      username: string,
      folder: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      if (client.authenticated(2) || parseInt(String(folder), 10) === 0) {
        return client.get(
          '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder,
          callback as DiscogsCallback<T>
        );
      }
      if (typeof callback === 'function') {
        callback(new AuthError());
        return client;
      }
      return Promise.reject(new AuthError());
    },

    /**
     * Add a new collection folder.
     */
    addFolder<T = unknown>(
      username: string,
      name: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        { url: '/users/' + util.escape(username) + '/collection/folders', authLevel: 2 },
        { name },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Change a folder name. The name of folder 0 and 1 can't be changed.
     */
    setFolderName<T = unknown>(
      username: string,
      folder: number | string,
      name: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder,
          authLevel: 2,
        },
        { name },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Delete a folder. A folder must be empty before it can be deleted.
     */
    deleteFolder<T = unknown>(
      username: string,
      folder: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.delete(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder,
          authLevel: 2,
        },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the releases in a user's collection folder (0 = public folder).
     */
    getReleases<T = unknown>(
      username: string,
      folder: number | string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      if (client.authenticated(2) || parseInt(String(folder), 10) === 0) {
        let path =
          '/users/' +
          util.escape(username) +
          '/collection/folders/' +
          folder +
          '/releases';
        if (typeof params === 'function') {
          callback = params;
        } else {
          path = util.addParams(path, params);
        }
        return client.get(path, callback as DiscogsCallback<T>);
      }
      if (typeof params === 'function') {
        callback = params;
      }
      if (typeof callback === 'function') {
        callback(new AuthError());
        return client;
      }
      return Promise.reject(new AuthError());
    },

    /**
     * Get the instances of a release in a user's collection.
     */
    getReleaseInstances<T = unknown>(
      username: string,
      release: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        '/users/' +
          util.escape(username) +
          '/collection/releases/' +
          release,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Add a release instance to the (optionally) given collection folder.
     */
    addRelease<T = unknown>(
      username: string,
      folder: number | string | undefined,
      release: number | string | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      if (typeof release === 'function') {
        callback = release;
        release = folder as number | string;
        folder = 1;
      }
      return client.post(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            (folder || 1) +
            '/releases/' +
            release,
          authLevel: 2,
        },
        null,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit a release instance in the given collection folder.
     */
    editRelease<T = unknown>(
      username: string,
      folder: number | string,
      release: number | string,
      instance: number | string,
      data: Record<string, unknown>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder +
            '/releases/' +
            release +
            '/instances/' +
            instance,
          authLevel: 2,
        },
        data,
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Delete a release instance from the given folder.
     */
    removeRelease<T = unknown>(
      username: string,
      folder: number | string,
      release: number | string,
      instance: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.delete(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder +
            '/releases/' +
            release +
            '/instances/' +
            instance,
          authLevel: 2,
        },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the list of custom fields defined in a user's collection.
     */
    getCustomFields<T = unknown>(
      username: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        {
          url: '/users/' + util.escape(username) + '/collection/fields',
          authLevel: 2,
        },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Edit the value of a custom field for a release instance.
     */
    editInstanceField<T = unknown>(
      username: string,
      folder: number | string,
      release: number | string,
      instance: number | string,
      fieldId: number | string,
      value: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.post(
        {
          url:
            '/users/' +
            util.escape(username) +
            '/collection/folders/' +
            folder +
            '/releases/' +
            release +
            '/instances/' +
            instance +
            '/fields/' +
            fieldId,
          authLevel: 2,
        },
        { value },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the minimum, median, and maximum value of a user's collection.
     */
    getValue(
      username: string,
      callback?: DiscogsCallback<CollectionValueResponse>
    ): Result<CollectionValueResponse> {
      return client.get(
        {
          url: '/users/' + util.escape(username) + '/collection/value',
          authLevel: 2,
        },
        callback as DiscogsCallback<CollectionValueResponse>
      );
    },
  };

  return collection;
}
