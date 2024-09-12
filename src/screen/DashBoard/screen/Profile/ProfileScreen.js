import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VehicleProfileCard from '../../components/VehicleprofileCard';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <VehicleProfileCard screen={""}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
     marginTop:15,

},
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'

  },
});

export default ProfileScreen;
