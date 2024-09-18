// src/screen/DashBoardScreen/DashBoardScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // For navigation
import VehicleProfileCard from './components/VehicleprofileCard';
import Colors from '../../common/Colors';

const DashboardScreen = () => { 
  const route = useRoute();

  const navigation = useNavigation();
  // const { data } = route?.params || {/}; 

  // const { data } = route.params || {};

 
  // useEffect(() => {
  //   if (data) {
  //     Alert.alert('Data Received', `Received data: ${JSON.stringify(data)}`);
  //   } else {
  //     Alert.alert('No Data', 'No data received');
  //   }
  //   console.log('Received data:', data);
  // }, [data]);
  return (
    <View style={styles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()} // Open the drawer
        style={styles.hamburgerButton}
      >
        <View style={{ flexDirection:'row',alignItems:'center',gap:5}} >
        {/* <Image
           source={AppImages.hamburgerImage} // Path to your hamburger icon
          style={styles.hamburgerIcon}
        /> */}
       {/* <Image source={AppImages.SplashScreenLogo} style={styles.parcalLogo} resizeMode='contain' /> */}
       </View>

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
    // padding: 5,
    paddingHorizontal:5,
    backgroundColor: Colors.homeBackground
    
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
  parcalLogo: {
    width: 60,
    height: 60,
  },
});

export default DashboardScreen;
