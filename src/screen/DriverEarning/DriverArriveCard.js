import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import DriverInformation from '../DashBoard/components/DriverInformation';
import ArriveButton from '../DashBoard/components/ArriveButton';
import SlideButton from 'rn-slide-button';
import {socketUrl} from '../../config/url';
import {io} from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {hitCancelOrder, hitUpdateOrder} from '../../config/api/api';
import {
  setOrderData,
  setlivetripmenu,
  setupdate_order,
} from '../../redux/HitApis/HitApiSlice';
import {successToast} from '../../common/CommonFunction';
import Loading from '../../components/Loading/Loading';

const DriverArriveCard = ({trip, isReachedPickup}) => {
  const [isArrived, setIsArrived] = useState(false);
  const [isSlid, setIsSlid] = useState(false);
  const navigation = useNavigation();
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  const [otp, setOtp] = useState(0);
  const [showotp, setshowotp] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoadig] = useState(false);
  const handleSlideComplete = () => {
    setIsSlid(true);
  };
  useEffect(() => {
    socket = io(socketUrl);

    socket.emit('registerUser', {
      userId: orderData?.newOrder?.driver_id || orderData?.driver_id,
      role: 'driver',
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', error => {
      console.error('Connection error:', error);
    });
    socket.on('order_canceled', data => {
      dispatch(setOrderData(null));
      dispatch(setupdate_order(null));
      navigation.navigate('DriverDashboard');
      // Handle cancellation on the frontend (e.g., notify user, redirect, etc.)
    });
    return () => {
      if (socket) {
        // socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []);
  const handleOtpSubmit = async () => {
    try {
      if (otp != orderData?.otp || orderData?.Otp < 4) {
        errorToast('Invalid Input', 'Incorrect Otp');
        return;
      }
      const payload = {
        is_arrive_pickup: 1,
        // order_id: orderData?.newOrder?.id,
        order_id: orderData?.newOrder?.id || orderData?.id,
      };
      const response = await hitUpdateOrder(payload);
      if (response) {
        dispatch(setupdate_order(response?.order));
        socket.emit('driver_pickup', response, acknowledgment => {
          console.log('Data sent, acknowledgment:', acknowledgment);
        });
      }
    } catch (error) {}
  };
  const handleCancelRequest = async () => {
    try {
      setLoadig(true);
      Alert.alert(
        'Cancel Order',
        'Are you sure you want to cancel this order?',
        [
          {
            text: 'No', // Do nothing on "No"
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              // Handle the order cancellation logic here
              successToast('Successfull', 'Order Cancel');
              dispatch(setupdate_order(null));
              const param = {
                order_id: orderData?.newOrder?.id || orderData?.id,
              };
              const res = await hitCancelOrder(param);

              if (res) {
                socket.emit('cancel_order', {
                  userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
                  orderId: 'order789',
                  role: 'driver',
                  reason: 'Customer requested cancellation',
                });
                dispatch(setlivetripmenu(false));
                dispatch(setOrderData([]));
                dispatch(setupdate_order([]));
                navigation.navigate('DriverDashboard');

                console.log('Request cancelled');
              }

              // Call API to cancel the order or update state
            },
          },
        ],
        {cancelable: false}, // Prevent closing the alert by tapping outside
      );
    } catch (error) {
      Alert.alert('Error', 'Something wwent wrong');
      console.error(error);
    } finally {
      setLoadig(false);
    }
  };
  return (
    <View style={styles.container}>
      <DriverInformation />

      <View style={styles.chatButtonContainer}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => {
            // Navigate to the Chat screen or handle chat functionality here
            navigation.navigate('Chat'); // Replace 'ChatScreen' with your actual chat screen name
          }}>
          <Image
            source={AppImages.messageIcon}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>{'Chat'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelRequest}
          style={styles.chatButton}>
          <Image
            source={AppImages.crossIcon}
            style={styles.crossIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>{'Cancel'}</Text>
        </TouchableOpacity>
      </View>

      {showotp && (
        <View style={styles.otpInputContainer}>
          <TextInput
            placeholder="Enter OTP"
            style={styles.otpInput}
            placeholderTextColor={'#D1D1D1'}
            keyboardType="decimal-pad"
            onChangeText={e => {
              setOtp(e);
            }}
            maxLength={4}
          />
          <Image
            source={
              orderData?.otp == otp ? AppImages.checked : AppImages.pickedIcon
            }
            style={styles.otpIcon}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.itemContainer}>
        {!isArrived ? (
          <ArriveButton
            onPress={() => {
              setshowotp(preve => !preve);
              setIsArrived(true);
            }}
            buttonText={'Arrive'}
            disabled={!isReachedPickup}
          />
        ) : (
          <View style={styles.slideButtonContainer}>
            <SlideButton
              title="Start Ride"
              onReachedToEnd={() => {
                handleOtpSubmit();
              }}
              titleStyle={styles.slideButtonTitle}
              thumbStyle={styles.slideButtonThumb}
              containerStyle={{backgroundColor: isSlid ? 'red' : '#232323'}}
              onSlideComplete={handleSlideComplete}
              underlayStyle={styles.slideButtonUnderlay}
              disabled={orderData?.otp == otp ? false : true}
            />
          </View>
        )}
      </View>
      <Loading loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: responsiveHeight(2),
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: responsiveHeight(1),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chatButtonContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveHeight(15),
    justifyContent: 'center',
    gap: 10,
  },
  chatButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F8F8F8',
    width: '44%',
    borderRadius: 4,
    marginTop: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(6),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 0.5,
  },
  buttonText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    lineHeight: 14.52,
    color: '#000000',
    marginLeft: responsiveWidth(5),
  },
  otpInputContainer: {
    borderWidth: 1,
    borderColor: '#D8D8D8',
    marginHorizontal: responsiveWidth(25),
    borderRadius: 10,
    height: responsiveHeight(42),
    marginTop: responsiveHeight(18),
    flexDirection: 'row',
  },
  otpInput: {
    marginLeft: responsiveWidth(6),
    flex: 1,
    fontWeight: '500',
    fontSize: responsiveFontSize(12),
    color: Colors.black,
  },
  otpIcon: {
    width: responsiveWidth(24),
    height: responsiveHeight(24),
    alignSelf: 'center',
    marginRight: responsiveWidth(8),
  },
  itemContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(6),
    marginBottom: responsiveHeight(8),
    paddingVertical: responsiveHeight(8),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  slideButtonContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(18),
  },
  slideButtonTitle: {
    color: Colors.white,
  },
  slideButtonThumb: {
    backgroundColor: '#45B845',
    height: responsiveHeight(50),
    width: responsiveWidth(70),
    borderRadius: 30,
  },
  slideButtonUnderlay: {
    backgroundColor: '#90EE90',
  },
  icon: {
    width: responsiveWidth(18),
    height: responsiveHeight(18),
  },
  crossIcon: {
    width: responsiveWidth(10),
    height: responsiveHeight(10),
  },
});

export default DriverArriveCard;
