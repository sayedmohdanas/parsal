import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  AppState,
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
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Colors from '../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import DriverArriveCard from '../DriverEarning/DriverArriveCard';
import DestinationSection from './DestinationSection';
import {hitUpdateDriverLocationApi} from '../../config/api/api';
import NextOrder from '../../components/CustomNotificationModal/NextOrder';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
  x: markerWidth * 0.5 - markerWidth * anchor.x,
  y: markerHeight * 0.5 - markerHeight * anchor.y,
});

const MARKER_WIDTH = 50;
const MARKER_HEIGHT = 70;
const ANCHOR = {x: 0.5, y: 1 - 10 / MARKER_HEIGHT};
const CENTEROFFSET = getCenterOffsetForAnchor(
  ANCHOR,
  MARKER_WIDTH,
  MARKER_HEIGHT,
);
const DriverMapScreen = ({route}) => {
  const navigation = useNavigation();
  const [heading, setHeading] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const {orderData, update_order, nextOrderData} = useSelector(
    state => state?.parsalPartner,
  );
  let timerId = null;
  const [nextordermodal, setnextordermodal] = useState(false);
  const haversineDistance = (point1, point2) => {
    const toRadians = angle => (angle * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);
    const lat1 = toRadians(point1.latitude);
    const lat2 = toRadians(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updatePosition = async newPosition => {
    if (lastPosition) {
      let distance = haversineDistance(lastPosition, newPosition);
      distance = parseFloat(distance.toFixed(4));
      const param = {
        order_id: orderData?.newOrder?.id || orderData?.id,
        driver_travel_distance: distance,
      };
      await hitUpdateDriverLocationApi(param);
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
  const orderId = orderData?.newOrder?.driver_id || orderData?.driver_id;
  const isFocused = useIsFocused();
  useEffect(() => {
    let intervalId;
    const fetchLocation = async () => {
      try {
        const {latitude, longitude, heading} = await GetDriverCurrentLocation();
        const currentPosition = {latitude, longitude};
        if (calculateDistance(origin, destination) < 50) {
          successToast('Success', 'You Reached the Destination!');
          clearInterval(intervalId);
          return;
        }
        setLatLong({latitude, longitude, heading});
        setLastPosition(currentPosition);
        if (latitude && longitude) {
          database().ref(`/drivers/${orderId}/location`).set({
            latitude,
            longitude,
            heading,
            timestamp: database?.ServerValue.TIMESTAMP,
          });
        }
        if (
          update_order?.is_arrived_pickup &&
          calculateDistance(origin, destination) > 50
        ) {
          const newCoordinate = {latitude, longitude};
          updatePosition(newCoordinate);
        }
        const newCoordinate = {latitude, longitude, heading};

        animateMarkerToCoordinate(newCoordinate, 1000);
        rotateMarker(heading);
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

  const timerIdRef = useRef(null);

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
        database().ref(`/drivers/${orderId}/location`).set({
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
        }
        if (calculateDistance(origin, destination) < 50) {
          successToast('Success', 'You reached the destination!');
        }
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
  const NextOrderHeader = useMemo(() => {
    if (nextOrderData != null) {
      return (
        <View
          style={{
            zIndex: 1000,
            backgroundColor: Colors.white,
            flexDirection: 'row',
            borderTopWidth: 0.6,
            borderBottomWidth: 0.6,
            borderColor: '#D8D8D8',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: responsiveWidth(10),
            }}>
            <Image
              source={AppImages.radar}
              style={{ height: responsiveWidth(16), width: responsiveWidth(22) }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: responsiveFontSize(12),
                paddingVertical: responsiveHeight(14),
                paddingLeft: responsiveWidth(4),
                color: '#777777',
                fontWeight: '500',
              }}>
              {'Next Pickup :'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text
              onPress={() => {
                setnextordermodal(true);
              }}
              style={{
                fontSize: responsiveFontSize(12),
                paddingVertical: responsiveHeight(12),
                paddingLeft: responsiveWidth(2),
                color: '#232323',
                fontWeight: '600',
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {nextOrderData?.newOrder?.pickup_address ||
                nextOrderData?.pickup_address}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }, [nextOrderData, nextordermodal]);
  const [smoothedOrigin, setSmoothedOrigin] = useState({
    latitude: latLOng?.latitude,
    longitude: latLOng?.longitude,
  });

  // useEffect(() => {
  //   let timeoutId;

  //   // Update smoothedOrigin with a delay
  //   if (latLOng) {
  //     timeoutId = setTimeout(() => {
  //       setSmoothedOrigin({
  //         latitude: latLOng.latitude,
  //         longitude: latLOng.longitude,
  //       });
  //     }, 500); // Adjust delay as needed
  //   }

  //   return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount or latLOng change
  // }, [latLOng]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <View
        style={{
          zIndex: 1000,
          backgroundColor: Colors.white,
          flexDirection: 'row',
          borderTopWidth: 0.6,
          borderBottomWidth: 0.6,
          borderColor: '#D8D8D8',
        }}>
        <HeaderBackButton
          onPress={() => {
            navigation.navigate('OrderScreen');
          }}
          headerText={'Live Trip'}
        />
      </View>
      {NextOrderHeader}
      <MapView
        customMapStyle={custommapstyle}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2 || 0,
          longitude: (origin.longitude + destination.longitude) / 2 || 0,
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
            // tracksViewChanges={false}
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

        <Marker coordinate={destination} >
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
              latitude:latLOng?.latitude,
              longitude:latLOng?.longitude
            }}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor={Colors.black}
            tracksViewChanges={false} // Prevent unnecessary renders
            onReady={result => {
            }}
            onError={errorMessage => {
              console.log('MapViewDirections error: ', errorMessage);
            }}
          />
        ) : null}
      </MapView>
      <View style={styles.cardContainer}>
        {update_order?.is_arrived_pickup ? (
          <DestinationSection details={update_order} />
        ) : (
          <DriverArriveCard
            nextId={nextOrderData?.newOrder?.id || nextOrderData?.id}
            isReachedPickup={reached}
          />
        )}
      </View>
      <NextOrder
        onClose={() => {
          setnextordermodal(false);
        }}
        isVisible={nextordermodal}
        setnextordermodal={setnextordermodal}
      />
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    paddingHorizontal: responsiveWidth(20),
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
