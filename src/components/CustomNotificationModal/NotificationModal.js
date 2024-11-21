// CustomNotificationModal.js
import React, {useEffect, useState} from 'react';
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
import {
  hitGetDriverDetails,
  hitGetPartner,
  hitlPaceOrder,
  hitMyVehicle,
  hitUpdateOrderOtpApi,
} from '../../config/api/api';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setDriverId,
  setOrderData,
  setlivetripmenu,
  setnextOrderData,
  setupdate_order,
} from '../../redux/HitApis/HitApiSlice';
import {io} from 'socket.io-client';
import {
  generateNumericOTP,
  GetDriverCurrentLocation,
} from '../../common/CommonFunction';
import {socketUrl} from '../../config/url';
import BorderLine from '../../common/BorderLine.';
import AppImages from '../../common/AppImages';
import Loading from '../Loading/Loading';
import * as Progress from 'react-native-progress';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Svg from 'react-native-svg';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Line from '../Line/Line';
import CircularProgressComponent from './CircularProgress';
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
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const order_date = new Date();
  const goods_quantity = 1;
  const pay_mode = 'cash';
  const payment_status = 'pending';
  const store_data = useSelector(state => state?.parsalPartner);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const user_data = parsedUser?.payload?.driver_id;
        socket = io(socketUrl); // Replace with your actual socket server URL
        socket.emit('registerUser', {
          userId: driverId || user_data,
          role: 'driver',
        });
        // On successful connection
        socket.on('connect', () => {
          console.log('Connected to socket server');
        });
        // Listen for order_accepted event
        socket.on('order_accepted', data => {
          console.log('Order accepted status received:', data);
          setModalVisible(false); // Close the modal
        });
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    if (isVisible) {
      initializeSocket(); // Call the async function inside useEffect
    }

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [isVisible, driverId]); // Add driverId as dependency if it's dynamic

  const handleAccept = async () => {
    try {
      // Show loading
      setLoading(true);
      const {latitude, longitude} = await GetDriverCurrentLocation();

      // Create payload
      const payload = {
        pickup_address,
        drop_address,
        vehicle_type_id: vehicle_type_id,
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
        request_id,
        insured,
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
            custName: cust_name,
            custMobile: cust_mobile,
            vehicle_type_id: vehicle_type_id,
          };
          // Emit 'driver_accept' event and send the data
          socket.emit('driver_accept', resWithOTP, acknowledgment => {
            console.log('Data sent, acknowledgment:', acknowledgment);
          });
          const param = {
            order_id: resWithOTP?.newOrder?.id,
            order_otp: resWithOTP?.otp?.toString(),
          };
          hitUpdateOrderOtpApi(param)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
          if (store_data?.orderData == null) {

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
            return;
          } else {
            dispatch(setlivetripmenu(true));
            dispatch(setnextOrderData(resWithOTP));
            return;
          }
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
  // const [user_details, setuser_details] = useState([]);
  // const get_user_details = async () => {
  //   const user = await AsyncStorage.getItem('user');
  //   const parsed_user = JSON.parse(user);
  //   if (parsed_user?.payload?.owner_type == 0) {
  //     hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
  //       .then(res => {
  //         setuser_details(res?.drivers[0]);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } else {
  //     hitGetPartner({
  //       partner_id: parsed_user?.payload?.partner_id,
  //     })
  //       .then(res => {
  //         let userDetails = res?.partner;

  //         if (parsed_user?.payload?.owner_type == 2) {
  //           hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
  //             .then(driverRes => {
  //               const driverDetails = driverRes?.drivers[0];
  //               if (driverDetails) {
  //                 // Add the working_status object to the user details
  //                 userDetails = {
  //                   ...userDetails,
  //                   working_status: driverDetails.working_status,
  //                   vehicle_type_id: driverDetails?.vehicle_type_id,
  //                 };
  //               }
  //               // Update user details with the new object

  //               setuser_details(userDetails);
  //             })
  //             .catch(err => {
  //               console.log(err);
  //             });
  //         } else {
  //           // If owner_type is not 2, just set the partner details
  //           setuser_details(userDetails);
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err);
  //       });
  //   }
  // };
  // useEffect(() => {
  //   get_user_details();
  // }, [isEnabled, dispatch]);
  // const [isEnabled, setIsEnabled] = useState(
  //   user_details?.working_status == 0 ? false : true,
  // );
  // // Update isEnabled whenever user_details changes
  // useEffect(() => {
  //   setIsEnabled(user_details?.working_status == 0 ? false : true);
  // }, [user_details, dispatch]);

  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible && store_data?.is_online}
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

            <View style={{alignSelf: 'center'}}>
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
                    <View style={styles.redCircle}>
                      <View style={styles.blackCircle}></View>
                    </View>
                  </View>
                )}
                <View style={{marginLeft: responsiveWidth(5)}}>
                  <Text style={[styles.addressText, {marginVertical: 0}]}>
                    {pickup_address}
                  </Text>
                  <Text style={styles.addressText}>{drop_address}</Text>
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
                <Text style={[styles.buttonText, {color: Colors.white}]}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
                <Text style={[styles.buttonText, {color: Colors.grey}]}>
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
    shadowOffset: {width: 0, height: 2},
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
});

export default NotificationModal;
