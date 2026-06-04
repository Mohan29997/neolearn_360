export interface ILoginPayload {
    "mobile": string | number;
    "notification"?: {
        "token": string;
        "deviceUniqueId": string;
        "deviceName": string;
    },
    "location"?: {
        "latitude": number;
        "longitude": number;
    }
}