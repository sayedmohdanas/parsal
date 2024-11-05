import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View, Text, Animated, Easing} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import AppImages from '../../common/AppImages';
import ActionButton from './ActionButtons';
import {
  GetDriverCurrentLocation,
  calculateDistance,
  custommapstyle,
} from '../../common/CommonFunction';
import MapViewDirections from 'react-native-maps-directions';
import {useIsFocused} from '@react-navigation/native';
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
  const [showButtons, setShowButtons] = useState(false);
  const [heading, setHeading] = useState(0);

  const [latLOng, setLatLong] = useState({
    latitude: '',
    longitude: '',
    heading: null,
  });
  const [mapRegion, setMapRegion] = useState(null);
  const markerPosition = useRef(new Animated.ValueXY()).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

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
  const orderData = useSelector(
    state => state?.parsalPartner?.orderData || null,
  );
  const update_order = useSelector(
    state => state?.parsalPartner?.update_order || null,
  );
  const driverID = orderData?.newOrder?.driver_id || orderData?.id;

  const isFocused = useIsFocused();

  useEffect(() => {
    let intervalId;
    const fetchLocation = async () => {
      try {
        const {latitude, longitude, heading} = await GetDriverCurrentLocation();
        setLatLong({latitude, longitude, heading});
        if (latitude && longitude) {
          database().ref(`/drivers/${driverID}/location`).set({
            latitude,
            longitude,
            timestamp: database?.ServerValue.TIMESTAMP,
          });
        }
        const newCoordinate = {latitude, longitude};

        animateMarkerToCoordinate(newCoordinate, 1000);
        rotateMarker(heading);
        setLatLong({latitude, longitude, heading});
        if (orderData) {
          const param = {
            order_id: orderData?.id || orderData?.newOrder?.id,
            current_lat: latitude,
            current_long: longitude,
          };
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    if (isFocused) {
      fetchLocation();
      intervalId = setInterval(fetchLocation, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFocused]);

  const handleAccept = () => {
    setShowButtons(false);
    console.log('Request Accepted');
  };
  const handleReject = () => {
    setShowButtons(false);
    console.log('Request Rejected');
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

  useEffect(() => {
    if (
      mapRef.current &&
      origin.latitude &&
      origin.longitude &&
      destination.latitude &&
      destination.longitude
    ) {
      const midLat = (origin.latitude + destination.latitude) / 2;
      const midLong = (origin.longitude + destination.longitude) / 2;
      const latDelta = Math.abs(origin.latitude - destination.latitude) + 0.05;
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
    }
  }, [orderData?.id, update_order?.is_arrived_pickup]);

  return (
    <View style={styles.container}>
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
        {/* Render origin marker only if coordinates are available */}
        {origin.latitude && origin.longitude ? (
          // <Marker coordinate={origin} rotation={origin.heading}>
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
        ) : // </Marker
        null}

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
              latitude: markerPosition.y.__getValue(),
              longitude: markerPosition.x.__getValue(),
            }}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor={Colors.brandBlue}
          />
        ) : null}
      </MapView>
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <ActionButton title="Accept" color="green" onPress={handleAccept} />
          <ActionButton title="Reject" color="red" onPress={handleReject} />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          {update_order?.is_arrived_pickup ? (
            <DestinationSection details={update_order} />
          ) : (
            <DriverArriveCard isReachedPickup={reached} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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