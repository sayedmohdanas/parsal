// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { responsiveFontSize } from './metrices';
import { useDispatch } from 'react-redux';
import { PermissionsAndroid, Platform } from 'react-native';
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

// import { PermissionsAndroid, Alert } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// Function to request location permission for Android
export async function requestLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Parsal Partner Location Permission',
                message: 'Parsal Partner needs access to your location',
            }
        );
        console.log('Permission status:', granted); // Log the permission status

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            // After permission is granted, fetch the driver's location
            return true;
        } else {
            console.log('Location permission denied');
            Alert.alert('Permission Denied', 'Location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}

// Function to get the driver's current location
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

// Call this function to first request permission and then get the location
export async function fetchDriverLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
        try {
            const location = await GetDriverCurrentLocation();
            console.log('Driver location:', location);
            // You can now use the location data (latitude, longitude)
        } catch (error) {
            console.log('Error fetching location:', error);
        }
    }
}

// export const GetDriverCurrentLocation2 = async () => {
//     try {
//         // For Android, we need to request location permission
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 {
//                     title: "Location Permission",
//                     message: "This app needs access to your location",
//                     buttonNeutral: "Ask Me Later",
//                     buttonNegative: "Cancel",
//                     buttonPositive: "OK"
//                 }
//             );
//             if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//                 throw new Error('Location permission denied');
//             }
//         }

//         return new Promise((resolve, reject) => {
//             Geolocation.getCurrentPosition(
//                 (position) => {
//                   addLocation(position.coords);
//                 },
//                 (error) => {
//                   console.error(error);
//                 },
//                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//               );
//         });
//     } catch (error) {
//         console.error('Error requesting location permission:', error);
//         throw new Error(`Error: ${error.message}`);
//     }
// };
