import axiosNative, { type AxiosResponse, AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios';
import { StorageManager } from '../storagemanager';
import { SnackNotification } from '../helper/snackMessage';
import { store } from '../store';
import { setIsLogin } from '../store/reducer/AuthHelper';

// export const baseURL: string = "http://localhost:8080/api/v1";
export const baseURL: string = "https://sphereblood-server.vercel.app/api/v1";
export const AXIOS = () => {
    const API: AxiosInstance = axiosNative.create({
        baseURL: baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    API.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        const controller = new AbortController();
        const _accessToken = await StorageManager.getAccessToken();

        try {
            if (typeof _accessToken === "string") {
                config.headers.Authorization = `Bearer ${_accessToken}`;
            }

            config.signal = controller.signal;
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    }, (error: AxiosError) => Promise.reject(error));

    API.interceptors.response.use((response: AxiosResponse): AxiosResponse => {

        const modifiedResponse: AxiosResponse<any, any> = {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config
        };
        // return Promise.resolve(modifiedResponse);
        return modifiedResponse;
    }, async function (error: AxiosError<any, any>) {
        console.log("axios.error", error)
        if (error?.message === "Network Error" && error?.code === "ERR_NETWORK") {
            return APIRETRY(API, error)
        } else if (error?.response?.status === 401) {
            const originalRequest: any = error.config;
            if (originalRequest && !originalRequest._retry) {
                try {
                    originalRequest._retry = true;
                    const _refreshToken = await StorageManager.getRefreshToken();
                    const response = await axiosNative.post(`${baseURL}/admin/admin/auth/refresh/token`, {
                        _refreshToken: _refreshToken,
                    });

                    if (response.status === 201 && response.data) {
                        const { _accessToken, _refreshToken } = response.data;
                        StorageManager.setAccessToken(_accessToken);
                        StorageManager.setRefreshToken(_refreshToken);
                        API.defaults.headers.common['Authorization'] = `Bearer ${_accessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${_accessToken}`;
                        return API(originalRequest);
                    } else {
                        LOCATIONUPDATE();
                    }
                } catch (error) {
                    console.log("token.error", error);
                    LOCATIONUPDATE();
                }
            } else {
                LOCATIONUPDATE();
            }
        } else if (error?.response?.status === 400) {
            return SnackNotification(error?.response?.data?.message || "Sorry we are not able to process your request. Please try again", "error")
        } else if (error?.response?.status === 403) {
            return LOCATIONUPDATE()
        } else if (error?.response?.status === 404) {
            return SnackNotification(error?.response?.data?.message || "Sorry we are not able to process your request. Please try again", "error")
        } else if (error?.response?.status === 405) {
            return SnackNotification("Request method not allowed. Please try again", "error")
        } else if (error?.response?.status === 408) {
            return APIRETRY(API, error)
        } else if (error?.response?.status === 500) {
            return APIRETRY(API, error)
        } else if (error?.response?.status === 503) {
            return APIRETRY(API, error)
        }
        return Promise.reject(error.response);
    });
    return API;
}

export const axiosInstance = AXIOS();

const APIRETRY = async (API: AxiosInstance, error: AxiosError<any, any>) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second
    const originalRequest: any = error.config;
    const retryCount = (originalRequest as any).__retryCount || 0;

    if (retryCount < MAX_RETRIES) {
        (originalRequest as any).__retryCount = retryCount + 1;

        // optional delay before retry
        await new Promise(res => setTimeout(res, RETRY_DELAY));

        return API(originalRequest); // 🔄 retry same request
    } else {
        return SnackNotification(error?.response?.data?.message || error?.message || "Sorry we are not able to process your request. Please try again", "error")
    }
}

const LOCATIONUPDATE = async () => {
    let data = JSON.stringify({
        admin: {
            location: {
                "latitude": store?.getState()?.authHelper.location?.latitude as string,
                "longitude": store?.getState()?.authHelper?.location?.longitude as string,
            },
            isOnline: false,
        }
    });
    let config = {
        method: 'patch',
        url: `${baseURL}/admin/update/location/by/${store.getState()?.adminProfile?._currentUser}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    await axiosInstance.request(config)
        .then(() => { })
        .catch(() => { })
        .finally(() => {
            store.dispatch(setIsLogin({ isLogin: false }));
            StorageManager.appLogout()
        });
}