import CryptoJS from 'crypto-js';

export const encryptData = (data: string, salt: string) =>
    CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();


export const decryptData = (ciphertext: string, salt: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
    try {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        return null;
    }
}