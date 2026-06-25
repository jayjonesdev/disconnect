/**
 * Discogs generic error.
 */
export class DiscogsError extends Error {
  public readonly statusCode: number;

  constructor(statusCode = 404, message = 'Unknown error.') {
    super(message);
    this.name = 'DiscogsError';
    this.statusCode = statusCode;
    // Restore prototype chain (required when extending Error in TS/ES5 targets)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.statusCode} ${this.message}`;
  }
}

/**
 * Discogs authorization error.
 */
export class AuthError extends DiscogsError {
  constructor() {
    super(401, 'You must authenticate to access this resource.');
    this.name = 'AuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
