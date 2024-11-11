// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {responsiveFontSize} from './metrices';
import {useDispatch} from 'react-redux';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {API_BASE_URL} from '../config/url';
import AppImages from './AppImages';
export const IMAGE_FOLDER = 'partners_img/';
 export const formatDate = (date) => {
  const newDate = new Date(date);
  
  const day = newDate.getDate();
  const month = newDate.toLocaleString('default', { month: 'short' });
  const year = newDate.getFullYear().toString().slice(-2);
  
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes(); 
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; 
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format as required: 26-Oct-24 10:47 PM
  return `${day}-${month}-${year} ${formattedHours}:${formattedMinutes} ${amPm}`;
}; 
export const getImageUrl = (partner_id, driver_id, profile_pic) => {
  console.log(
    'img_url',
    `${API_BASE_URL}media/${IMAGE_FOLDER}${partner_id}/drivers/${driver_id}_${profile_pic}`,
  );
  console.log('====================================');
  console.log(partner_id);
  console.log(driver_id);
  console.log(profile_pic);
  console.log('====================================');
  if (!partner_id || !driver_id || !profile_pic) {
    return AppImages.profileImage;
  }
  return `${API_BASE_URL}media/${IMAGE_FOLDER}${partner_id}/drivers/${driver_id}_${profile_pic}`;
};

export const successToast = (text1, text2 = '', visibilityTime = 4000) => {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
    position: 'top',
    autoHide: true,
    visibilityTime: visibilityTime,
    text1Style: {fontSize: 16},
    text2Style: {fontSize: 13},
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
    text1Style: {fontSize: 16},
    text2Style: {fontSize: 16},
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
    text1Style: {fontSize: responsiveFontSize(16)},
    text2Style: {fontSize: responsiveFontSize(13)},
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
    text1Style: {fontSize: responsiveFontSize(16)},
    text2Style: {fontSize: responsiveFontSize(13)},
    ...config, // Any custom configurations can be passed here
  });
};

export const generateRandomPhoneNumber = () => {
  const randomPhoneNumber = '9' + Math.floor(Math.random() * 1000000000);
  return randomPhoneNumber;
};
export const timeAgo = date => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hr: 3600,
    min: 60,
    sec: 1,
  };
  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

export const formatVehicleNumber = number => {
  return number
    .toUpperCase()
    .replace(/^([A-Z\d]{2})([A-Z\d]{2})([A-Z\d]{1,2})(\d{4})$/, '$1-$2-$3-$4');
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
      },
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
export function generateNumericOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
  }
  return otp;
}

// Function to get the driver's current location
export const GetDriverCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude, heading} = position.coords;
        resolve({latitude, longitude, heading});
      },
      error => {
        console.error('Geolocation error:', error);
        reject(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // Increase to 30 seconds
        maximumAge: 1000,
      },
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
// Custom function to calculate distance between two coordinates using the Haversine formula
export const calculateDistance = (origin, destination) => {
  const toRadians = degree => (degree * Math.PI) / 180;

  const R = 6371000; // Radius of the Earth in meters
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);
  const deltaLat = toRadians(destination.latitude - origin.latitude);
  const deltaLon = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};
export function calculateDistanceAndTime(
  lat1,
  lon1,
  lat2,
  lon2,
  averageSpeedKmh = 60,
) {
  const toRadians = degree => (degree * Math.PI) / 180;
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  // Calculate the Haversine distance
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = earthRadiusKm * c;

  // Estimate travel time in hours and convert to minutes and seconds
  const travelTimeHours = distanceKm / averageSpeedKmh;
  const travelTimeMinutes = Math.floor(travelTimeHours * 60);
  const travelTimeSeconds = Math.floor((travelTimeHours * 3600) % 60);

  return {
    distanceKm: distanceKm.toFixed(2), // Distance in kilometers
    travelTime: `${travelTimeMinutes}m ${travelTimeSeconds}s`, // Travel time in "minutes m seconds s" format
  };
}

export const custommapstyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

// [
//   {
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#f5f5f5',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.icon',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#616161',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.stroke',
//     stylers: [
//       {
//         color: '#f5f5f5',
//       },
//     ],
//   },
//   {
//     featureType: 'administrative.land_parcel',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#bdbdbd',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#eeeeee',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#757575',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#e5e5e5',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#9e9e9e',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#ffffff',
//       },
//     ],
//   },
//   {
//     featureType: 'road.arterial',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#757575',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#dadada',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#616161',
//       },
//     ],
//   },
//   {
//     featureType: 'road.local',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#9e9e9e',
//       },
//     ],
//   },
//   {
//     featureType: 'transit.line',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#e5e5e5',
//       },
//     ],
//   },
//   {
//     featureType: 'transit.station',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#eeeeee',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#c9c9c9',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#9e9e9e',
//       },
//     ],
//   },
// ];
