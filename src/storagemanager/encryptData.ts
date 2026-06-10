import CryptoJS from 'crypto-js';

/**
 * AES-encrypts `data` using `salt` as the passphrase.
 * The value is JSON-stringified before encryption so all data types round-trip safely.
 *
 * @param data - Plain text string to encrypt
 * @param salt - Passphrase / encryption key (from `VITE_STORAGE_SALT` env var)
 * @returns Base64 CipherText string
 */
export const encryptData = (data: string, salt: string) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();

/**
 * Decrypts an AES ciphertext produced by `encryptData`.
 * Returns `null` on invalid ciphertext or wrong salt rather than throwing.
 *
 * @param ciphertext - Base64 CipherText string
 * @param salt - Same passphrase used during encryption
 * @returns Decrypted plain text string, or `null` on failure
 */
export const decryptData = (ciphertext: string, salt: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        return null;
    }
}