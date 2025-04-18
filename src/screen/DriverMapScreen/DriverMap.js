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
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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
import { useDispatch, useSelector } from 'react-redux';
import database from '@react-native-firebase/database';
import Colors from '../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import DriverArriveCard from '../DriverEarning/DriverArriveCard';
import DestinationSection from './DestinationSection';
import { hitEndOrderApi, hitUpdateDriverLocationApi, hitupdateorderDistanceApi, hitupdateorderstopApi } from '../../config/api/api';
import NextOrder from '../../components/CustomNotificationModal/NextOrder';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

import DeliveryModal from './DeliveryComponent';
import { setcurrent_ride_travel_distance, setOrderData } from '../../redux/HitApis/HitApiSlice';
import { socketUrl } from '../../config/url';
import { io } from 'socket.io-client';


const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
  x: markerWidth * 0.5 - markerWidth * anchor.x,
  y: markerHeight * 0.5 - markerHeight * anchor.y,
});

const MARKER_WIDTH = 50;
const MARKER_HEIGHT = 70;
const ANCHOR = { x: 0.5, y: 1 - 10 / MARKER_HEIGHT };
const CENTEROFFSET = getCenterOffsetForAnchor(
  ANCHOR,
  MARKER_WIDTH,
  MARKER_HEIGHT,
);
const DriverMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const [heading, setHeading] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
     
      const { orderData, update_order, nextOrderData ,current_ride_travel_distance} = useSelector(
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
  const order_stops = orderData?.newOrder?.stops || orderData?.stops || [];

  const updatePosition = async newPosition => {
    if (lastPosition) {
      let distance = haversineDistance(lastPosition, newPosition);
      distance = parseFloat(distance.toFixed(4));
      const param = {
        order_id: orderData?.newOrder?.id || orderData?.id,
        driver_travel_distance: distance,
      };
      dispatch(setcurrent_ride_travel_distance(distance));
      if(order_stops?.length > 1){
      await hitUpdateDriverLocationApi(param);
      if (distance > 0.001) {
        setDistanceTraveled(prevDistance =>
          parseFloat((prevDistance + distance).toFixed(4)),
        );
      }
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
  const animateMarkerToCoordinate = (newCoordinate, duration = 3000) => {
    const lastCoordinate = {
      latitude: markerPosition.y.__getValue(),
      longitude: markerPosition.x.__getValue(),
    };

    const distance = calculateDistance(lastCoordinate, newCoordinate);

    // Ensure marker moves only when distance > 5 meters
    if (distance > 5) {
      markerPosition.stopAnimation();
      Animated.timing(markerPosition, {
        toValue: { x: newCoordinate.longitude, y: newCoordinate.latitude },
        duration: duration, // 3 seconds transition
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  };


  const rotateMarker = newHeading => {
    Animated.timing(rotationValue, {
      toValue: newHeading,
      duration: 1000,
      // easing: Easing.linear,
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
        const { latitude, longitude, heading } = await GetDriverCurrentLocation();
        const currentPosition = { latitude, longitude };
        // const response = await hitupdateorderDistanceApi({
        //   order_id: orderId, lat: latitude, lng: longitude
        // })
        if (calculateDistance(origin, destination) < 50) {
          successToast('Success', 'You Reached the Destination!');
          clearInterval(intervalId);
          return;
        }
        setLatLong({ latitude, longitude, heading });
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
          const newCoordinate = { latitude, longitude };
          updatePosition(newCoordinate);
        }
        const newCoordinate = { latitude, longitude, heading };

        // Move only if distance > 5 meters
        if (calculateDistance({ latitude: markerPosition.y.__getValue(), longitude: markerPosition.x.__getValue() }, newCoordinate) > 5) {
          animateMarkerToCoordinate(newCoordinate, 3000);
          rotateMarker(heading);
        }


      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (isFocused) {
      fetchLocation();
      intervalId = setInterval(fetchLocation, 3000);
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

        const { latitude, longitude, heading } = await GetDriverCurrentLocation();
        const newCoordinate = { latitude, longitude };
        // console.log('new-cordinate----->>',newCoordinate);
        // console.log('check==>','order-id', orderId,'lat',latitude,
        //   'long',longitude,
        //   'heading',heading,
        //  'time', database?.ServerValue.TIMESTAMP,);
        
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
      }, 3000);
    }
    setAppState(nextAppState);
  };
  const origin = {
    latitude: Number(latLOng?.latitude) || 0,
    longitude: Number(latLOng?.longitude) || 0,
    heading: Number(latLOng?.heading) || 0,
  };
  const nextStop = (orderData?.newOrder?.stops || orderData?.stops)
    ?.filter(stop => !stop?.is_completed)
    ?.reduce((minStop, stop) =>
      minStop && minStop.stop_sequence < stop.stop_sequence ? minStop : stop,
      null
    );
  // console.log(nextStop);

  const stops = (orderData?.newOrder?.stops || orderData?.stops) || [];

  const pendingStops = stops.filter(stop => !stop?.is_completed);

  // const nextStop = pendingStops.reduce((minStop, stop) =>
  //   minStop && minStop.stop_sequence < stop.stop_sequence ? minStop : stop,
  //   null
  // );

  const isLastStop = pendingStops.length === 1;

  // console.log({ nextStop, isLastStop });

  const nextStopIndex = nextStop ? order_stops?.findIndex(stop => stop.id == nextStop.id) : -1;
  const current_destination = {
    latitude: update_order?.is_arrived_pickup == 0 || update_order?.is_arrived_pickup == null
      ? Number(orderData?.pickup_lat) ||
      Number(orderData?.newOrder?.pickup_lat) ||
      0
      : Number(order_stops?.[nextStopIndex]?.stop_lat) ||
      0,
    longitude: update_order?.is_arrived_pickup == 0 || update_order?.is_arrived_pickup == null
      ? Number(orderData?.pickup_long) ||
      Number(orderData?.newOrder?.pickup_long) ||
      0
      : Number(order_stops?.[nextStopIndex]?.stop_lng) ||
      0,
  };

  const [selectedStopIndex, setSelectedStopIndex] = useState(nextStopIndex);
  const destination = {
    latitude: update_order?.is_arrived_pickup == 0 || update_order?.is_arrived_pickup == null
      ? Number(orderData?.pickup_lat) ||
      Number(orderData?.newOrder?.pickup_lat) ||
      0
      : Number(order_stops?.[selectedStopIndex]?.stop_lat) ||
      0,
    longitude: update_order?.is_arrived_pickup == 0 || update_order?.is_arrived_pickup == null
      ? Number(orderData?.pickup_long) ||
      Number(orderData?.newOrder?.pickup_long) ||
      0
      : Number(order_stops?.[selectedStopIndex]?.stop_lng) ||
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





  const [stop_modal, setstop_modal] = useState(false)
  const stop_distance = calculateDistance(origin, current_destination);
  useEffect(() => {
    if (
      update_order?.is_arrived_pickup == 1
    ) {

      if (stop_distance <= 100 && order_stops?.length > 1) {
        setstop_modal(true);
      } else {
        setstop_modal(false);
      }
    }
  }, [stop_distance]);

  const dispatch = useDispatch()
  const updateStopCompletion = (stopId) => {
    const updatedStops = (orderData?.stops || orderData?.newOrder?.stops || []).map(stop =>
      stop.id === stopId ? { ...stop, is_completed: true } : stop
    );
    dispatch(setOrderData({
      ...orderData,
      stops: updatedStops,
      newOrder: orderData?.newOrder
        ? { ...orderData.newOrder, stops: updatedStops } // Ensure newOrder.stops is also updated
        : orderData?.newOrder
    }));
  };
  const store_data = useSelector(state => state);
  const driver_details = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );

  const sendDummyDataToFirebase = async (data, message, type) => {
    try {
      const notificationPayload = {
        order_id: data?.id,
        driver_id: data?.driver_id,
        customer_id: data?.cust_id,
        message: message || 'This is a dummy notification.',
        timestamp: new Date().toISOString(),
        type: type || 1, // Assuming '1' is the type for a rating request
        stopId: type == 5 ? nextStop?.id : null,
        order: type == 5 && JSON.stringify(orderData?.newOrder) || JSON.stringify(orderData),
      };

      console.log("notificationPayload", notificationPayload);

      const customerPath = `customers/${data?.cust_id}/notifications`;
      console.log("customerPath", customerPath);

      await database().ref(customerPath).push(notificationPayload).then((res) => {
        console.log("res", res);
        console.log('🔥 Dummy data sent successfully to:', customerPath);
      }).catch((err) => {
        console.error("Firebase Data error", err);
      })

    } catch (error) {
      console.error('❌ Error sending dummy data to Firebase:', error.message);
    }
  };

  // console.log("nextStop",nextStop);

  const socketRef = useRef()
  useEffect(() => {
    socketRef.current = io(socketUrl); // Initialize socket
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.emit('registerUser', {
      userId: orderData?.newOrder?.driver_id || orderData?.driver_id,
      role: 'driver',
    });

    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [socketUrl, orderData]);
  const handleEndTrip = async () => {
    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
    });
    const param = {
      orderId: orderData?.newOrder?.id || orderData?.id,
      delivered_at: currentTime,
      partner_id:
        store_data?.parsalPartner?.loginuserdetails?.partner_id ||
        store_data?.parsalPartner?.loginuserdetails?.id,
      vehicle_type_id: driver_details?.vehicle_type_id || '4',
      distance: current_ride_travel_distance,
    };
    hitEndOrderApi(param)
      .then(res => {
        if (res) {
          if (socketRef.current) {
            socketRef.current.emit('end_trip', {
              userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
              order_id: orderData?.newOrder?.id || orderData?.id,
            });
            sendDummyDataToFirebase(
              orderData?.newOrder || orderData,
              'Order Ended',
              2,
            );
            navigation.navigate('AmountCollected');
          } else {
            console.log('Socket is not connected');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [deliver_modal_loader, setdeliver_modal_loader] = useState(false)
  // console.log("distanceTraveled", current_ride_travel_distance);

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
              style={{ width: responsiveWidth(37), height: responsiveHeight(37) }}
              resizeMode="contain"
            />
          </AnimatedMarker>

        ) : null}

        <Marker onPress={() => {
          if (
            update_order?.is_arrived_pickup == 1
          ) {

            if (stop_distance <= 100 && order_stops?.length > 1) {
              setstop_modal(true);
            } else {
              setstop_modal(false);
            }
          }
        }} coordinate={destination}>
          <Image
            source={AppImages.location}
            style={{ width: responsiveWidth(37), height: responsiveHeight(37) }}
            resizeMode="contain"
          />
        </Marker>
        {/* {order_stops?.map((item, index) => (
          <Polyline
            key={index} // Ensure unique key for each Polyline
            coordinates={[
              { latitude: Number(item?.stop_lat), longitude: Number(item?.stop_lng) }
            ]}
            strokeColor="black"
            strokeWidth={4}
            lineDashPattern={[10, 5]} // Dashed Line
          />
        ))} */}

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
            strokeColor={Colors.black}
            tracksViewChanges={false} // Prevent unnecessary renders
            onReady={result => { }}
            onError={errorMessage => {
              console.log('MapViewDirections error: ', errorMessage);
            }}
          />
        ) : null}

      </MapView>
      <View style={styles.cardContainer}>
        {update_order?.is_arrived_pickup ? (
          <DestinationSection details={update_order} selectedStopIndexes={selectedStopIndex} onStopIndexChange={(e) => {
            setSelectedStopIndex(e)
          }} />
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
      <DeliveryModal
        deliver_modal_loader={deliver_modal_loader}
        visible={stop_modal} onCancel={() => {
          setstop_modal(false)
        }} onClose={() => {
          setstop_modal(false)
        }} onDelivered={() => {
          setdeliver_modal_loader(true)
          const param = {
            stop_id: order_stops?.[selectedStopIndex]?.id,
            is_complete: true,
            distance: current_ride_travel_distance
          }
          hitupdateorderstopApi(param).then((res) => {
            if (res) {
              setdeliver_modal_loader(false)
              updateStopCompletion(nextStop?.id)
              setDistanceTraveled(0)
              setstop_modal(false)
              if (isLastStop) {
                handleEndTrip()
                return
              } else {
      dispatch(setcurrent_ride_travel_distance(0));

                sendDummyDataToFirebase(
                  orderData?.newOrder || orderData,
                  'Stop Reached',
                  5,
                );
                setSelectedStopIndex(selectedStopIndex + 1)
                return
              }
            }
          }).catch((err) => {
            console.error(err);
          })

        }} address={nextStop?.stop_address} />
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
