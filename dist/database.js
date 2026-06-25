"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = database;
const util_js_1 = require("./util.js");
function database(client) {
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
        getArtist(artist, callback) {
            return client.get('/artists/' + artist, callback);
        },
        /**
         * Get artist release data.
         */
        getArtistReleases(artist, params, callback) {
            let path = '/artists/' + artist + '/releases';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Get release data, optionally in a specific marketplace currency.
         */
        getRelease(release, currAbbr, callback) {
            if (typeof currAbbr === 'function') {
                callback = currAbbr;
                currAbbr = undefined;
            }
            const path = util_js_1.util.addParams('/releases/' + release, currAbbr ? { curr_abbr: currAbbr } : undefined);
            return client.get(path, callback);
        },
        /**
         * Get the release rating for the given user.
         */
        getReleaseRating(release, user, callback) {
            return client.get('/releases/' + release + '/rating/' + util_js_1.util.escape(user), callback);
        },
        /**
         * Set (or remove) a release rating for the given logged in user.
         */
        setReleaseRating(release, user, rating, callback) {
            const url = '/releases/' + release + '/rating/' + util_js_1.util.escape(user);
            if (!rating) {
                return client.delete({ url, authLevel: 2 }, callback);
            }
            return client.put({ url, authLevel: 2 }, { rating: rating > 5 ? 5 : rating }, callback);
        },
        /**
         * Get the community average rating and count for a release.
         */
        getCommunityReleaseRating(release, callback) {
            return client.get('/releases/' + release + '/rating', callback);
        },
        /**
         * Get the "have" and "want" counts for a release.
         */
        getReleaseStats(release, callback) {
            return client.get('/releases/' + release + '/stats', callback);
        },
        /**
         * Get master release data.
         */
        getMaster(master, callback) {
            return client.get('/masters/' + master, callback);
        },
        /**
         * Get the release versions contained in the given master release.
         */
        getMasterVersions(master, params, callback) {
            let path = '/masters/' + master + '/versions';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Get label data.
         */
        getLabel(label, callback) {
            return client.get('/labels/' + label, callback);
        },
        /**
         * Get label release data.
         */
        getLabelReleases(label, params, callback) {
            let path = '/labels/' + label + '/releases';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Get an image by its full url.
         */
        getImage(url, callback) {
            return client.get({ url, encoding: 'binary', queue: false, json: false }, callback);
        },
        /**
         * Search the database.
         * @see https://www.discogs.com/developers/#page:database,header:database-search
         */
        search(query, params, callback) {
            let obj = {};
            if (typeof params === 'function') {
                callback = params;
            }
            if (params && typeof params === 'object') {
                obj = params;
            }
            else if (typeof query === 'object') {
                obj = query;
            }
            if (typeof query === 'string') {
                obj.q = query;
            }
            return client.get({ url: util_js_1.util.addParams('/database/search', obj), authLevel: 1 }, callback);
        },
    };
    return database;
}
//# sourceMappingURL=database.js.map