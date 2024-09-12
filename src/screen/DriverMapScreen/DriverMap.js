import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppImages from '../../common/AppImages';
import ActionButton from './ActionButtons';
import ProfileSection from './ProfileSecrion';
const DriverMapScreen = () => {
  const [showButtons, setShowButtons] = useState(false);
  const handleAccept = () => {
    setShowButtons(false);
    console.log('Request Accepted');
  };
  const handleReject = () => {
    setShowButtons(false);
    console.log('Request Rejected');
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.7041,
          longitude: 77.1025,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: 28.7041, longitude: 77.1025 }} image={AppImages.rideBike} />
        <Marker coordinate={{ latitude: 28.7045, longitude: 77.1029 }} />
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