/**
 * Encodes a string to Base64 using the browser's native `btoa`.
 * Note: Base64 is encoding, not encryption — do not use for sensitive data.
 * For token storage, use `StorageManager` (which uses AES via CryptoJS).
 *
 * @param value - Plain text string to encode
 * @returns Base64-encoded string
 */
export const encryptBase64 = (value: string) => {
  return btoa(value);
};