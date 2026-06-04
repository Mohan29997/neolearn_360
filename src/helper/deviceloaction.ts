export const devicelocation = (): { latitude: number, longitude: number } | void => {
    if (!navigator.geolocation) return console.error('Geolocation is not supported by this browser.');

    var lat: number = 0;
    var lon: number = 0;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            lat = latitude;
            lon = longitude;
        },
        (error) => {
            console.error('Error getting location:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
    );

    console.log({lat, lon})


    return {
        "latitude": lat,
        "longitude": lon,
    }
}

export const getdevicelocation = devicelocation()