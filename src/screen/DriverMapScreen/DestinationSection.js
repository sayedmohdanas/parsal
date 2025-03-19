import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import BorderLine from '../../common/BorderLine.';
import {useDispatch, useSelector} from 'react-redux';
import {
  hitCancelOrder,
  hitEndOrderApi,
  hitUpdateDriverLocation,
  hitUpdateOrder,
} from '../../config/api/api';
import { io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { socketUrl } from '../../config/url';
import Loading from '../../components/Loading/Loading';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import SlideButton from 'rn-slide-button';
import database from '@react-native-firebase/database';
import { Spacing } from '../../common/Theme';
import DeliveryComponent from '../../components/DeliveryComponent/DeliveryComponent';

const sendDummyDataToFirebase = async (data, message, type) => {
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
    // Send the data to Firebase
    await database().ref(customerPath).push(notificationPayload);

    console.log('Dummy data sent successfully!');
  } catch (error) {
    console.error('Error sending dummy data to Firebase:', error);
  }
};
const DestinationSection = ({ details }) => {
  const [isSlid, setIsSlid] = useState(false);

  const navigation = useNavigation();
  const [loading, setLoadig] = useState(false);
  const [address, setAddress] = useState(details?.drop_address || 'N/A');

  const handleOpenMap = (latitude, longitude) => {
    const location = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `maps://app?daddr=${location}`, // For iOS devices
      android: `google.navigation:q=${location}`, // For Android devices
    });
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Error opening map: ', err),
      );
    }
  };
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  const socketRef = useRef()
  useEffect(() => {
    socketRef.current = io(socketUrl); // Initialize socket
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.emit('registerUser', {
      userId: orderData?.newOrder?.driver_id || orderData?.driver_id,
      role: 'driver',
    });

    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [socketUrl, orderData]);
  const store_data = useSelector(state => state);
  const driver_details = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
  const handleEndTrip = async () => {
    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
    });
    const param = {
      orderId: orderData?.newOrder?.id || orderData?.id,
      delivered_at: currentTime,
      partner_id:
        store_data?.parsalPartner?.loginuserdetails?.partner_id ||
        store_data?.parsalPartner?.loginuserdetails?.id,
      vehicle_type_id: driver_details?.vehicle_type_id,
    };
    hitEndOrderApi(param)
      .then(res => {
        if (res) {
          // socket.emit('end_trip', {
          //   userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
          //   order_id: orderData?.newOrder?.id || orderData?.id,
          // });
          // sendDummyDataToFirebase(
          //   orderData?.newOrder || orderData,
          //   'Order Ended',
          //   2,
          // );
          // navigation.navigate('AmountCollected');
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('end_trip', {
              userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
              order_id: orderData?.newOrder?.id || orderData?.id,
            });
            sendDummyDataToFirebase(
              orderData?.newOrder || orderData,
              'Order Ended',
              2,
            );
            navigation.navigate('AmountCollected');
          } else {
            console.log('Socket is not connected');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [selectedStopIndex, setSelectedStopIndex] = useState(null);
  const stops = [
    { label: 'Stop 1', dropAddress: '123 Main St, City, Country' },
    { label: 'Stop 2', dropAddress: '456 Elm St, City, Country' },
    { label: 'Stop 3', dropAddress: '789 Oak St, City, Country' }
  ];

  return (
    <>
    
      <View style={styles.profileContainer}>
      {/* <View>
      <View>
      <Text style={{color:'red' ,textAlign:'center',fontSize:responsiveFontSize(16),fontWeight:"600"}}>I'm Arrived</Text>
       <Image  style={{position:'absolute',right:4,top:0,height:responsiveHeight(15),width:responsiveWidth(15)}} source={AppImages.crossIcon}/>
      </View>
         <View style={{ marginLeft: responsiveWidth(14), }}>
            <Text
              style={{
                color: '#000000',
                fontWeight: '500',
                fontSize: responsiveFontSize(16),
                marginTop: responsiveHeight(6),
              }}>
              Stop 1
            </Text>
          </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: responsiveHeight(10),
            marginTop: Spacing.small,
          }}>
          <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: responsiveWidth(20) }}>
            <Text
              style={{
                color: Colors.black,
                fontSize: responsiveFontSize(14),
                fontWeight: '400',
                lineHeight: 16.96,
              }}>
              {address}{' '}
            </Text>
          </View>

        </View> 
    </View> */}
    <DeliveryComponent/>
        {/* <View style={{ flex: 1, margin: 4, }}>
          <View style={{ flex: 1, }}>

            <View style={styles.addressContainer}>
              {selectedStopIndex !== null ? (
                <Text style={styles.addressText}>
                  {stops[selectedStopIndex].dropAddress}
                </Text>
              ) : (
                <Text style={styles.addressText}>Please select a stop</Text>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              {stops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stopButton}
                  onPress={() => setSelectedStopIndex(index)}
                >
                  <Text style={styles.stopText}>{stop.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ marginLeft: responsiveWidth(14), }}>
            <Text
              style={{
                color: '#000000',
                fontWeight: '500',
                fontSize: responsiveFontSize(16),
                marginTop: responsiveHeight(8),
              }}>
              LOCATION
            </Text>
          </View>
        </View> */}

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: responsiveHeight(10),
            marginTop: Spacing.small,
          }}>
          <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: responsiveWidth(20) }}>
            <Text
              style={{
                color: Colors.black,
                fontSize: responsiveFontSize(14),
                fontWeight: '400',
                lineHeight: 16.96,
              }}>
              {address}{' '}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BorderLine orientation={'vertical'} thickness={1} />
            <View style={{ marginLeft: responsiveWidth(3) }}>
              <TouchableOpacity
                onPress={() =>
                  handleOpenMap(
                    details?.drop_lat || 26.846726,
                    details?.drop_long || 80.928795,
                  )
                }
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={AppImages.navigatationIcon}
                  style={{
                    width: responsiveWidth(44),
                    height: responsiveHeight(44),
                    marginLeft: 5,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: responsiveFontSize(9),
                  fontWeight: '400',
                  lineHeight: 9.68,
                  color: '#000000',
                  marginTop: responsiveHeight(6),
                }}>
                Navigate Now
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.bottomSection}>
          <SlideButton
            title="End Trip"
            titleStyle={{ color: Colors.white }}
            thumbStyle={{
              backgroundColor: '#EB5757',
              height: 50,
              width: 70,
              borderRadius: 30,
            }}
            onReachedToEnd={() => {
              handleEndTrip();
              // navigation.navigate('AmountCollected');
            }}
            containerStyle={{ backgroundColor: isSlid ? 'red' : '#232323' }} // Set the background color here
            // onSlideComplete={handleSlideComplete} // Callback when sliding is complete
            underlayStyle={{ backgroundColor: '#F77B7B' }}
          />
        </View> */}
      </View>
      <Loading loading={loading} />
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    padding: responsiveHeight(2),
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: responsiveHeight(1),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 3,
    marginBottom: 3,
  },
  button: {
    backgroundColor: Colors.brandBlue,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginRight: 10,
    color: 'black',
    marginLeft: 25,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'gray',
    color: Colors.black,
    padding: 7,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  otpButton: {
    backgroundColor: Colors.brandBlue,
    padding: 8,
    borderRadius: 5,
    // marginTop:18
  },
  otpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  ProfileView: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'flex-start',
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 35,
    marginLeft: 8,
  },
  starImg: {
    height: 12,
    width: 12,
  },
  name: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  LocationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  centeredView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  leftAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticleLine: {
    height: 10,
    width: 4,
    backgroundColor: Colors.brandBlue,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 5,
    gap: 10,
  },
  actionButton: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 40,
    borderColor: '#f5f5f5',
    borderWidth: 1,
    elevation: 0.4,
  },
  iconImage: {
    width: 18,
    height: 18,
  },
  bottomSection: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
  itemDetails: {
    borderRightWidth: 2,
    borderRightColor: Colors.brandBlue,
    paddingRight: 10,
  },
  weightDetails: {
    paddingLeft: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.textInputBorderColor,
    fontSize: 20,
    color: Colors.brandBlue,
    textAlign: 'center',
    height: 40,
    width: 40,
    paddingVertical: 0, 
    paddingHorizontal: 0, 
    borderBottomWidth: 1,
  },
  inputCell: {
    borderBottomWidth: 1,
    borderColor: Colors.textInputBorderColor,
  },
  stopButton: {
    backgroundColor: Colors.brandBlue,
    padding: Spacing.small,
    marginHorizontal: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center'
  },
  stopText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  addressContainer: {
    marginBottom: 20,
    borderColor: 'gray',
    borderRadius: 5,
    alignItems: 'center'
  },
  addressText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#333'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default DestinationSection;
