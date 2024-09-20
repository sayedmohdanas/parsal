import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ProfileWithStatus = ({ isOnline }) => {
  return (
    <View style={styles.container}>
      <Image source={AppImages.profileImage} style={styles.profileImage} />
      <View style={[styles.statusContainer, { backgroundColor: isOnline ? 'green' : 'red' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 17.5,
    marginRight: 10,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 10, // Adjust size as needed
    height: 10, // Adjust size as needed
    borderRadius: 5, // Make it a circle
  },
});

export default ProfileWithStatus;
