/**
 * Discogs utility function library.
 */
export declare const util: {
    /**
     * Strip the trailing number from a Discogs artist name: "Artist (2)" -> "Artist"
     */
    stripVariation(name: string): string;
    /**
     * Add query params to a given url or path.
     */
    addParams(url: string, data?: Record<string, unknown> | null): string;
    /**
     * Escape a string for use in a query string.
     */
    escape(str: string): string;
    /**
     * Deep merge `source` into `target` (by reference) and return `target`.
     * Nested objects/arrays are deep-cloned from the source, matching the
     * behaviour of the original library.
     */
    merge<T extends object>(target: T, source: object): T;
};
//# sourceMappingURL=util.d.ts.map