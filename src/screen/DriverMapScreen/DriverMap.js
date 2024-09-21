import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppImages from '../../common/AppImages';
import ActionButton from './ActionButtons';
import ProfileSection from './ProfileSecrion';
import { GetDriverCurrentLocation } from '../../common/CommonFunction';
import MapViewDirections from 'react-native-maps-directions';
import { useIsFocused } from '@react-navigation/native';
const DriverMapScreen = ({ route }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [latLOng, setLatLong] = useState({latitude:'',longitude:''})
  const data = route.params
  const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

  
  // const { latitude, longitude } = await GetDriverCurrentLocation();
  const isFocused = useIsFocused();

  useEffect(() => {
    let intervalId;

    const fetchLocation = async () => {
      try {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        setLatLong({ latitude, longitude });
        console.log({ latitude, longitude }, 'Location fetched');
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (isFocused) {
      fetchLocation(); // Fetch location immediately when the screen is focused
      intervalId = setInterval(fetchLocation, 300000); // Update every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [isFocused]);

  // useEffect to log latLong changes
  useEffect(() => {
    console.log('Updated latLong:', latLOng);
  }, [latLOng]);

  console.log('current lat long=>', latLOng)

  console.log('data', data)
  const handleAccept = () => {
    setShowButtons(false);
    console.log('Request Accepted');
  };
  const handleReject = () => {
    setShowButtons(false);
    console.log('Request Rejected');
  };

  const origin = {
    // latitude: Number(data.drop_lat),
    // longitude: Number(data.drop_long),

    latitude: Number(latLOng.latitude ? latLOng.latitude : data.drop_lat),
    longitude: Number(latLOng.longitude ? latLOng.longitude : data.drop_long),
  };

  const destination = {
    latitude: Number(data.picklat),
    longitude: Number(data.pickLong),
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...origin,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker for current location */}
        <Marker
          coordinate={origin}
          image={AppImages.rideBike}
        />

        {/* Marker for pickup location */}
        <Marker
          coordinate={destination}
        />

        {/* Display directions from current location to pickup location */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <ActionButton title="Accept" color="green" onPress={handleAccept} />
          <ActionButton title="Reject" color="red" onPress={handleReject} />
        </View>
      ) : (
        <ProfileSection />
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
});
export default DriverMapScreen;