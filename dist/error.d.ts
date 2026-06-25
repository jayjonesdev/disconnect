/**
 * Discogs generic error.
 */
export declare class DiscogsError extends Error {
    readonly statusCode: number;
    constructor(statusCode?: number, message?: string);
    toString(): string;
}
/**
 * Discogs authorization error.
 */
export declare class AuthError extends DiscogsError {
    constructor();
}
//# sourceMappingURL=error.d.ts.map