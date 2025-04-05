import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import ArriveButton from '../components/ArriveButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  hitcheckpaymentstatusApi,
  hitCreateTransaction,
  hitGetOrderFareDetail,
} from '../../../config/api/api';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { socketUrl } from '../../../config/url';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import {
  setOrderData,
  setSelectedDriverRedux,
  setlivetripmenu,
  setnextOrderData,
  setupdate_order,
} from '../../../redux/HitApis/HitApiSlice';
import HeaderBackButton from '../../../components/HeaderBackButton/HeaderBackButton';
import database from '@react-native-firebase/database';
import { Spacing } from '../../../common/Theme';
import AppImages from '../../../common/AppImages';

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
    console.log('notificationPayload', notificationPayload);
    // Define the path to send the data
    const customerPath = `customers/${data?.cust_id}/notifications`;
    console.log('customer path=>', customerPath);
    // Send the data to Firebase
    await database().ref(customerPath).push(notificationPayload);

    console.log('NOtification data sent successfully!');
  } catch (error) {
    console.error('Error sending dummy data to Firebase:', error);
  }
};
const AmountCollectScreen = () => {
  const [visible, setvisible] = useState(false);
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { nextOrderData } = useSelector(state => state?.parsalPartner);
  const [order_fare_details, setorder_fare_details] = useState([]);
  const get_data = () => {
    const param = {
      orderId: orderData?.newOrder?.id || orderData?.id,
    };
    hitGetOrderFareDetail(param)
      .then(res => {
        setorder_fare_details(res?.transactions);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    get_data();
  }, []);
  useEffect(() => {
    socket = io(socketUrl);

    socket.emit('registerUser', {
      userId: orderData?.newOrder?.driver_id || orderData?.driver_id,
      role: 'driver',
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    socket.on('complete_transaction_by_user_ack', data => {
      if (data) {
        if (nextOrderData) {
          dispatch(setOrderData(nextOrderData));
          dispatch(setupdate_order(null));
          dispatch(setnextOrderData(null));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );
          navigation.goBack('');
        } else {
          dispatch(setOrderData(null));
          dispatch(setupdate_order(null));
          dispatch(setlivetripmenu(false));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );

          navigation.navigate('Earning');
        }
      }
      // const param = {
      //   orderId: data?.order_id,
      //   partner_id:
      //     store_data?.parsalPartner?.loginuserdetails?.partner_id ||
      //     store_data?.parsalPartner?.loginuserdetails?.id,
      //   vehicle_type_id: driver_details?.vehicle_type_id,
      // };

      // hitCreateTransaction(param)
      //   .then(res => {
      //     if (res) {
      //       if (nextOrderData) {
      //         dispatch(setOrderData(nextOrderData));
      //         dispatch(setupdate_order(null));
      //         dispatch(setnextOrderData(null));
      //         dispatch(
      //           setSelectedDriverRedux({
      //             driver_id:
      //               orderData?.newOrder?.driver_id || orderData?.driver_id,
      //           }),
      //         );
      //         navigation.goBack('');
      //       } else {
      //         dispatch(setOrderData(null));
      //         dispatch(setupdate_order(null));
      //         dispatch(setlivetripmenu(false));
      //         dispatch(
      //           setSelectedDriverRedux({
      //             driver_id:
      //               orderData?.newOrder?.driver_id || orderData?.driver_id,
      //           }),
      //         );

      //         navigation.navigate('Earning');
      //       }
      //     }
      //   })
      //   .catch(err => {
      //     console.error('Error in transaction:', err);
      //   });
    });
  }, []);
  const handleRefresh=()=>{
    const parameter = {
      id: orderData?.newOrder?.id || orderData?.id,
    }
    hitcheckpaymentstatusApi(parameter).then((res) => {
      if(res?.order?.payment_status==1){
        if (nextOrderData) {
          dispatch(setOrderData(nextOrderData));
          dispatch(setupdate_order(null));
          dispatch(setnextOrderData(null));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );
          navigation.goBack('');
        } else {
          dispatch(setOrderData(null));
          dispatch(setupdate_order(null));
          dispatch(setlivetripmenu(false));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );

          navigation.navigate('Earning');
        }
      }
    })
  }
  const Complete_Order = () => {
    const parameter = {
      id: orderData?.newOrder?.id || orderData?.id,
    }
    hitcheckpaymentstatusApi(parameter).then((res) => {
      if(res?.order?.payment_status==1){
        if (nextOrderData) {
          dispatch(setOrderData(nextOrderData));
          dispatch(setupdate_order(null));
          dispatch(setnextOrderData(null));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );
          navigation.goBack('');
        } else {
          dispatch(setOrderData(null));
          dispatch(setupdate_order(null));
          dispatch(setlivetripmenu(false));
          dispatch(
            setSelectedDriverRedux({
              driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
            }),
          );

          navigation.navigate('Earning');
        }
      }else{
        const param = {
          orderId: orderData?.newOrder?.id || orderData?.id,
          online: 0,
          cash: Math.round(Total_Fare[0]?.amount),
          wallet: 0,
          pay_mode: 0,
        };
        hitCreateTransaction(param)
          .then(res => {
            if (res) {
              if (nextOrderData) {
                socket.emit('complete_transaction_by_user', {
                  userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
                });
                dispatch(setOrderData(nextOrderData));
                dispatch(
                  setSelectedDriverRedux({
                    driver_id:
                      orderData?.newOrder?.driver_id || orderData?.driver_id,
                  }),
                );
                sendDummyDataToFirebase(
                  orderData?.newOrder || orderData,
                  'Casch Collected',
                  4,
                );
                dispatch(setupdate_order(null));
                dispatch(setnextOrderData(null));
                navigation.goBack('');
              } else {
                socket.emit('complete_transaction_by_user', {
                  userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
                });
                dispatch(
                  setSelectedDriverRedux({
                    driver_id:
                      orderData?.newOrder?.driver_id || orderData?.driver_id,
                  }),
                );
                sendDummyDataToFirebase(
                  orderData?.newOrder || orderData,
                  'Casch Collected',
                  4,
                );
                dispatch(setOrderData(null));
                dispatch(setupdate_order(null));
                dispatch(setlivetripmenu(false));
                navigation.navigate('Earning');
              }
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    })


  };
  const Total_Fare = order_fare_details?.filter(
    item => parseInt(item?.pay_head_id) === 0,
  ); 
  return (
    <>
      <HeaderBackButton
      headerText={'Amount Collect'}
        onPress={() => navigation.goBack('')}
        rightButton={AppImages.Refresh_Icon}
        onButtonPress={handleRefresh}
      />
      <View style={styles.container}>
        <View style={styles.upperHalf}>

          <Text style={styles.amountText}>
            {Total_Fare[0]?.amount !== undefined
              ? `₹${Math.round(Total_Fare[0]?.amount).toFixed(2)}`
              : "₹0.00"}
          </Text>

          <View
            style={{
              paddingHorizontal: responsiveWidth(80),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.label}>
              {orderData?.custName} to pay in cash
            </Text>
          </View>
        </View>

        <View style={styles.lowerHalf}>
          {/* <TouchableHighlight
            onPress={handleRefresh}
            underlayColor="#DDDDDD"
            style={{
              paddingVertical: 8,
              paddingHorizontal: 20,
              backgroundColor: "#007BFF",
              borderRadius: 5,
              marginBottom:Spacing.small
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}>Refresh</Text>
          </TouchableHighlight> */}

          <ArriveButton
            onPress={Complete_Order}
            buttonText={'Cash Collected'}
          />
        </View>
        <PaymentSuccessModal
          visible={visible}
          onClose={() => {
            setvisible(false);
            navigation.navigate('Earning');
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  upperHalf: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#089550',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  lowerHalf: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  amountText: {
    fontSize: responsiveFontSize(60),
    fontWeight: '700',
    // fontFamily:'inter',
    color: Colors.white,
    lineHeight: 72.61,
    textAlign: 'center',
  },
  label: {
    fontSize: responsiveFontSize(24),
    fontWeight: '700',
    color: Colors.white,
    marginTop: responsiveHeight(50),
    textAlign: 'center',
  },
});

export default AmountCollectScreen;






