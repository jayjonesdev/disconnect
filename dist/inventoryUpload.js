"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryUpload = inventoryUpload;
/**
 * Inventory upload namespace — bulk inventory management via CSV upload.
 * @see https://www.discogs.com/developers/#page:inventory-upload
 */
function inventoryUpload(client) {
    const inventoryUpload = {
        /**
         * Upload a CSV of items to add to the inventory.
         */
        add(data, callback) {
            return client.post({ url: '/inventory/upload/add', authLevel: 2 }, data, callback);
        },
        /**
         * Upload a CSV of items to update in the inventory.
         */
        change(data, callback) {
            return client.post({ url: '/inventory/upload/change', authLevel: 2 }, data, callback);
        },
        /**
         * Upload a CSV of items to remove from the inventory.
         */
        delete(data, callback) {
            return client.post({ url: '/inventory/upload/delete', authLevel: 2 }, data, callback);
        },
        /**
         * Get a list of the authenticated user's recent uploads.
         */
        getUploads(callback) {
            return client.get({ url: '/inventory/upload', authLevel: 2 }, callback);
        },
        /**
         * Get details about a single upload.
         */
        getUpload(id, callback) {
            return client.get({ url: '/inventory/upload/' + id, authLevel: 2 }, callback);
        },
    };
    return inventoryUpload;
}
//# sourceMappingURL=inventoryUpload.js.map