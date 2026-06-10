// export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type QueryParams = Record<string, QueryParamValue>;

/**
 * Serializes a params object into a URL query string.
 * Arrays are JSON-stringified (e.g. `["a","b"]` → `%5B%22a%22%2C%22b%22%5D`).
 *
 * @param params - Object whose values are primitives or arrays
 * @returns URL-encoded query string without the leading `?`
 *
 * @example
 * buildQueryParams({ page: 1, roles: ['ADMIN', 'MANAGER'] })
 * // → "page=1&roles=%5B%22ADMIN%22%2C%22MANAGER%22%5D"
 */
export const buildQueryParams = (string: QueryParams): string => {
    return new URLSearchParams(
      Object.entries(string).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? JSON.stringify(value) : String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
};