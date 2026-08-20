"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
const util_js_1 = require("./util.js");
function list(client) {
    const list = {
        /**
         * Get the items in a list by list ID.
         */
        getItems(listId, params, callback) {
            let path = '/lists/' + util_js_1.util.escape(String(listId));
            if (typeof params === 'function') {
                callback = params;
            }
            else {
                path = util_js_1.util.addParams(path, params);
            }
            return client.get(path, callback);
        },
    };
    return list;
}
//# sourceMappingURL=list.js.map