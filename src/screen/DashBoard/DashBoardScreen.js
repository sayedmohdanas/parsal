// src/screen/DashBoardScreen/DashBoardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import VehicleProfileCard from './components/VehicleprofileCard';

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()} // Open the drawer
        style={styles.hamburgerButton}
      >
        {/* <Image
           source={AppImages.hamburgerImage} // Path to your hamburger icon
          style={styles.hamburgerIcon}
        /> */}

      </TouchableOpacity>

      {/* Dashboard Content */}
      {/* <Text style={styles.title}>Welcome to the Dashboard</Text> */}
      <VehicleProfileCard screen={true}/>
      {/* Add other content here, such as VehicleProfileCard or other components */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    
  },
  hamburgerButton: {
    position: 'absolute',
    // top: 40,
    left: 15,
    zIndex: 1,
    flexDirection:'row'
  },
  hamburgerIcon: {
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default DashboardScreen;
