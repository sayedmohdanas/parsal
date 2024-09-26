// CustomNotificationModal.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Image } from 'react-native';
import Colors from '../../common/Colors';
import { hitlPaceOrder, hitMyVehicle } from '../../config/api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setDriverId, setOrderData } from '../../redux/HitApis/HitApiSlice';
import { io } from 'socket.io-client';
import { generateNumericOTP, GetDriverCurrentLocation } from '../../common/CommonFunction';
import { socketUrl } from '../../config/url';
import BorderLine from '../../common/BorderLine.';
import AppImages from '../../common/AppImages';
import Loading from '../Loading/Loading';
let socket;
const NotificationModal = ({ setModalVisible, isVisible, onAccept, driverId, onReject, title, body, pickup_address, drop_address, onClose, drop_lat, drop_long, pickup_lat, pickup_long, vehicle_id, cust_id, goods_type_id, expected_price, expected_distance, expected_time }) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  // const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  // const update_order = useSelector(state => state?.parsalPartner?.update_order || null);
  const dispatch = useDispatch()
  const order_date = new Date()
  const goods_quantity = 1
  const pay_mode = 'cash'
  const payment_status = 'pending'
  //  console.log(orderData,'order-data-from-notification')
  useEffect(() => {

    socket = io(socketUrl); // Replace with your server URL
    socket.emit('registerUser', { userId: driverId, role: 'driver' });
    // On successful connection
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('order_accepted', (data) => {
      console.log('Order accepted status received:');
      setModalVisible(false)
    });
    // Clean up when the component is unmounted
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [isVisible]);

  // const handleAccept = async () => {

  //   const { latitude, longitude } = await GetDriverCurrentLocation();

  //   // Create payload
  //   const payload = {
  //     pickup_address,
  //     drop_address,
  //     drop_lat,
  //     drop_long,
  //     pickup_lat,
  //     pickup_long,
  //     driver_lat: latitude,
  //     driver_long: longitude,

  //     vehicle_id,
  //     cust_id: Number(cust_id),
  //     driver_id: driverId,
  //     goods_type_id,
  //     order_date,
  //     goods_quantity,
  //     pay_mode,
  //     payment_status,

  //   };

  //   try {
  //     // Pass the payload into the API call
  //     setLoading(true)
  //     const res = await hitlPaceOrder(payload); // Your API call function

  //     if (res) {
  //       // Assuming `onAccept` is a callback for successful orders
  //       onAccept(res);



  //       // Now emit the socket event after a successful API call
  //       if (socket && socket.connected) {
  //         // const data = {
  //         //   driverId: driverId, // Use actual driver ID
  //         //   status: 'accepted',
  //         //   orderId: res.orderId, // Include additional data if needed (e.g., order ID)
  //         //   pickup_lat: payload.pickup_lat,
  //         //   pickup_long: payload.pickup_long,
  //         //   drop_lat: payload.drop_lat,
  //         //   drop_long: payload.drop_long,
  //         //   cust_id: Number(cust_id), 

  //         // };
  //         const resWithOTP = {
  //           ...res,
  //           otp: generateNumericOTP(4), 
  //         };
  //         // Emit 'driver_accept' event and send the data
  //         socket.emit('driver_accept', resWithOTP, (acknowledgment) => {
  //           console.log('Data sent, acknowledgment:', acknowledgment);

  //         });

  //         dispatch(setOrderData(resWithOTP))
  //         navigation.navigate("DriverMap", {
  //           picklat: payload.pickup_lat,
  //           pickLong: payload.pickup_long,
  //           drop_lat: payload.drop_lat,
  //           drop_long: payload.drop_long,
  //         });

  //       } else {
  //         console.error('Socket is not connected.');
  //       }

  //     } else {
  //       Alert.alert('Error', 'Failed to accept order. Please try again.');
  //       console.error('API Error:', res);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'There was an issue processing your request.');
  //     console.error('Error hitting API:', error);
  //   }
  // };
  const handleAccept = async () => {
    try {
      // Show loading
      setLoading(true);

      const { latitude, longitude } = await GetDriverCurrentLocation();

      // Create payload
      const payload = {
        pickup_address,
        drop_address,
        drop_lat,
        drop_long,
        pickup_lat,
        pickup_long,
        driver_lat: latitude,
        driver_long: longitude,
        vehicle_id,
        cust_id: Number(cust_id),
        driver_id: driverId,
        goods_type_id,
        order_date,
        goods_quantity,
        pay_mode,
        payment_status,
      };

      // Pass the payload into the API call
      const res = await hitlPaceOrder(payload); // Your API call function

      if (res) {
        // Assuming `onAccept` is a callback for successful orders
        onAccept(res);

        // Emit the socket event after a successful API call
        if (socket && socket.connected) {
          const resWithOTP = {
            ...res,
            otp: generateNumericOTP(4),
          };

          // Emit 'driver_accept' event and send the data
          socket.emit('driver_accept', resWithOTP, (acknowledgment) => {
            console.log('Data sent, acknowledgment:', acknowledgment);
          });

          dispatch(setOrderData(resWithOTP));
          navigation.navigate("DriverMap", {
            picklat: payload.pickup_lat,
            pickLong: payload.pickup_long,
            drop_lat: payload.drop_lat,
            drop_long: payload.drop_long,
          });
        } else {
          console.error('Socket is not connected.');
        }
      } else {
        Alert.alert('Error', 'Failed to accept order. Please try again.');
        console.error('API Error:', res);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an issue processing your request.');
      console.error('Error hitting API:', error);
    } finally {
      // Hide loading
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Image
                source={AppImages.SplashScreenLogo}
                style={styles.parcalLogo}
                resizeMode='contain'
              />
              <TouchableOpacity onPress={onReject} style={{ backgroundColor: Colors.grey, paddingHorizontal: 4, borderRadius: 5, elevation: 0.3, }}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.priceText}>₹{expected_price}</Text>

            <View style={styles.ratingContainer}>
              <Image source={AppImages.starImage} style={styles.starImg} />
              <Text style={styles.ratingText}>4.9</Text>
              <Text style={styles.payText}>{pay_mode}</Text>

            </View>

            <View style={styles.bodyContainer}>
              <View style={{ marginLeft: 16, flexDirection: 'row' }}>
                {/* <Text style={styles.bodyText}> 2 min, 2.8 km distance</Text> */}
                <Text style={styles.bodyText}> {`${expected_time},`}</Text>
                <Text style={styles.kmText}> {`${expected_distance} km `}</Text>


              </View>



              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8
              }}>

                <View style={[styles.timelineContainer]}>
                  <View style={styles.greenCircle}></View>
                  <View style={styles.line}></View>
                  <View style={styles.redCircle}>
                    <Image source={AppImages.location} style={styles.locImg} />

                  </View>
                </View>
                <View style={{}}>
                  <Text style={[styles.addressText, { marginVertical: 0 }]}>{pickup_address}</Text>

                  <Text style={styles.addressText}>{drop_address}</Text>
                </View>
              </View>
            </View>
            {/* <View style={styles.lineContainer}>
          </View> */}

            <TouchableOpacity style={styles.roundButton} onPress={handleAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Loading loading={loading} />
    </>

  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundColor: 'green',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  parcalLogo: {
    width: 70,
    height: 50, // Adjust according to your logo size
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  priceText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'black',
    // marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5
  },
  starImg: {
    width: 15,
    height: 15, // Adjust according to your star image size
    // marginRight: 3,
  },
  locImg: {
    width: 20,
    height: 20, // Adjust according to your star image size
    // marginRight: 3,
  },
  ratingText: {
    color: 'grey',
    fontSize: 10,
    color: 'black'
  },
  payText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500'
  },
  bodyContainer: {
    // alignItems: 'center',
    marginBottom: 10,
    // paddingBottom:10,
    // flexDirection: 'row',
    // backgroundColor:'red',
    // paddingHorizontal:40,
    paddingRight: 50,
    // justifyContent:'flex-start'
  },
  bodyText: {
    color: 'black',

  },
  kmText: {
    fontWeight: '500',
    color: 'black',

  },
  addressText: {
    // textAlign: 'center',
    fontSize: 15,
    // paddingVertical:20,
    fontWeight: '500',
    // marginBottom: 10,
    marginVertical: 14,
    color: 'black',


  },
  lineContainer: {
    width: '100%',
    // flexDirection: 'row',
    justifyContent: 'center',
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '90%', // Adjust the width as necessary
    marginVertical: 10,
  },
  roundButton: {
    backgroundColor: '#3D40D1',
    padding: 10,
    borderRadius: 5, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  timelineContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor:'yellow',
    marginTop: 5

    // justifyContent:'flex-start',
  },
  textInputContainers: {
    flex: 9,
    // backgroundColor: "red"
  },
  greenCircle: {
    height: 10,
    width: 10,
    backgroundColor: 'green',
    borderRadius: 20,
  },
  redCircle: {
    // height: 10,
    // width: 10,
    // backgroundColor: 'red',
    // borderRadius: 20,
  },
  line: {
    borderLeftWidth: 1,
    height: 55,
    marginVertical: 1,
    borderStyle: 'dashed',
  },
});


export default NotificationModal;
