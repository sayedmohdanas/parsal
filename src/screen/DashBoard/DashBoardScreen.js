import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VehicleProfileCard from './components/VehicleprofileCard';
import Colors from '../../common/Colors';
import OnlineButton from './components/OnlineButton';
import OfflineButton from './components/OfflineButton';
import { GetDriverCurrentLocation, GetDriverCurrentLocation2, requestLocationPermission } from '../../common/CommonFunction';
import { hitUpdateDriverStatus } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileSection from '../DriverMapScreen/ProfileSecrion';
import { useSelector } from 'react-redux';
const DashboardScreen = ({ route }) => {



  const [isOnline, setIsOnline] = useState(false); 
  const navigation = useNavigation();

  const toggleOnlineStatus = async () => {
    try {
      const unparse_driver_data = await AsyncStorage.getItem("driver_data");
      const parse_data = JSON.parse(unparse_driver_data);
      console.log(parse_data.driver_id,'parss---');

      
      
      setIsOnline(prevStatus => !prevStatus);
      if (!isOnline) {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          "driver_id": parse_data?.driver_id,
          "current_lat": latitude,
          "current_long": longitude,
          "working_status": 1
        };
        const res = await hitUpdateDriverStatus(param);
      } else {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          "driver_id": parse_data?.driver_id,
          "current_lat": latitude,
          "current_long": longitude,
          "working_status": 0
        };
        const res = await hitUpdateDriverStatus(param);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const [driverData, setDriverData] = useState(null); 
  useEffect(() => {
    // Define an inner async function
    const fetchDriverData = async () => {
        try {
            // Request location permission
            const locationGranted = await requestLocationPermission();
            if (!locationGranted) {
                console.error('Location permission denied');
                return;
            }

            // Fetch data from AsyncStorage
            const unparsedDriverData = await AsyncStorage.getItem("driver_data");
            if (unparsedDriverData) {
                const parsedData = JSON.parse(unparsedDriverData);
                setDriverData(parsedData); 
                 console.log(parsedData,'dataaaa')
                // Set the parsed data to state
            } else {
                console.warn("No driver data found in AsyncStorage");
            }
        } catch (error) {
            console.error("Error fetching driver data:", error);
        }
    };

    // Call the async function inside useEffect
    fetchDriverData();
}, []); // Empty dependency array ensures this runs only once

  ;
  

  return (
    <>
    <View style={styles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.hamburgerButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {/* Hamburger icon and logo can be added here */}
        </View>
      </TouchableOpacity>

      {/* Vehicle Profile Card or other dashboard content */}
      <VehicleProfileCard screen={true} isOnline={isOnline} vehicle_data={driverData} />
     

      {/* Bottom Toggle Buttons Section */}
      <View style={[
        styles.bottomSection,
        { backgroundColor: !isOnline ? '#393E41' : '#fff' }
      ]}>
       {isOnline ? (
          <OfflineButton toggleStatus={toggleOnlineStatus} />
        ) : (
          <OnlineButton toggleStatus={toggleOnlineStatus} />
        )} 
       
        </View>
    </View>
          {/* <ProfileSection /> */}
           </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 5,
    backgroundColor: Colors.homeBackground, // Keeping the main background color
  },
  hamburgerButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    flexDirection: 'row',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // paddingTop:40,
    // paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center', // Center buttons horizontally
    justifyContent: 'center', // Center buttons vertically
  },
});

export default DashboardScreen;

