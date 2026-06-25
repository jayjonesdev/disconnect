/**
 * Discogs utility function library.
 */
export const util = {
  /**
   * Strip the trailing number from a Discogs artist name: "Artist (2)" -> "Artist"
   */
  stripVariation(name: string): string {
    return name.replace(/\s\(\d+\)$/, '');
  },

  /**
   * Add query params to a given url or path.
   */
  addParams(url: string, data?: Record<string, unknown> | null): string {
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
  escape(str: string): string {
    return encodeURIComponent(str);
  },

  /**
   * Deep merge `source` into `target` (by reference) and return `target`.
   * Nested objects/arrays are deep-cloned from the source, matching the
   * behaviour of the original library.
   */
  merge<T extends object>(target: T, source: object): T {
    const out = target as Record<string, unknown>;
    const src = source as Record<string, unknown>;
    for (const key in src) {
      const val = src[key];
      if (val && typeof val === 'object') {
        out[key] = util.merge(Array.isArray(val) ? [] : {}, val as object);
      } else {
        out[key] = val;
      }
    }
    return target;
  },
};
