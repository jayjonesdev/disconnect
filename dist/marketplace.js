"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketplace = marketplace;
const util_js_1 = require("./util.js");
const user_js_1 = require("./user.js");
function marketplace(client) {
    const marketplace = {
        /**
         * Get the inventory for the given user (shared with the user namespace).
         */
        getInventory: (0, user_js_1.user)(client).getInventory,
        /**
         * Get a marketplace listing.
         */
        getListing(listing, callback) {
            return client.get('/marketplace/listings/' + listing, callback);
        },
        /**
         * Create a marketplace listing.
         */
        addListing(data, callback) {
            return client.post({ url: '/marketplace/listings', authLevel: 2 }, data, callback);
        },
        /**
         * Edit a marketplace listing.
         */
        editListing(listing, data, callback) {
            return client.post({ url: '/marketplace/listings/' + listing, authLevel: 2 }, data, callback);
        },
        /**
         * Delete a marketplace listing.
         */
        deleteListing(listing, callback) {
            return client.delete({ url: '/marketplace/listings/' + listing, authLevel: 2 }, callback);
        },
        /**
         * Get a list of the authenticated user's orders.
         */
        getOrders(params, callback) {
            let path = '/marketplace/orders';
            if (typeof params === 'function') {
                callback = params;
            }
            else if (params && typeof params === 'object') {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get({ url: path, authLevel: 2 }, callback);
        },
        /**
         * Get details of a marketplace order.
         */
        getOrder(order, callback) {
            return client.get({ url: '/marketplace/orders/' + order, authLevel: 2 }, callback);
        },
        /**
         * Edit a marketplace order.
         */
        editOrder(order, data, callback) {
            return client.post({ url: '/marketplace/orders/' + order, authLevel: 2 }, data, callback);
        },
        /**
         * List the messages for the given order ID.
         */
        getOrderMessages(order, params, callback) {
            let path = '/marketplace/orders/' + order + '/messages';
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get({ url: path, authLevel: 2 }, callback);
        },
        /**
         * Add a message to the given order ID.
         */
        addOrderMessage(order, data, callback) {
            return client.post({ url: '/marketplace/orders/' + order + '/messages', authLevel: 2 }, data, callback);
        },
        /**
         * Get the marketplace fee for a given price.
         */
        getFee(price, currency, callback) {
            let path = '/marketplace/fee/' +
                (typeof price === 'number' ? price.toFixed(2) : price);
            if (typeof currency === 'function') {
                callback = currency;
            }
            else if (currency) {
                path += '/' + currency;
            }
            return client.get(path, callback);
        },
        /**
         * Get price suggestions for a given release ID in the user's selling currency.
         */
        getPriceSuggestions(release, callback) {
            return client.get({ url: '/marketplace/price_suggestions/' + release, authLevel: 2 }, callback);
        },
        /**
         * Get community marketplace statistics for a release (lowest price, number
         * for sale, etc.). Does not require authentication.
         */
        getReleaseStatistics(release, currAbbr, callback) {
            if (typeof currAbbr === 'function') {
                callback = currAbbr;
                currAbbr = undefined;
            }
            const path = util_js_1.util.addParams('/marketplace/release_statistics/' + release, currAbbr ? { curr_abbr: currAbbr } : undefined);
            return client.get(path, callback);
        },
    };
    return marketplace;
}
//# sourceMappingURL=marketplace.js.map