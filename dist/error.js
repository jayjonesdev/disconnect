"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = exports.DiscogsError = void 0;
/**
 * Discogs generic error.
 */
class DiscogsError extends Error {
    constructor(statusCode = 404, message = 'Unknown error.') {
        super(message);
        this.name = 'DiscogsError';
        this.statusCode = statusCode;
        // Restore prototype chain (required when extending Error in TS/ES5 targets)
        Object.setPrototypeOf(this, new.target.prototype);
    }
    toString() {
        return `${this.name}: ${this.statusCode} ${this.message}`;
    }
}
exports.DiscogsError = DiscogsError;
/**
 * Discogs authorization error.
 */
class AuthError extends DiscogsError {
    constructor() {
        super(401, 'You must authenticate to access this resource.');
        this.name = 'AuthError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AuthError = AuthError;
//# sourceMappingURL=error.js.map