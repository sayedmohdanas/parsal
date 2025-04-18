// CustomNotificationModal.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Image,
} from 'react-native';
import Colors from '../../common/Colors';
import { hitlPaceOrder, hitUpdateOrderOtpApi } from '../../config/api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDriverId,
  setOrderData,
  setStops,
  setlivetripmenu,
  setnextOrderData,
  setupdate_order,
} from '../../redux/HitApis/HitApiSlice';
import { io } from 'socket.io-client';
import {
  generateNumericOTP,
  GetDriverCurrentLocation,
} from '../../common/CommonFunction';
import { placeOrder, socketUrl } from '../../config/url';
import BorderLine from '../../common/BorderLine.';
import AppImages from '../../common/AppImages';
import Loading from '../Loading/Loading';
import * as Progress from 'react-native-progress';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Line from '../Line/Line';
import CircularProgressComponent from './CircularProgress';
import database from '@react-native-firebase/database';

let socket;
const NotificationModal = ({
  setModalVisible,
  isVisible,
  onAccept,
  driverId,
  onReject,
  title,
  body,
  pickup_address,
  drop_address,
  onClose,
  drop_lat,
  drop_long,
  pickup_lat,
  pickup_long,
  vehicle_id,
  cust_id,
  goods_type_id,
  expected_price,
  expected_distance,
  expected_time,
  cust_name,
  cust_mobile,
  vehicle_type_id,
  timer,
  request_id,
  insured,
  loading_unloading,
  charity,
  receiver_name,
  receiver_phone,
  tips,
  good_type,
  service_city,
  stops,
  stops_length,
  last_stop_address,
  order_type
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const order_date = new Date();
  const goods_quantity = 1;
  const pay_mode = 'cash';
  const payment_status = '0';
  const store_data = useSelector(state => state?.parsalPartner);
  const socketRef = useRef(null);


  const sendDummyDataToFirebase = async (data, message, type) => {
    console.log('data====>', data)
    try {
      // Prepare your dummy data payload
      const notificationPayload = {
        order_id: data?.newOrder?.id,
        driver_id: data?.newOrder?.driver_id,
        customer_id: data?.newOrder?.cust_id,
        message: message || 'This is a dummy notification.',
        timestamp: new Date().toISOString(),
        type: type || 1, // Assuming '1' is the type for a rating request
        order_data: data
      };
      console.log('notificationPayload', notificationPayload);
      // Define the path to send the data
      const customerPath = `customers/${data?.newOrder?.cust_id}/notifications`;
      
      console.log('customer path=>', customerPath);
      // Send the data to Firebase
      await database().ref(customerPath).push(notificationPayload);

      console.log('NOtification data sent successfully!');
    } catch (error) {
      console.error('Error sending dummy data to Firebase:', error);
    }
  };



  useEffect(() => {
    const initializeSocket = async () => {
      try {
        if (!socketRef.current) {
          const user = await AsyncStorage.getItem('user');
          const parsedUser = JSON.parse(user);
          const user_data = parsedUser?.payload?.driver_id;

          socketRef.current = io(socketUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
          });

          socketRef.current.once('connect', () => {
            console.log('Connected to socket server');

            socketRef.current.emit('registerUser', {
              userId: driverId || user_data,
              role: 'driver',
            });
          });

          socketRef.current.on('order_accepted', data => {
            console.log('Order accepted status received:', data);
            setModalVisible(false); // This could trigger unmount
          });

          socketRef.current.on('disconnect', reason => {
            console.log('Socket disconnected. Reason:', reason);
          });

          socketRef.current.on('connect_error', error => {
            console.log('Socket connection error:', error);
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    // Only disconnect on full component unmount
    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //     socketRef.current = null;
    //   }
    // };
  }, []); // <- only on mount


  const handleAccept = async () => {
    try {
      setLoading(true);

      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      const { latitude, longitude } = await GetDriverCurrentLocation();

      const payload = {
        pickup_address,
        drop_address,
        vehicle_type_id,
        drop_lat,
        drop_long,
        pickup_lat,
        pickup_long,
        driver_lat: latitude,
        driver_long: longitude,
        vehicle_id: parseInt(vehicle_id),
        cust_id: Number(cust_id),
        driver_id: driverId,
        goods_type_id,
        order_date,
        goods_quantity,
        pay_mode,
        payment_status,
        partner_id: parsedUser?.payload?.partner_id,
        request_id,
        insured,
        loading_unloading,
        charity,
        receiver_phone,
        receiver_name,
        tips: parseFloat(tips),
        good_type,
        service_city,
        stops: JSON.parse(stops),
        order_type: Number(order_type),
      };

      console.log('Payload:', payload);

      // Call API
      const res = await hitlPaceOrder(payload);
      console.log('API Response:', res);

      if (res) {
        onAccept(res);

        // Emit socket event only if connected

        if (socketRef.current && socketRef.current.connected) {
          console.log('Reconnecting socket before emitting...');
          const resWithOTP = {
            ...res,
            otp: generateNumericOTP(4),
            custName: cust_name,
            custMobile: cust_mobile,
            vehicle_type_id,
          };

        await  sendDummyDataToFirebase(resWithOTP, 'dummy data to firebase', 6)

          // socketRef.current.emit('driver_accept', resWithOTP, acknowledgment => {
          //   console.log('Data sent, acknowledgment:', acknowledgment);
          // });

          // Update order OTP
          const param = {
            order_id: resWithOTP?.newOrder?.id,
            order_otp: resWithOTP?.otp?.toString(),
          };
          await hitUpdateOrderOtpApi(param);

          // Handle navigation & state updates
          if (!store_data?.orderData) {
            dispatch(setlivetripmenu(true));
            dispatch(setOrderData(resWithOTP));
            if (store_data?.update_order?.is_arrived_pickup) {
              dispatch(setupdate_order(res?.newOrder));
            }
            navigation.navigate('DriverMap', {
              picklat: payload.pickup_lat,
              pickLong: payload.pickup_long,
              drop_lat: payload.drop_lat,
              drop_long: payload.drop_long,
            });
          } else {
            dispatch(setlivetripmenu(true));
            dispatch(setnextOrderData(resWithOTP));
          }
        } else {
          console.error('Socket is not connected.');
        }
      } else {
        Alert.alert('Error', 'Failed to accept order. Please try again.');
      }
    } catch (error) {
      console.error('Error hitting API:', error);
      Alert.alert('Error', 'There was an issue processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={
          isVisible &&
          store_data?.is_online &&
          !(store_data?.orderData && store_data?.nextOrderData)
        }
        animationType="slide"
        onRequestClose={onClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: responsiveFontSize(16),
                  color: '#232323',
                  fontWeight: '600',
                  lineHeight: 19.36,
                }}>
                New Order
              </Text>

              <BorderLine margin={10} thickness={0.5} />
            </View>

            <View style={{ alignSelf: 'center' }}>
              <CircularProgressComponent
                timer={timer}
                setModalVisible={setModalVisible}
              />
            </View>
            <View></View>

            <View style={styles.bodyContainer}>
              {expected_price && (
                <Text style={styles.priceText}>
                  ₹{parseFloat(expected_price).toFixed(2)}
                </Text>
              )}
              <View
                style={{
                  marginLeft: responsiveHeight(0),
                  flexDirection: 'row',
                  marginTop: responsiveHeight(20),
                  marginBottom: responsiveHeight(8),
                }}>
                {expected_time && (
                  <Text style={styles.bodyText}> {`${expected_time},`}</Text>
                )}
                {expected_distance && (
                  <Text style={styles.bodyText}>
                    {' '}
                    {`${expected_distance} km `}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                }}>
                {expected_price && (
                  <View style={[styles.timelineContainer]}>
                    <View style={styles.greenCircle}></View>
                    <View style={styles.line}></View>


                    {Number(stops_length) > 0 && <View style={styles.stopNumberContainer}>
                      <Text style={styles.stopNumberText}>{stops_length}</Text>
                    </View>
                    }


                    <View style={styles.redCircle}>
                      <View style={styles.blackCircle}></View>
                    </View>
                  </View>
                )}

                <View style={{ marginLeft: responsiveWidth(5) }}>
                  <Text
                    style={[styles.addressText, { marginVertical: 0 }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {pickup_address}
                  </Text>
                  <Text
                    style={styles.addressText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {last_stop_address !== '-' ? last_stop_address : drop_address}
                  </Text>

                </View>

              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: responsiveHeight(20),
              }}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={handleAccept}>
                <Text style={[styles.buttonText, { color: Colors.white }]}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
                <Text style={[styles.buttonText, { color: Colors.grey }]}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  headerContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: responsiveWidth(3),
    marginTop: responsiveHeight(10),
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
    fontSize: responsiveFontSize(30),
    fontWeight: '700',
    lineHeight: 36.31,
    color: 'black',
    // marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
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
    color: 'black',
  },
  payText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
  },
  bodyContainer: {
    // alignItems: 'center',
    marginBottom: responsiveHeight(17),
    marginLeft: responsiveWidth(10),
    // borderTopWidth:1,
    marginTop: responsiveHeight(15),
    paddingRight: 50,
  },
  bodyText: {
    fontSize: responsiveFontSize(14),
    color: '#232323',
    fontWeight: '500',
    lineHeight: 16.94,
  },
  kmText: {
    fontWeight: '500',
    color: 'black',
  },
  addressText: {
    fontSize: responsiveFontSize(15),
    fontWeight: '500',
    marginVertical: 14,
    color: '#232323',
    lineHeight: 19.36,
  },
  lineContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '90%', // Adjust the width as necessary
    marginVertical: 10,
  },
  roundButton: {
    backgroundColor: '#232323',
    padding: 12,
    borderRadius: 30, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    // marginTop: 10,
  },
  rejectButton: {
    // backgroundColor: '#232323',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 30, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    // marginTop: 10,
  },
  buttonText: {
    // color: Colors.grey,
    fontWeight: '400',
    fontSize: responsiveFontSize(16),
    lineHeight: 19.36,
  },

  timelineContainer: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor:'yellow',
    marginTop: 5,

    // justifyContent:'flex-start',
  },
  textInputContainers: {
    flex: 9,
    // backgroundColor: "red"
  },
  greenCircle: {
    height: responsiveWidth(8),
    width: responsiveWidth(8),
    backgroundColor: Colors.brandBlue,
    borderRadius: 20,
  },
  blackCircle: {
    height: responsiveWidth(5),
    width: responsiveWidth(5),
    backgroundColor: Colors.black,
    borderRadius: 20,
  },
  redCircle: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D8D8D8',
    borderWidth: 1.5,
    borderRadius: 50,
  },
  line: {
    borderLeftWidth: 1,
    height: responsiveHeight(50),
    marginVertical: 1,
    borderStyle: 'dashed',
  },
  stopNumberContainer: {
    position: 'absolute',
    top: 25, // Adjust to center vertically
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationModal;
