import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  AppState,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import AppImages from '../../common/AppImages';
import BackgroundTimer from 'react-native-background-timer';
import {
  GetDriverCurrentLocation,
  calculateDistance,
  custommapstyle,
  successToast,
} from '../../common/CommonFunction';
import MapViewDirections from 'react-native-maps-directions';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Colors from '../../common/Colors';
import {responsiveHeight, responsiveWidth} from '../../common/metrices';
import DriverArriveCard from '../DriverEarning/DriverArriveCard';
import DestinationSection from './DestinationSection';
import {hitUpdateDriverLocationApi} from '../../config/api/api';
const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
  x: markerWidth * 0.5 - markerWidth * anchor.x,
  y: markerHeight * 0.5 - markerHeight * anchor.y,
});

/** Marker's width */
const MARKER_WIDTH = 50;
/** Marker's height */
const MARKER_HEIGHT = 70;

/** Customizable anchor prop */
const ANCHOR = {x: 0.5, y: 1 - 10 / MARKER_HEIGHT};
/** Center offset based on anchor */
const CENTEROFFSET = getCenterOffsetForAnchor(
  ANCHOR,
  MARKER_WIDTH,
  MARKER_HEIGHT,
);

const DriverMapScreen = ({route}) => {
  const [heading, setHeading] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const orderData = useSelector(state => state?.parsalPartner?.orderData);
  const update_order = useSelector(state => state?.parsalPartner?.update_order);
  let timerId = null;

  // Haversine formula to calculate distance
  const haversineDistance = (point1, point2) => {
    const toRadians = angle => (angle * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);
    const lat1 = toRadians(point1.latitude);
    const lat2 = toRadians(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  const [count, setCount] = useState(0);
  // // console.log('orderData?.newOrder?.id || orderData?.id',orderData?.newOrder?.id || orderData?.id);
  // const updatePosition = async newPosition => {
  //   if (lastPosition) {
  //     let distance = haversineDistance(lastPosition, newPosition);
  //     distance = parseFloat(distance.toFixed(4)); // Adjust precision as needed
  //     const param = {
  //       order_id: orderData?.newOrder?.id || orderData?.id,
  //       driver_travel_distance: parseFloat(distance.toFixed(4)),
  //       driver_travel_time: count,
  //     };
  //     hitUpdateDriverLocationApi(param);
  //     // .then(res => {
  //     //   console.log('res', res);
  //     // })
  //     // .catch(err => {
  //     //   console.error(err);
  //     // });
  //     // Only update if the distance is significant
  //     if (distance > 0.001) {
  //       // Threshold to avoid GPS noise
  //       setDistanceTraveled(prevDistance =>
  //         parseFloat((prevDistance + distance).toFixed(4)),
  //       );
  //     }
  //   }
  //   setLastPosition(newPosition);
  // };
  const [travelStartTime, setTravelStartTime] = useState(null);
  const [elapsedTravelTime, setElapsedTravelTime] = useState(0);

  const updatePosition = async newPosition => {
    if (lastPosition) {
      let distance = haversineDistance(lastPosition, newPosition);
      distance = parseFloat(distance.toFixed(4));

      const param = {
        order_id: orderData?.newOrder?.id || orderData?.id,
        driver_travel_distance: parseFloat(distance.toFixed(4)),
        driver_travel_time: elapsedTravelTime, // Use elapsed time here
      };
      console.log('param', param);
      hitUpdateDriverLocationApi(param);

      // Accumulate distance if it's significant
      if (distance > 0.001) {
        setDistanceTraveled(prevDistance =>
          parseFloat((prevDistance + distance).toFixed(4)),
        );
      }
    }

    setLastPosition(newPosition);
  };

  const [latLOng, setLatLong] = useState({
    latitude: '',
    longitude: '',
    heading: null,
  });
  const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

  const markerPosition = useRef(new Animated.ValueXY()).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const animateMarkerToCoordinate = (coordinate, duration = 1000) => {
    const roundedCoordinate = {
      latitude: parseFloat(coordinate.latitude.toFixed(5)),
      longitude: parseFloat(coordinate.longitude.toFixed(5)),
    };
    Animated.timing(markerPosition, {
      toValue: {x: roundedCoordinate.longitude, y: roundedCoordinate.latitude},
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const rotateMarker = newHeading => {
    Animated.timing(rotationValue, {
      toValue: newHeading,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    setHeading(newHeading);
  };

  const driverID = orderData?.newOrder?.driver_id || orderData?.id;

  const isFocused = useIsFocused();

  // useEffect(() => {
  //   let intervalId;

  //   const fetchLocation = async () => {
  //     try {
  //       const {latitude, longitude, heading} = await GetDriverCurrentLocation();
  //       const currentPosition = {latitude, longitude};

  //       // Check if driver is within 50 meters of the destination
  //       if (calculateDistance(origin, destination) < 50) {
  //         successToast('Success', 'You Reached at Destination!');
  //         clearInterval(intervalId); // Stop further location updates
  //         return; // Exit early to prevent further execution
  //       }

  //       // Update state and Firebase with the current location
  //       setLatLong({latitude, longitude, heading});
  //       setLastPosition(currentPosition);

  //       if (latitude && longitude) {
  //         database().ref(`/drivers/${driverID}/location`).set({
  //           latitude,
  //           longitude,
  //           heading,
  //           timestamp: database?.ServerValue.TIMESTAMP,
  //         });
  //       }

  //       // Animate and rotate the marker
  //       const newCoordinate = {latitude, longitude, heading};
  //       animateMarkerToCoordinate(newCoordinate, 1000);
  //       rotateMarker(heading);
  //       setLatLong({latitude, longitude, heading});

  //       // Update position if the driver has arrived at the pickup location

  //       if (update_order?.is_arrived_pickup) {
  //         updatePosition(newCoordinate);
  //         setCount(prevCount => prevCount + 1);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching location:', error);
  //     }
  //   };

  //   if (isFocused) {
  //     fetchLocation();
  //     intervalId = setInterval(fetchLocation, 1000);
  //   }

  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     if (intervalId) {
  //       BackgroundTimer.clearInterval(timerId);
  //       clearInterval(intervalId);
  //     }
  //     appStateListener.remove();
  //   };
  // }, [isFocused, update_order?.is_arrived_pickup]);
  useEffect(() => {
    let intervalId;

    const fetchLocation = async () => {
      try {
        const {latitude, longitude, heading} = await GetDriverCurrentLocation();
        const currentPosition = {latitude, longitude};

        if (calculateDistance(origin, destination) < 50) {
          successToast('Success', 'You Reached the Destination!');
          setTravelStartTime(null);
          setElapsedTravelTime(0);
          clearInterval(intervalId);
          return;
        }

        setLatLong({latitude, longitude, heading});
        setLastPosition(currentPosition);

        if (latitude && longitude) {
          database().ref(`/drivers/${driverID}/location`).set({
            latitude,
            longitude,
            heading,
            timestamp: database?.ServerValue.TIMESTAMP,
          });
        }

        const newCoordinate = {latitude, longitude, heading};
        animateMarkerToCoordinate(newCoordinate, 1000);
        rotateMarker(heading);

        if (update_order?.is_arrived_pickup) {
          updatePosition(newCoordinate);
          setCount(prevCount => prevCount + 1);

          if (!travelStartTime) {
            setTravelStartTime(Date.now());
          }

          if (travelStartTime) {
            const currentTime = Math.floor(
              (Date.now() - travelStartTime) / 1000,
            );
            // console.log(currentTime);
            setElapsedTravelTime(currentTime);
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (isFocused) {
      fetchLocation();
      intervalId = setInterval(fetchLocation, 1000);
    }

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(timerIdRef.current);
        clearInterval(intervalId);
      }
      appStateListener.remove();
    };
  }, [isFocused, update_order?.is_arrived_pickup]);
  
  // const handleAppStateChange = nextAppState => {
  //   if (nextAppState === 'active') {
  //     if (timerId) {
  //       BackgroundTimer.clearInterval(timerId);
  //       timerId = null;
  //     }
  //   } else if (nextAppState === 'background') {
  //     timerId = BackgroundTimer.setInterval(async () => {
  //       const {latitude, longitude, heading} = await GetDriverCurrentLocation();
  //       const newCoordinate = {latitude, longitude};
  //       database().ref(`/drivers/${driverID}/location`).set({
  //         latitude,
  //         longitude,
  //         heading,
  //         timestamp: database?.ServerValue.TIMESTAMP,
  //       });
  //       if (
  //         update_order?.is_arrived_pickup &&
  //         calculateDistance(origin, destination) > 50
  //       ) {
  //         updatePosition(newCoordinate);
  //       }
  //       setCount(prevCount => prevCount + 1);
  //     }, 1000);
  //   }
  //   setAppState(nextAppState);
  // };
  const timerIdRef = useRef(null); // Use ref for background timer ID

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      if (timerIdRef.current) {
        BackgroundTimer.clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    } else if (nextAppState === 'background') {
      timerIdRef.current = BackgroundTimer.setInterval(async () => {
        const {latitude, longitude, heading} = await GetDriverCurrentLocation();
        const newCoordinate = {latitude, longitude};

        database().ref(`/drivers/${driverID}/location`).set({
          latitude,
          longitude,
          heading,
          timestamp: database?.ServerValue.TIMESTAMP,
        });

        if (
          update_order?.is_arrived_pickup &&
          calculateDistance(origin, destination) > 50
        ) {
          updatePosition(newCoordinate);

          // Start timing if it hasn't started yet
          if (!travelStartTime) {
            setTravelStartTime(Date.now());
          }

          // Update elapsed travel time
          if (travelStartTime) {
            const currentTime = Math.floor(
              (Date.now() - travelStartTime) / 1000,
            );
            setElapsedTravelTime(currentTime);
          }
        }

        if (calculateDistance(origin, destination) < 50) {
          successToast('Success', 'You reached the destination!');
          setTravelStartTime(null); // Reset start time
          setElapsedTravelTime(0); // Reset elapsed time
        }

        setCount(prevCount => prevCount + 1);
      }, 1000);
    }
    setAppState(nextAppState);
  };
  const origin = {
    latitude: Number(latLOng?.latitude) || 0,
    longitude: Number(latLOng?.longitude) || 0,
    heading: Number(latLOng?.heading) || 0,
  };

  const destination = {
    latitude: update_order?.is_arrived_pickup
      ? Number(orderData?.drop_lat) ||
        Number(orderData?.newOrder?.drop_lat) ||
        0
      : Number(orderData?.pickup_lat) ||
        Number(orderData?.newOrder?.pickup_lat) ||
        0,
    longitude: update_order?.is_arrived_pickup
      ? Number(orderData?.drop_long) ||
        Number(orderData?.newOrder?.drop_long) ||
        0
      : Number(orderData?.pickup_long) ||
        Number(orderData?.newOrder?.pickup_long) ||
        0,
  };

  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (
      origin.latitude &&
      origin.longitude &&
      destination.latitude &&
      destination.longitude
    ) {
      const distance = calculateDistance(origin, destination);
      if (distance <= 50) {
        setReached(true);
      } else {
        setReached(false);
      }
    }
  }, [origin, destination]);

  const mapRef = useRef(null);

  const initialLoad = useRef(true);
  const hasArrived = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      // Check if we should animate based on initial load or arrival at pickup
      const shouldAnimate =
        initialLoad.current ||
        (!hasArrived.current && update_order?.is_arrived_pickup === 1);

      if (
        shouldAnimate &&
        mapRef.current &&
        origin.latitude &&
        origin.longitude &&
        destination.latitude &&
        destination.longitude
      ) {
        const midLat = (origin.latitude + destination.latitude) / 2;
        const midLong = (origin.longitude + destination.longitude) / 2;
        const latDelta =
          Math.abs(origin.latitude - destination.latitude) + 0.05;
        const longDelta =
          Math.abs(origin.longitude - destination.longitude) + 0.05;

        mapRef.current.animateToRegion(
          {
            latitude: midLat,
            longitude: midLong,
            latitudeDelta: latDelta,
            longitudeDelta: longDelta,
          },
          1000,
        );

        // Update refs to prevent further auto-zoom
        initialLoad.current = false;
        if (update_order?.is_arrived_pickup === 1) {
          hasArrived.current = true;
        }
      }
    }, [
      orderData?.newOrder?.id,
      update_order?.is_arrived_pickup,
      destination.latitude,
      destination.longitude,
      origin.latitude,
      origin.longitude,
      mapRef,
    ]),
  );

  const [isLoading, setIsLoading] = useState(true);
  // console.log(calculateDistance(origin, destination));
  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <MapView
        customMapStyle={custommapstyle}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2 || 0, // midpoint with default
          longitude: (origin.longitude + destination.longitude) / 2 || 0, // midpoint with default
          latitudeDelta:
            Math.abs(origin.latitude - destination.latitude) + 0.05,
          longitudeDelta:
            Math.abs(origin.longitude - destination.longitude) + 0.05,
        }}>
        {origin.latitude && origin.longitude ? (
          <AnimatedMarker
            coordinate={{
              latitude: markerPosition.y.__getValue(),
              longitude: markerPosition.x.__getValue(),
            }}
            anchor={ANCHOR}
            centerOffset={CENTEROFFSET}
            flat={true}
            style={{
              transform: [
                {
                  rotate: rotationValue.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}>
            <Image
              source={AppImages.bike2}
              style={{width: responsiveWidth(37), height: responsiveHeight(37)}}
              resizeMode="contain"
            />
          </AnimatedMarker>
        ) : null}

        <Marker coordinate={destination}>
          <Image
            source={AppImages.location}
            style={{width: responsiveWidth(37), height: responsiveHeight(37)}}
            resizeMode="contain"
          />
        </Marker>
        {origin.latitude &&
        origin.longitude &&
        destination.latitude &&
        destination.longitude ? (
          <MapViewDirections
            origin={{
              latitude: latLOng?.latitude,
              longitude: latLOng?.longitude,
            }}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor={Colors.brandBlue}
          />
        ) : null}
      </MapView>
      {/* {showButtons ? (
        <View style={styles.buttonContainer}>
          <ActionButton title="Accept" color="green" onPress={handleAccept} />
          <ActionButton title="Reject" color="red" onPress={handleReject} />
        </View>
      ) : ( */}
      <View style={styles.cardContainer}>
        {update_order?.is_arrived_pickup ? (
          <DestinationSection details={update_order} />
        ) : (
          <DriverArriveCard isReachedPickup={reached} />
        )}
      </View>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly opaque background
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    paddingHorizontal: 15,
    zIndex: 10,
  },
});

export default DriverMapScreen;
// const DriverMapScreen = () => {
//   const [lastPosition, setLastPosition] = useState(null);
//   const orderData = useSelector(state => state?.parsalPartner?.orderData);
//   const update_order = useSelector(state => state?.parsalPartner?.update_order);

//   const updatePosition = async newPosition => {
//     if (lastPosition) {
//       let distance = haversineDistance(lastPosition, newPosition);
//       distance = parseFloat(distance.toFixed(4));
//       const param = {
//         order_id: orderData?.newOrder?.id || orderData?.id,
//         driver_travel_distance: distance,
//       };
//       await hitUpdateDriverLocationApi(param);
//     }
//     setLastPosition(newPosition);
//   };
//   const [latLOng, setLatLong] = useState({
//     latitude: '',
//     longitude: '',
//     heading: null,
//   });
//   const markerPosition = useRef(new Animated.ValueXY()).current;
//   const rotationValue = useRef(new Animated.Value(0)).current;
//   const animateMarkerToCoordinate = (coordinate, duration = 1000) => {
//     const roundedCoordinate = {
//       latitude: parseFloat(coordinate.latitude.toFixed(5)),
//       longitude: parseFloat(coordinate.longitude.toFixed(5)),
//     };
//     Animated.timing(markerPosition, {
//       toValue: {x: roundedCoordinate.longitude, y: roundedCoordinate.latitude},
//       duration,
//       easing: Easing.linear,
//       useNativeDriver: false,
//     }).start();
//   };
//   const rotateMarker = newHeading => {
//     Animated.timing(rotationValue, {
//       toValue: newHeading,
//       duration: 500,
//       easing: Easing.linear,
//       useNativeDriver: false,
//     }).start();
//   };
//   const driverID = orderData?.newOrder?.driver_id || orderData?.id;
//   const isFocused = useIsFocused();
//   useEffect(() => {
//     let intervalId;
//     const fetchLocation = async () => {
//       try {
//         const {latitude, longitude, heading} = await GetDriverCurrentLocation();
//         const currentPosition = {latitude, longitude};
//         if (calculateDistance(origin, destination) < 50) {
//           successToast('Success', 'You Reached the Destination!');
//           clearInterval(intervalId);
//           return;
//         }
//         setLatLong({latitude, longitude, heading});
//         setLastPosition(currentPosition);
//         if (latitude && longitude) {
//           database().ref(`/drivers/${driverID}/location`).set({
//             latitude,
//             longitude,
//             heading,
//             timestamp: database?.ServerValue.TIMESTAMP,
//           });
//         }
//         const newCoordinate = {latitude, longitude, heading};
//         animateMarkerToCoordinate(newCoordinate, 1000);
//         rotateMarker(heading);
//       } catch (error) {
//         console.error('Error fetching location:', error);
//       }
//     };

//     if (isFocused) {
//       fetchLocation();
//       intervalId = setInterval(fetchLocation, 1000);
//     }
//     const appStateListener = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );
//     return () => {
//       if (intervalId) {
//         BackgroundTimer.clearInterval(timerIdRef.current);
//         clearInterval(intervalId);
//       }
//       appStateListener.remove();
//     };
//   }, [isFocused, update_order?.is_arrived_pickup]);
//   const timerIdRef = useRef(null); // Use ref for background timer ID

//   const handleAppStateChange = nextAppState => {
//     if (nextAppState === 'active') {
//       if (timerIdRef.current) {
//         BackgroundTimer.clearInterval(timerIdRef.current);
//         timerIdRef.current = null;
//       }
//     } else if (nextAppState === 'background') {
//       timerIdRef.current = BackgroundTimer.setInterval(async () => {
//         const {latitude, longitude, heading} = await GetDriverCurrentLocation();
//         const newCoordinate = {latitude, longitude};
//         database().ref(`/drivers/${driverID}/location`).set({
//           latitude,
//           longitude,
//           heading,
//           timestamp: database?.ServerValue.TIMESTAMP,
//         });
//         if (
//           update_order?.is_arrived_pickup &&
//           calculateDistance(origin, destination) > 50
//         ) {
//           updatePosition(newCoordinate);
//         }
//         if (calculateDistance(origin, destination) < 50) {
//           successToast('Success', 'You reached the destination!');
//         }
//       }, 1000);
//     }
//   };
//   const origin = {
//     latitude: Number(latLOng?.latitude) || 0,
//     longitude: Number(latLOng?.longitude) || 0,
//     heading: Number(latLOng?.heading) || 0,
//   };

//   const destination = {
//     latitude: update_order?.is_arrived_pickup
//       ? Number(orderData?.drop_lat) ||
//         Number(orderData?.newOrder?.drop_lat) ||
//         0
//       : Number(orderData?.pickup_lat) ||
//         Number(orderData?.newOrder?.pickup_lat) ||
//         0,
//     longitude: update_order?.is_arrived_pickup
//       ? Number(orderData?.drop_long) ||
//         Number(orderData?.newOrder?.drop_long) ||
//         0
//       : Number(orderData?.pickup_long) ||
//         Number(orderData?.newOrder?.pickup_long) ||
//         0,
//   };

//   const [reached, setReached] = useState(false);

//   useEffect(() => {
//     if (
//       origin.latitude &&
//       origin.longitude &&
//       destination.latitude &&
//       destination.longitude
//     ) {
//       const distance = calculateDistance(origin, destination);
//       if (distance <= 50) {
//         setReached(true);
//       } else {
//         setReached(false);
//       }
//     }
//   }, [origin, destination]);

//   const mapRef = useRef(null);

//   const initialLoad = useRef(true);
//   const hasArrived = useRef(false);

//   useFocusEffect(
//     React.useCallback(() => {
//       const shouldAnimate =
//         initialLoad.current ||
//         (!hasArrived.current && update_order?.is_arrived_pickup === 1);

//       if (
//         shouldAnimate &&
//         mapRef.current &&
//         origin.latitude &&
//         origin.longitude &&
//         destination.latitude &&
//         destination.longitude
//       ) {
//         const midLat = (origin.latitude + destination.latitude) / 2;
//         const midLong = (origin.longitude + destination.longitude) / 2;
//         const latDelta =
//           Math.abs(origin.latitude - destination.latitude) + 0.05;
//         const longDelta =
//           Math.abs(origin.longitude - destination.longitude) + 0.05;

//         mapRef.current.animateToRegion(
//           {
//             latitude: midLat,
//             longitude: midLong,
//             latitudeDelta: latDelta,
//             longitudeDelta: longDelta,
//           },
//           1000,
//         );
//         initialLoad.current = false;
//         if (update_order?.is_arrived_pickup === 1) {
//           hasArrived.current = true;
//         }
//       }
//     }, [
//       orderData?.newOrder?.id,
//       update_order?.is_arrived_pickup,
//       destination.latitude,
//       destination.longitude,
//       origin.latitude,
//       origin.longitude,
//       mapRef,
//     ]),
//   );

//   return (
//     <View style={styles.container}>
//       <MapView
//         customMapStyle={custommapstyle}
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: (origin.latitude + destination.latitude) / 2 || 0,
//           longitude: (origin.longitude + destination.longitude) / 2 || 0,
//           latitudeDelta:
//             Math.abs(origin.latitude - destination.latitude) + 0.05,
//           longitudeDelta:
//             Math.abs(origin.longitude - destination.longitude) + 0.05,
//         }}>
//         {origin.latitude && origin.longitude ? (
//           <AnimatedMarker
//             coordinate={{
//               latitude: markerPosition.y.__getValue(),
//               longitude: markerPosition.x.__getValue(),
//             }}
//             anchor={ANCHOR}
//             centerOffset={CENTEROFFSET}
//             flat={true}
//             style={{
//               transform: [
//                 {
//                   rotate: rotationValue.interpolate({
//                     inputRange: [0, 360],
//                     outputRange: ['0deg', '360deg'],
//                   }),
//                 },
//               ],
//             }}>
//             <Image
//               source={AppImages.bike2}
//               style={{width: responsiveWidth(37), height: responsiveHeight(37)}}
//               resizeMode="contain"
//             />
//           </AnimatedMarker>
//         ) : null}

//         <Marker coordinate={destination}>
//           <Image
//             source={AppImages.location}
//             style={{width: responsiveWidth(37), height: responsiveHeight(37)}}
//             resizeMode="contain"
//           />
//         </Marker>
//         {origin.latitude &&
//         origin.longitude &&
//         destination.latitude &&
//         destination.longitude ? (
//           <MapViewDirections
//             optimizeWaypoints={true}
//             origin={{
//               latitude: latLOng?.latitude,
//               longitude: latLOng?.longitude,
//             }}
//             destination={destination}
//             apikey={GOOGLE_API_KEY}
//             strokeWidth={4}
//             strokeColor={Colors.brandBlue}
//             precision="high"
//           />
//         ) : null}
//       </MapView>
//       <View style={styles.cardContainer}>
//         {update_order?.is_arrived_pickup ? (
//           <DestinationSection details={update_order} />
//         ) : (
//           <DriverArriveCard isReachedPickup={reached} />
//         )}
//       </View>
//     </View>
//   );
// };