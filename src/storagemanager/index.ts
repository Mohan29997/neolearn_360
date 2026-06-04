import { type IAdminProfileState } from '../store/reducer/AdminProfile';
import { encryptData, decryptData } from './encryptData';

const salt = '6d090796-ecdf-11ea-adc1-0242ac112345';
export class StorageManager {

    static setAccessToken(token: string) {
        try {
            const encryptedData = encryptData(token, salt);
            localStorage.setItem('accessToken', encryptedData);
        } catch (error) {
            console.log(error);
        }
    }

    static getAccessToken() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return null
            return decryptData(accessToken, salt);
        } catch (error) {
            console.log(error);
        }
    }

    static setRefreshToken(token: string) {
        try {
            const encryptedData = encryptData(token, salt);
            localStorage.setItem('refreshToken', encryptedData);
        } catch (error) {
            console.log(error);
        }
    }

    static getRefreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return null
            return decryptData(refreshToken, salt);
        } catch (error) {
            console.log(error);
        }
    }

    static setProfile(prifile: IAdminProfileState) {
        try {
            const encryptedData = encryptData(JSON.stringify(prifile), salt);
            localStorage.setItem('adminprofile', encryptedData);
        } catch (error) {
            console.log(error);
        }
    }

    static getProfile() {
        try {
            const adminprofile = localStorage.getItem('adminprofile');
            if (!adminprofile) return null
            const profile = decryptData(adminprofile, salt);
            return JSON.parse(profile)
        } catch (error) {
            return null
        }
    }

    static appLogout() {
        localStorage.clear();
    }

    static removeItems() {
        localStorage.clear();
    }
}