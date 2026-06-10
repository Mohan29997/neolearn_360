/**
 * Decodes a Base64-encoded string back to plain text.
 * Returns `undefined` silently if the input is not valid Base64.
 *
 * @param value - Base64-encoded string
 * @returns Decoded plain text, or `undefined` on invalid input
 */
export const decryptBase64 = (value: string) => {
  try {
    return atob(value);
  } catch (error) {
    
  }
};
