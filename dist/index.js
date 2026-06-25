"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = exports.AuthError = exports.DiscogsError = exports.Queue = exports.DiscogsOAuth = exports.DiscogsClient = void 0;
/**
 * disconnect — a full-featured Discogs API v2.0 client library.
 */
var client_js_1 = require("./client.js");
Object.defineProperty(exports, "DiscogsClient", { enumerable: true, get: function () { return client_js_1.DiscogsClient; } });
var oauth_js_1 = require("./oauth.js");
Object.defineProperty(exports, "DiscogsOAuth", { enumerable: true, get: function () { return oauth_js_1.DiscogsOAuth; } });
var queue_js_1 = require("./queue.js");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return queue_js_1.Queue; } });
var error_js_1 = require("./error.js");
Object.defineProperty(exports, "DiscogsError", { enumerable: true, get: function () { return error_js_1.DiscogsError; } });
Object.defineProperty(exports, "AuthError", { enumerable: true, get: function () { return error_js_1.AuthError; } });
var util_js_1 = require("./util.js");
Object.defineProperty(exports, "util", { enumerable: true, get: function () { return util_js_1.util; } });
__exportStar(require("./types.js"), exports);
const client_js_2 = require("./client.js");
const util_js_2 = require("./util.js");
/**
 * Default export mirroring the original `require('disconnect')` shape:
 * `{ Client, util }`.
 */
exports.default = {
    Client: client_js_2.DiscogsClient,
    util: util_js_2.util,
};
//# sourceMappingURL=index.js.map