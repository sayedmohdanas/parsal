// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from './metrices';
import { useDispatch } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

// export function setItem(key, data) {
//     data = JSON.stringify(data);
//     // return AsyncStorage.setItem(key, data);
// }

// export function getItem(key) {
//     return new Promise((resolve, reject) => {
//         AsyncStorage.getItem(key).then(data => {
//             resolve(JSON.parse(data));
//         });
//     });
// }
export const successToast = (text1, text2 = '', visibilityTime = 4000) => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: visibilityTime,
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 13 },
    });
};

export const errorToast = (text1, text2 = '') => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 16 },
    });
};

export const infoToast = (text1, text2 = '') => {
    Toast.show({
        type: 'info',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: responsiveFontSize(16) },
        text2Style: { fontSize: responsiveFontSize(13) },
    });
};

export const customToast = (text1, text2 = '', config = {}) => {
    Toast.show({
        type: 'custom',
        text1: text1,
        text2: text2,
        position: 'top',
        autoHide: true,
        visibilityTime: 4000,
        text1Style: { fontSize: responsiveFontSize(16) },
        text2Style: { fontSize: responsiveFontSize(13) },
        ...config, // Any custom configurations can be passed here
    });
}

export const generateRandomPhoneNumber = () => {
    const randomPhoneNumber = '9' + Math.floor(Math.random() * 9000000000 + 1000000000);
    return randomPhoneNumber;
};

export const formatVehicleNumber = number => {
    return number
        .toUpperCase()
        .replace(
            /^([A-Z\d]{2})([A-Z\d]{2})([A-Z\d]{1,2})(\d{4})$/,
            '$1-$2-$3-$4'
        );
};

export async function requestLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Parsal Partner',
                message: 'Parsal Partner access to your location',
            }
        );
        console.log('Permission status:', granted); // Log the permission status

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         
        } else {
            console.log("Location permission denied");
            alert("Location permission denied");
        }
    } catch (err) {
        console.warn(err);
    }
}

export const GetDriverCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Latitude:', latitude, 'Longitude:', longitude);
                resolve({ latitude, longitude });
            },
            (error) => {
                console.error('Geolocation error:', error);
                reject(`Error getting location: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
            }
        );
    });
};

