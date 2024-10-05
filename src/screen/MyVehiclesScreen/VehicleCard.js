// VehicleCard.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import { formatVehicleNumber } from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getDriverDetails, setDriverId } from '../../redux/HitApis/HitApiSlice';

const VehicleCard = ({ vehicle, onPress }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  // const hasDriver = vehicle?.driver?.driver_name;
    //  const handleDriverDetails= async()=>{

    //   AsyncStorage.setItem("driver_data", JSON.stringify(vehicle))
    //   console.log(vehicle?.driver_id);
    //   const resultAction = await dispatch(getDriverDetails({ids:[vehicle?.driver_id]}));
    //  console.log(resultAction,'ressssssss');
     
    //   // const response = getDriverDetails(vehicle?.driver?.driver_id)
    //   // console.log(response)
    //   navigation.navigate('Dashboards')
    //   // console.log('anas======>',vehicle);
      
    //   dispatch(setDriverId(vehicle))
    //  }

    const hasDriver = !!vehicle?.driver?.driver_name; // Check if driver_name exists and convert to a boolean

    const handleDriverDetails = async () => {
      // Store driver data in AsyncStorage
      await AsyncStorage.setItem("driver_data", JSON.stringify(vehicle));
      
      // If vehicle has a driver, get driver details
      if (hasDriver) {
        console.log('anssssssssaaaaa======>>>>>>',vehicle?.driver_id);
    
        // Dispatch the action to fetch driver details
        const resultAction = await dispatch(getDriverDetails({ ids: [vehicle?.driver_id] }));
        console.log(resultAction, 'Driver details fetched');
    
        // Navigate to the Dashboard
        navigation.navigate('Dashboards');
      } else {
        // If no driver, navigate to DriverDetail screen
        onPress(vehicle?.id)
        // navigation.navigate('DriverDetail', { vehicleId: vehicle?.id });
      }
    
      // Optionally dispatch the driver ID to the store
      dispatch(setDriverId(vehicle));
    };

  return (
    <TouchableOpacity onPress={handleDriverDetails}>
      {/* <TouchableWithoutFeedback 
  onPress={() => {
    console.log('Navigating with vehicle:', vehicle);  // Log vehicle before navigating
    navigation.navigate('Dashboards', { data: vehicle });
  }}
> */}
      {/* <TouchableWithoutFeedback
  onPress={() => {
    navigation.navigate('Dashboards', { testParam: 'Hello World' });
  }}
>  */}
      <View style={styles.card}>
        <View style={styles.topSection}>
          <View style={styles.leftSection}>
            <Text
              style={styles.vehicleNumber}>
              {formatVehicleNumber(vehicle?.vehicle_number) || 'N/A'}
            </Text>
            <View style={styles.contactContainer}>
              <Text style={styles.name}>
                {vehicle?.driver?.driver_name
                  ? `${vehicle.driver.driver_name.charAt(0).toUpperCase()}${vehicle.driver.driver_name.slice(1)},`
                  : 'No Driver Assigned'}
              </Text>

              <Text style={styles.contact}>
                {vehicle?.driver?.phone || ' | N/A'}
              </Text>
            </View>
          </View>
          {hasDriver && (
            <View style={styles.rightSection}>
              <Text style={styles.status}>Verifying</Text>
            </View>
          )}
        </View>

        {hasDriver && (
          <View style={styles.bottomSection}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Partner training pending</Text>
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/coach.png')}
              style={styles.image}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // position: 'relative',
    // padding: 16,
    borderRadius: 5,
    // borderWidth: 1,
    // shadowColor: '#000',
    // marginTop: 10,
    marginVertical: 7,
    backgroundColor: 'white',
    flex: 1,
    elevation: 0.5,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 40,
    flex: 1,
    padding: 16,
    // backgroundColor:'aqua'
  },
  leftSection: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  contact: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    // paddingVertical:4,
    backgroundColor: '#FFAE42',
    // height: 24,
    // marginTop: 5,
    marginVertical: 10,
    // paddingHorizontal:10
  },
  status: {
    fontSize: 12,
    // fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  bottomSection: {
    // position: 'absolute', // Absolute positioning
    // bottom: 0, // Aligns to the bottom of the card
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue, // Optional: background color for bottomSection
    paddingHorizontal: 16, // Optional: horizontal padding for content
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0.2, // Optional: vertical padding for content
  },
  linkText: {
    fontSize: 12,
    color: '#FFFFFF', // Link color
    // textDecorationLine: 'underline', // Underline text to look like a link
  },
  image: {
    width: 20, // Adjust size as needed
    height: 20,
  },
});

export default VehicleCard;
