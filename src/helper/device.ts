export const getReadableDeviceName = (): { deviceName: string, deviceUniqueId: string | number } => {
    const ua = navigator.userAgent;
    const productSub = navigator?.productSub;

    // if (/android/i.test(ua)) return "Android Device";
    // if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
    // if (/Macintosh/i.test(ua)) return "Mac";
    // if (/Windows/i.test(ua)) return "Windows PC";
    // if (/Linux/i.test(ua)) return "Linux Machine";

    return {
        deviceName: ua || "Unknown Device",
        deviceUniqueId: productSub || ""
    };
};

export const deviceName = getReadableDeviceName();