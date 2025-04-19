// import { useEffect } from 'react';
// import database from '@react-native-firebase/database';
// import BackgroundService from 'react-native-background-actions';
// import Geolocation from '@react-native-community/geolocation';
// import { PermissionsAndroid, Platform } from 'react-native';

// const requestPermissions = async () => {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//     ]);

//     console.log('Permissions: ', granted);
//     return granted;
//   }
// };

// const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// const useLocationTracking = (orderId) => {
//   useEffect(() => {
//     let isMounted = true;

//     const veryIntensiveTask = async (taskDataArguments) => {
//       const { delay } = taskDataArguments;

//       await new Promise(async () => {
//         for (let i = 0; BackgroundService.isRunning() && isMounted; i++) {
//           Geolocation.getCurrentPosition(
//             (position) => {
//               const { latitude, longitude } = position.coords;
//               console.log(`[Location Update #${i}]`, latitude, longitude);

//               // Push to Firebase
//               database()
//                 .ref(`/drivers/${orderId}/location`)
//                 .set({
//                   latitude,
//                   longitude,
//                   timestamp: new Date().toISOString(),
//                 });
//             },
//             (error) => {
//               console.log('Location error:', error);
//             },
//             {
//               enableHighAccuracy: true,
//               timeout: 10000,
//               maximumAge: 10000,
//             }
//           );

//           await sleep(delay);
//         }
//       });
//     };

//     const startTracking = async () => {
//       await requestPermissions();

//       const options = {
//         taskName: 'LocationService',
//         taskTitle: 'Tracking Location',
//         taskDesc: 'Sending location updates in background',
//         taskIcon: {
//           name: 'ic_launcher',
//           type: 'mipmap',
//         },
//         color: '#ff00ff',
//         linkingURI: 'example://tracking',
//         parameters: {
//           delay: 10000,
//         },
//         notificationId: 1234,
//       };

//       await BackgroundService.start(veryIntensiveTask, options);
//     };

//     startTracking();

//     return () => {
//       isMounted = false;
//       BackgroundService.stop();
//     };
//   }, [orderId]);
// };

// export default useLocationTracking;
