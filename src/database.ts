import { util } from './util.js';
import type { DiscogsClient } from './client.js';
import type {
  CommunityRatingResponse,
  CurrencyAbbr,
  DiscogsCallback,
  MasterVersionsParams,
  PaginationParams,
  ReleaseStatsResponse,
  SearchParams,
} from './types.js';

type Result<T> = DiscogsClient | Promise<T>;

export function database(client: DiscogsClient) {
  const database = {
    /**
     * Discogs database status constants.
     */
    status: {
      accepted: 'Accepted',
      draft: 'Draft',
      deleted: 'Deleted',
      rejected: 'Rejected',
    },

    /**
     * Get artist data.
     */
    getArtist<T = unknown>(
      artist: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get('/artists/' + artist, callback as DiscogsCallback<T>);
    },

    /**
     * Get artist release data.
     */
    getArtistReleases<T = unknown>(
      artist: number | string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/artists/' + artist + '/releases';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get release data, optionally in a specific marketplace currency.
     */
    getRelease<T = unknown>(
      release: number | string,
      currAbbr?: CurrencyAbbr | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      if (typeof currAbbr === 'function') {
        callback = currAbbr;
        currAbbr = undefined;
      }
      const path = util.addParams(
        '/releases/' + release,
        currAbbr ? { curr_abbr: currAbbr } : undefined
      );
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get the release rating for the given user.
     */
    getReleaseRating<T = unknown>(
      release: number | string,
      user: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        '/releases/' + release + '/rating/' + util.escape(user),
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Set (or remove) a release rating for the given logged in user.
     */
    setReleaseRating<T = unknown>(
      release: number | string,
      user: string,
      rating: number | null,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      const url = '/releases/' + release + '/rating/' + util.escape(user);
      if (!rating) {
        return client.delete({ url, authLevel: 2 }, callback as DiscogsCallback<T>);
      }
      return client.put(
        { url, authLevel: 2 },
        { rating: rating > 5 ? 5 : rating },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Get the community average rating and count for a release.
     */
    getCommunityReleaseRating(
      release: number | string,
      callback?: DiscogsCallback<CommunityRatingResponse>
    ): Result<CommunityRatingResponse> {
      return client.get(
        '/releases/' + release + '/rating',
        callback as DiscogsCallback<CommunityRatingResponse>
      );
    },

    /**
     * Get the "have" and "want" counts for a release.
     */
    getReleaseStats(
      release: number | string,
      callback?: DiscogsCallback<ReleaseStatsResponse>
    ): Result<ReleaseStatsResponse> {
      return client.get(
        '/releases/' + release + '/stats',
        callback as DiscogsCallback<ReleaseStatsResponse>
      );
    },

    /**
     * Get master release data.
     */
    getMaster<T = unknown>(
      master: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get('/masters/' + master, callback as DiscogsCallback<T>);
    },

    /**
     * Get the release versions contained in the given master release.
     */
    getMasterVersions<T = unknown>(
      master: number | string,
      params?: MasterVersionsParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/masters/' + master + '/versions';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get label data.
     */
    getLabel<T = unknown>(
      label: number | string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get('/labels/' + label, callback as DiscogsCallback<T>);
    },

    /**
     * Get label release data.
     */
    getLabelReleases<T = unknown>(
      label: number | string,
      params?: PaginationParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let path = '/labels/' + label + '/releases';
      if (typeof params === 'function') {
        callback = params;
      } else {
        path = util.addParams(path, params);
      }
      return client.get(path, callback as DiscogsCallback<T>);
    },

    /**
     * Get an image by its full url.
     */
    getImage<T = unknown>(
      url: string,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      return client.get(
        { url, encoding: 'binary', queue: false, json: false },
        callback as DiscogsCallback<T>
      );
    },

    /**
     * Search the database.
     * @see https://www.discogs.com/developers/#page:database,header:database-search
     */
    search<T = unknown>(
      query: string | SearchParams,
      params?: SearchParams | DiscogsCallback<T>,
      callback?: DiscogsCallback<T>
    ): Result<T> {
      let obj: SearchParams = {};
      if (typeof params === 'function') {
        callback = params;
      }
      if (params && typeof params === 'object') {
        obj = params;
      } else if (typeof query === 'object') {
        obj = query;
      }
      if (typeof query === 'string') {
        obj.q = query;
      }
      return client.get(
        { url: util.addParams('/database/search', obj), authLevel: 1 },
        callback as DiscogsCallback<T>
      );
    },
  };

  return database;
}
