"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = user;
const util_js_1 = require("./util.js");
const collection_js_1 = require("./collection.js");
const wantlist_js_1 = require("./wantlist.js");
const list_js_1 = require("./list.js");
function user(client) {
    const user = {
        /**
         * Get the profile for the given user.
         */
        getProfile(username, callback) {
            return client.get('/users/' + util_js_1.util.escape(username), callback);
        },
        /**
         * Edit the profile of the authenticated user.
         */
        editProfile(username, data, callback) {
            return client.post({ url: '/users/' + util_js_1.util.escape(username), authLevel: 2 }, data, callback);
        },
        /**
         * Get the inventory for the given user.
         */
        getInventory(username, params, callback) {
            let path = '/users/' + util_js_1.util.escape(username) + '/inventory';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Test authentication by getting the identity resource for the user.
         */
        getIdentity(callback) {
            return client.getIdentity(callback);
        },
        /**
         * Expose the collection functions, bound to the client.
         */
        collection() {
            return (0, collection_js_1.collection)(client);
        },
        /**
         * Expose the wantlist functions, bound to the client.
         */
        wantlist() {
            return (0, wantlist_js_1.wantlist)(client);
        },
        /**
         * Expose the list functions, bound to the client.
         */
        list() {
            return (0, list_js_1.list)(client);
        },
        /**
         * Get the contributions for the given user.
         */
        getContributions(username, params, callback) {
            let path = '/users/' + util_js_1.util.escape(username) + '/contributions';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Get the submissions for the given user.
         */
        getSubmissions(username, params, callback) {
            let path = '/users/' + util_js_1.util.escape(username) + '/submissions';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
        /**
         * Get the lists for the given user.
         */
        getLists(username, params, callback) {
            let path = '/users/' + util_js_1.util.escape(username) + '/lists';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
    };
    return user;
}
//# sourceMappingURL=user.js.map