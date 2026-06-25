"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collection = collection;
const util_js_1 = require("./util.js");
const error_js_1 = require("./error.js");
function collection(client) {
    const collection = {
        /**
         * Get a list of all collection folders for the given user.
         */
        getFolders(username, callback) {
            return client.get('/users/' + util_js_1.util.escape(username) + '/collection/folders', callback);
        },
        /**
         * Get metadata for a specified collection folder.
         */
        getFolder(username, folder, callback) {
            if (client.authenticated(2) || parseInt(String(folder), 10) === 0) {
                return client.get('/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder, callback);
            }
            if (typeof callback === 'function') {
                callback(new error_js_1.AuthError());
                return client;
            }
            return Promise.reject(new error_js_1.AuthError());
        },
        /**
         * Add a new collection folder.
         */
        addFolder(username, name, callback) {
            return client.post({ url: '/users/' + util_js_1.util.escape(username) + '/collection/folders', authLevel: 2 }, { name }, callback);
        },
        /**
         * Change a folder name. The name of folder 0 and 1 can't be changed.
         */
        setFolderName(username, folder, name, callback) {
            return client.post({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder,
                authLevel: 2,
            }, { name }, callback);
        },
        /**
         * Delete a folder. A folder must be empty before it can be deleted.
         */
        deleteFolder(username, folder, callback) {
            return client.delete({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder,
                authLevel: 2,
            }, callback);
        },
        /**
         * Get the releases in a user's collection folder (0 = public folder).
         */
        getReleases(username, folder, params, callback) {
            if (client.authenticated(2) || parseInt(String(folder), 10) === 0) {
                let path = '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder +
                    '/releases';
                if (typeof params === 'function') {
                    callback = params;
                }
                else {
                    path = util_js_1.util.addParams(path, params);
                }
                return client.get(path, callback);
            }
            if (typeof params === 'function') {
                callback = params;
            }
            if (typeof callback === 'function') {
                callback(new error_js_1.AuthError());
                return client;
            }
            return Promise.reject(new error_js_1.AuthError());
        },
        /**
         * Get the instances of a release in a user's collection.
         */
        getReleaseInstances(username, release, callback) {
            return client.get('/users/' +
                util_js_1.util.escape(username) +
                '/collection/releases/' +
                release, callback);
        },
        /**
         * Add a release instance to the (optionally) given collection folder.
         */
        addRelease(username, folder, release, callback) {
            if (typeof release === 'function') {
                callback = release;
                release = folder;
                folder = 1;
            }
            return client.post({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    (folder || 1) +
                    '/releases/' +
                    release,
                authLevel: 2,
            }, null, callback);
        },
        /**
         * Edit a release instance in the given collection folder.
         */
        editRelease(username, folder, release, instance, data, callback) {
            return client.post({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder +
                    '/releases/' +
                    release +
                    '/instances/' +
                    instance,
                authLevel: 2,
            }, data, callback);
        },
        /**
         * Delete a release instance from the given folder.
         */
        removeRelease(username, folder, release, instance, callback) {
            return client.delete({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder +
                    '/releases/' +
                    release +
                    '/instances/' +
                    instance,
                authLevel: 2,
            }, callback);
        },
        /**
         * Get the list of custom fields defined in a user's collection.
         */
        getCustomFields(username, callback) {
            return client.get({
                url: '/users/' + util_js_1.util.escape(username) + '/collection/fields',
                authLevel: 2,
            }, callback);
        },
        /**
         * Edit the value of a custom field for a release instance.
         */
        editInstanceField(username, folder, release, instance, fieldId, value, callback) {
            return client.post({
                url: '/users/' +
                    util_js_1.util.escape(username) +
                    '/collection/folders/' +
                    folder +
                    '/releases/' +
                    release +
                    '/instances/' +
                    instance +
                    '/fields/' +
                    fieldId,
                authLevel: 2,
            }, { value }, callback);
        },
        /**
         * Get the minimum, median, and maximum value of a user's collection.
         */
        getValue(username, callback) {
            return client.get({
                url: '/users/' + util_js_1.util.escape(username) + '/collection/value',
                authLevel: 2,
            }, callback);
        },
    };
    return collection;
}
//# sourceMappingURL=collection.js.map