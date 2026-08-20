"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryExport = inventoryExport;
/**
 * Inventory export namespace.
 * @see https://www.discogs.com/developers/#page:inventory-export
 */
function inventoryExport(client) {
    const inventoryExport = {
        /**
         * Request an export of the authenticated user's inventory as a CSV.
         */
        export(callback) {
            return client.post({ url: '/inventory/export', authLevel: 2 }, null, callback);
        },
        /**
         * Get a list of the authenticated user's recent exports.
         */
        getExports(callback) {
            return client.get({ url: '/inventory/export', authLevel: 2 }, callback);
        },
        /**
         * Get details about a single export.
         */
        getExport(id, callback) {
            return client.get({ url: '/inventory/export/' + id, authLevel: 2 }, callback);
        },
        /**
         * Download the CSV for a finished export.
         */
        download(id, callback) {
            return client.get({
                url: '/inventory/export/' + id + '/download',
                authLevel: 2,
                json: false,
                queue: false,
            }, callback);
        },
    };
    return inventoryExport;
}
//# sourceMappingURL=inventoryExport.js.map