// CustomNotificationModal.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Colors from '../../common/Colors';
import { hitlPaceOrder, hitMyVehicle } from '../../config/api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setDriverId } from '../../redux/HitApis/HitApiSlice';

const NotificationModal = ({ isVisible, onAccept,driverId, onReject, title, body, onClose,drop_lat,drop_long,pickup_lat,pickup_long,vehicle_id,cust_id,goods_type_id }) => {
   const navigation =useNavigation()
   const dispatch = useDispatch()
   const [driver_id, setDriverData] = useState(); 
   
  //  console.log(driver_id,'dataatkkkktttt')
   const order_date = new Date()
   const goods_quantity=1
   const pay_mode='cash'
   const payment_status='pending'
   const pickup_address="abc"
   const  drop_address='cba'
   useEffect(() => {
    // Define an inner async function
    const fetchDriverData = async () => {
        try {
            // Request location permission
            // const locationGranted = await requestLocationPermission();
            // if (!locationGranted) {
            //     console.error('Location permission denied');
            //     return;
            // }

            // Fetch data from AsyncStorage
            const unparsedDriverData = await AsyncStorage.getItem("driver_data");
            if (unparsedDriverData) {
                const parsedData = JSON.parse(unparsedDriverData);
                setDriverData(parsedData.driver_id);
                 // Set the parsed data to state
                // dispatch(setDriverId(parsedData.driver_id))
            } else {
                console.warn("No driver data found in AsyncStorage");
            }
        } catch (error) {
            console.error("Error fetching driver data:", error);
        }
    };

    fetchDriverData();
}, []); 


const handleAccept = async () => {
  // Create payload
  const payload = {
    pickup_address,
    drop_address,
    drop_lat,
    drop_long,
    pickup_lat,
    pickup_long,
    vehicle_id,
    cust_id: Number(cust_id), 
    driver_id:driverId,
    goods_type_id,
    order_date,
    goods_quantity,
    pay_mode,
    payment_status
  };

  console.log('payload ==>', payload)

  try {
    // Pass the payload into the API call
    const res = await hitlPaceOrder(payload);

    console.log('API Response:', res);

    if (res) {
      // Assuming `onAccept` is a callback for successful orders
      onAccept(res);

      // Navigate to the next screen
      navigation.navigate("DriverMap", {
        picklat: payload.pickup_lat,
        pickLong: payload.pickup_long,
        drop_lat: payload.drop_lat,
        drop_long: payload.drop_long,
      });

      // Show success alert
      Alert.alert('Success', 'Order accepted successfully');
    } else {
      // Handle case where response is not successful
      Alert.alert('Error', 'Failed to accept order. Please try again.');
      console.error('API Error:', res);
    }
  } catch (error) {
    // Handle error from API
    Alert.alert('Error', 'There was an issue processing your request.');
    console.error('Error hitting API:', error);
  }
};

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonReject} onPress={onReject}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAccept} onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 5, // Updated border radius
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:Colors.black
  },
  body: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color:Colors.black

  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonReject: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonAccept: {
    backgroundColor: '#3D40D1', // Updated background color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Updated text color
    fontWeight: 'bold',
  },
});

export default NotificationModal;
