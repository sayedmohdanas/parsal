import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import ArriveButton from '../components/ArriveButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  hitCreateTransaction,
  hitGetOrderFareDetail,
} from '../../../config/api/api';
import {useNavigation} from '@react-navigation/native';
import {io} from 'socket.io-client';
import {socketUrl} from '../../../config/url';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import {
  setOrderData,
  setlivetripmenu,
  setupdate_order,
} from '../../../redux/HitApis/HitApiSlice';

const AmountCollectScreen = () => {
  const update_order = useSelector(
    state => state?.parsalPartner?.update_order || null,
  );

  const [visible, setvisible] = useState(false);
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const store_data = useSelector(state => state);
  const driver_details = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
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
      userId: orderData?.newOrder?.driver_id ||orderData?.driver_id,
      role: 'driver',
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    socket.on('complete_transaction_by_user_ack', data => {
      const param = {
        orderId: data?.order_id,
        partner_id:
          store_data?.parsalPartner?.loginuserdetails?.partner_id ||
          store_data?.parsalPartner?.loginuserdetails?.id,
        vehicle_type_id: driver_details?.vehicle_type_id,
      };

      hitCreateTransaction(param)
        .then(res => {
          if (res) {
            setvisible(true);
            dispatch(setlivetripmenu(false));
            dispatch(setOrderData(null));
            dispatch(setupdate_order(null));

            // Isolate the navigation in a separate function for consistency
            const handleNavigation = () => {
              setvisible(false);
              navigation.navigate('Earning');
            };

            // Use setTimeout with fallback to ensure it executes
            const timeoutId = setTimeout(handleNavigation, 5000);

            // Clear timeout in case component unmounts or dependencies change
            return () => clearTimeout(timeoutId);
          }
        })
        .catch(err => {
          console.error('Error in transaction:', err);
        });
    });

    return () => {
      if (socket) {
        console.log('Socket disconnected');
      }
    };
  }, []);
  const Complete_Order = () => {
    const param = {
      orderId: orderData?.newOrder?.id || orderData?.id,
      partner_id:
        store_data?.parsalPartner?.loginuserdetails?.partner_id ||
        store_data?.parsalPartner?.loginuserdetails?.id,
      vehicle_type_id: driver_details?.vehicle_type_id,
    };
    hitCreateTransaction(param)
      .then(res => {
        if (res) {
          dispatch(setOrderData(null));
          dispatch(setupdate_order(null));
          dispatch(setlivetripmenu(false));
          socket.emit('complete_transaction_by_user', {
            userId: orderData?.newOrder?.cust_id || orderData?.cust_id,
          });
          navigation.navigate('Earning');
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  const Total_Fare = order_fare_details?.filter(item => parseInt(item?.pay_head_id) === 0);
  return (
    <View style={styles.container}>
      <View style={styles.upperHalf}>
        <Text style={styles.amountText}>₹{Math.round(Total_Fare[0]?.amount).toFixed(2)}</Text>
        <View
          style={{
            paddingHorizontal: responsiveWidth(80),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.label}>{orderData?.custName} to pay in cash</Text>
        </View>
      </View>

      <View style={styles.lowerHalf}>
        <ArriveButton onPress={Complete_Order} buttonText={'Cash Collected'} />
      </View>
      <PaymentSuccessModal
        visible={visible}
        onClose={() => {
          setvisible(false);
          navigation.navigate('Earning');
        }}
      />
    </View>
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
