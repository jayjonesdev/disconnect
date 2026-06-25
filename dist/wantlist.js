"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wantlist = wantlist;
const util_js_1 = require("./util.js");
function wantlist(client) {
    const wantlist = {
        /**
         * Get the list of wantlisted releases for the given user name.
         */
        getReleases(username, params, callback) {
            let path = '/users/' + util_js_1.util.escape(username) + '/wants';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Add a release to the user's wantlist.
         */
        addRelease(username, release, data, callback) {
            let body = data && typeof data === 'object' ? data : null;
            if (typeof data === 'function') {
                callback = data;
                body = null;
            }
            return client.put({ url: '/users/' + util_js_1.util.escape(username) + '/wants/' + release, authLevel: 2 }, body, callback);
        },
        /**
         * Edit the notes or rating on a release in the user's wantlist.
         */
        editNotes(username, release, data, callback) {
            return client.put({ url: '/users/' + util_js_1.util.escape(username) + '/wants/' + release, authLevel: 2 }, data, callback);
        },
        /**
         * Remove a release from the user's wantlist.
         */
        removeRelease(username, release, callback) {
            return client.delete({ url: '/users/' + util_js_1.util.escape(username) + '/wants/' + release, authLevel: 2 }, callback);
        },
    };
    return wantlist;
}
//# sourceMappingURL=wantlist.js.map