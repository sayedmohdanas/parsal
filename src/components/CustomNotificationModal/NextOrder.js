// CustomNextOrder.js
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
import {hitCancelOrder} from '../../config/api/api';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setOrderData, setnextOrderData} from '../../redux/HitApis/HitApiSlice';
import {io} from 'socket.io-client';
import {calculateDistanceAndTime, successToast} from '../../common/CommonFunction';
import {socketUrl} from '../../config/url';
import BorderLine from '../../common/BorderLine.';
import AppImages from '../../common/AppImages';
import Loading from '../Loading/Loading';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import DriverInformation from '../../screen/DashBoard/components/DriverInformation';
import CancelRideModal from '../CancelRideModal/CancelRideModal';
import database from '@react-native-firebase/database';

let socket;
const NextOrder = ({isVisible, driverId, onClose, setnextordermodal}) => {
  const sendDummyDataToFirebase = async (data, message, type) => {
    // console.log('nextOrder-cancel===>>  data==>',data, 'message===>',message,'type====>', type,);
    
    try {
      // Prepare your dummy data payload
      const notificationPayload = {
        order_id: data?.id,
        driver_id: data?.driver_id,
        customer_id: data?.cust_id,
        message: message || 'This is a dummy notification.',
        timestamp: new Date().toISOString(),
        type: type || 1, // Assuming '1' is the type for a rating request
      };
      // Define the path to send the data
      const customerPath = `customers/${data?.cust_id}/notifications`;
      // console.log('cstmr==path==>',customerPath);
      
      // Send the data to Firebase
      // await database().ref(customerPath).push(notificationPayload);
      await database()
      .ref(customerPath)
      .push(notificationPayload)
      .then(() => {
        console.log('Dummy data sent successfully via .then()!');
      })
      .catch(error => {
        console.error('Error inside .then():', error);
      });
  
  
      console.log('Dummy data sent successfully!');
    } catch (error) {
      console.error('Error sending dummy data to Firebase:', error);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const user_data = parsedUser?.payload?.driver_id;

        // Initialize socket connection
        socket = io(socketUrl); // Replace with your actual socket server URL

        // Emit registerUser event with driverId or user_data
        socket.emit('registerUser', {
          userId: driverId || user_data,
          role: 'driver',
        });

        // On successful connection
        socket.on('connect', () => {
          console.log('Connected to socket server');
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

  const {nextOrderData, orderData} = useSelector(state => state?.parsalPartner);
  const [loading, setLoadig] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
const [selectedReason, setSelectedReason] = useState('');
const handleCancelRequest = () => {
  
  setModalVisible(true); // Open the modal
  setnextordermodal(false);

  console.log('modalVisible========>>>>>>>>>',modalVisible);
};
const confirmCancelOrder = async () => {
  try {
    // r
    setLoadig(true); 
    
    const param = {
      order_id: nextOrderData?.id || nextOrderData?.newOrder?.id,
    };

    const res = await hitCancelOrder(param);
    
    if (res) {
      socket.emit('cancel_order', {
        userId: nextOrderData.cust_id || nextOrderData?.newOrder?.cust_id,
        orderId: nextOrderData?.id || nextOrderData?.newOrder?.id,
        role: 'driver',
        reason: selectedReason || 'Customer requested cancellation',
      });

      setnextordermodal(false);
      sendDummyDataToFirebase(nextOrderData?.newOrder || nextOrderData, 'Order Cancel', 3);
      dispatch(setnextOrderData(null));

      // navigation.navigate('AmountCollected');
      successToast('Successful', 'Order Cancelled');
    }

  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
    console.error(error);
  } finally {
    setModalVisible(false); // Close the modal
    setLoadig(false);
  }
};

  // const handleCancelRequest = async () => {
  //   try {
  //     setLoadig(true);
  //     Alert.alert(
  //       'Cancel Order',
  //       'Are you sure you want to cancel this order?',
  //       [
  //         {
  //           text: 'No', // Do nothing on "No"
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Yes',
  //           onPress: async () => {
  //             // Handle the order cancellation logic here
  //             const param = {
  //               order_id: nextOrderData?.id || nextOrderData?.newOrder?.id,
  //             };
  //             const res = await hitCancelOrder(param);
  //             if (res) {
  //               socket.emit('cancel_order', {
  //                 userId: nextOrderData.cust_id || nextOrderData?.newOrder?.cust_id,
  //                 orderId:  nextOrderData?.id || nextOrderData?.newOrder?.id,
  //                 role: 'driver',
  //                 reason: 'Customer requested cancellation',
  //               });
  //               setnextordermodal(false);
  //               dispatch(setnextOrderData(null));
  //               successToast('Successfull', 'Order Cancel');
  //             }

  //             // Call API to cancel the order or update state
  //           },
  //         },
  //       ],
  //       {cancelable: false}, // Prevent closing the alert by tapping outside
  //     );
  //   } catch (error) {
  //     Alert.alert('Error', 'Something wwent wrong');
  //     console.error(error);
  //   } finally {
  //     setLoadig(false);
  //   }
  // };
  // console.log('===>', nextOrderData);
  return (
    <>
      <Modal
        transparent={true}
        visible={ isVisible}
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
                Next Pickup
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Image
                  source={AppImages.close}
                  style={{
                    height: responsiveHeight(14),
                    width: responsiveWidth(14),
                    marginRight: responsiveWidth(10),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <BorderLine color="#D8D8D8" margin={10} thickness={0.5} />

            <View style={{width: '100%'}}>
              <DriverInformation
                display_name={
                  nextOrderData?.customer?.cust_name ||
                  nextOrderData?.custName ||
                  ''
                }
                display_phone={
                  nextOrderData?.customer?.mobile ||
                  nextOrderData?.custMobile ||
                  ''
                }
                propStyle={{
                  manStyle: {
                    width: responsiveWidth(44),
                    height: responsiveWidth(44),
                    borderRadius: responsiveWidth(6),
                    marginRight: responsiveWidth(3),
                  },
                  userDetail: {
                    paddingHorizontal: responsiveWidth(8),
                  },
                }}
              />
            </View>
            <BorderLine color="#D8D8D8" margin={10} thickness={0.5} />

            <View style={styles.bodyContainer}>
              {nextOrderData && (
                <Text style={styles.priceText}>
                  ₹
                  {nextOrderData?.newOrder?.paid_amount ||
                    nextOrderData?.paid_amount ||
                    0}
                </Text>
              )}
              <View
                style={{
                  marginLeft: responsiveHeight(0),
                  flexDirection: 'row',
                  marginTop: responsiveHeight(20),
                  marginBottom: responsiveHeight(8),
                }}>
                {(nextOrderData?.newOrder?.drop_long ||
                  nextOrderData?.drop_long) && (
                  <Text style={styles.bodyText}>
                    {`${
                      calculateDistanceAndTime(
                        nextOrderData?.newOrder?.pickup_lat ||
                          nextOrderData?.pickup_lat,
                        nextOrderData?.newOrder?.pickup_long ||
                          nextOrderData?.pickup_long,
                        nextOrderData?.newOrder?.drop_lat ||
                          nextOrderData?.drop_lat,
                        nextOrderData?.newOrder?.drop_long ||
                          nextOrderData?.drop_long,
                      )?.travelTime || ''
                    },`}
                  </Text>
                )}
                {(nextOrderData?.newOrder?.drop_long ||
                  nextOrderData?.drop_long) && (
                  <Text style={styles.bodyText}>
                    {`${
                      calculateDistanceAndTime(
                        nextOrderData?.newOrder?.pickup_lat ||
                          nextOrderData?.pickup_lat,
                        nextOrderData?.newOrder?.pickup_long ||
                          nextOrderData?.pickup_long,
                        nextOrderData?.newOrder?.drop_lat ||
                          nextOrderData?.drop_lat,
                        nextOrderData?.newOrder?.drop_long ||
                          nextOrderData?.drop_long,
                      )?.distanceKm || ''
                    } km `}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                }}>
                {(nextOrderData?.newOrder?.paid_amount ||
                  nextOrderData?.paid_amount) && (
                  <View style={[styles.timelineContainer]}>
                    <View style={styles.greenCircle}></View>
                    <View style={styles.line}></View>
                    <View style={styles.redCircle}>
                      <View style={styles.blackCircle}></View>
                    </View>
                  </View>
                )}
                <View style={{marginLeft: responsiveWidth(5)}}>
                  <Text
                    numberOfLines={2}
                    style={[styles.addressText, {marginVertical: 0}]}>
                    {nextOrderData?.pickup_address ||
                      nextOrderData?.newOrder?.pickup_address ||
                      ''}
                  </Text>

                  <Text numberOfLines={2} style={styles.addressText}>
                    {nextOrderData?.drop_address ||
                      nextOrderData?.newOrder?.drop_address ||
                      ''}
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
                style={styles.rejectButton}
                onPress={handleCancelRequest}>
                <Text style={[styles.buttonText, {color: Colors.white}]}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CancelRideModal 
  visible={modalVisible} 
  hideModal={() => setModalVisible(false)}
  selectedReason={selectedReason}
  setSelectedReason={setSelectedReason}
  handleCancelOrder={confirmCancelOrder}
/>
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
    flexDirection: 'row',
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
    backgroundColor: '#FF4D4D',
    padding: 12,
    // borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: responsiveHeight(30), // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    marginTop: responsiveHeight(5),

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
    borderRadius: responsiveHeight(20),
  },
  blackCircle: {
    height: responsiveWidth(5),
    width: responsiveWidth(5),
    backgroundColor: Colors.black,
    borderRadius: responsiveHeight(20),
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

export default NextOrder;
