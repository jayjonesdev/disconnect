"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
/**
 * Discogs utility function library.
 */
exports.util = {
    /**
     * Strip the trailing number from a Discogs artist name: "Artist (2)" -> "Artist"
     */
    stripVariation(name) {
        return name.replace(/\s\(\d+\)$/, '');
    },
    /**
     * Add query params to a given url or path.
     */
    addParams(url, data) {
        if (!data || Object.keys(data).length === 0) {
            return url;
        }
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            if (value != null) {
                params.append(key, String(value));
            }
        }
        const qs = params.toString();
        return qs ? url + (url.includes('?') ? '&' : '?') + qs : url;
    },
    /**
     * Escape a string for use in a query string.
     */
    escape(str) {
        return encodeURIComponent(str);
    },
    /**
     * Deep merge `source` into `target` (by reference) and return `target`.
     * Nested objects/arrays are deep-cloned from the source, matching the
     * behaviour of the original library.
     */
    merge(target, source) {
        const out = target;
        const src = source;
        for (const key in src) {
            const val = src[key];
            if (val && typeof val === 'object') {
                out[key] = exports.util.merge(Array.isArray(val) ? [] : {}, val);
            }
            else {
                out[key] = val;
            }
        }
        return target;
    },
};
//# sourceMappingURL=util.js.map