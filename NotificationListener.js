import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'; // Correct import
import { useDispatch, useSelector } from 'react-redux';
import { setlivetripmenu, setnextOrderData, setOrderData, setupdate_order } from './src/redux/HitApis/HitApiSlice';
import { useNavigation } from '@react-navigation/native';
import { errorToast } from './src/common/CommonFunction';

const NotificationListener = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const { orderData } = useSelector(state => state?.parsalPartner);
  const nextOrderData = useSelector(
    state => state?.parsalPartner?.nextOrderData,
  );
  const nextId = nextOrderData?.newOrder?.id || nextOrderData?.id
  const nextIdRef = useRef(nextId);
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const getOrderStatus = (orderData, orderId) => {
    if (!orderId) return null; // Ensure orderId is valid

    const orderDataId = orderData?.newOrder?.id ?? orderData?.id;
    const nextOrderDataId = nextIdRef?.current ?? null;

    if (orderDataId && orderDataId === orderId) {
      return { status: 'first', matchedOrderId: orderDataId };
    }
    if (nextOrderDataId && nextOrderDataId === orderId) {
      return { status: 'next', matchedOrderId: nextOrderDataId };
    }

    return null; // No match found
  };
  useEffect(() => {
    const setupListener = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        if (
          parsedUser?.payload?.owner_type === 0 ||
          parsedUser?.payload?.owner_type === 2
        ) {
          const driverId = parsedUser?.payload?.driver_id;
          if (!driverId) {
            console.error('Driver ID not found in AsyncStorage');
            return;
          }
  
          const driverPath = `driver/${driverId}/notifications`;
  
          // Real-time listener
          const notificationRef = database().ref(driverPath);
  
          notificationRef.on('child_added', async snapshot => {
            const newNotification = snapshot.val();
            setNotification(newNotification);
            showRatingPopup(newNotification);
  
            // Remove the notification after handling
            await snapshot.ref.remove();
          });
  
          // Cleanup listener when component unmounts
          return () => {
            notificationRef.off('child_added');
          };
        }
      } catch (error) {
        console.error('Error setting up notification listener:', error);
      }
    };
  
    setupListener();
  }, [orderData]);
  

  // useEffect(() => {
  //   const setupListener = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem('user');
  //       const parsedUser = user ? JSON.parse(user) : null;
  //       if (
  //         parsedUser?.payload?.owner_type === 0 ||
  //         parsedUser?.payload?.owner_type === 2
  //       ) {
  //         const driverId = parsedUser?.payload?.driver_id;
  //         if (!driverId) {
  //           console.error('Driver ID not found in AsyncStorage');
  //           return;
  //         }

  //         const driverPath = `driver/${driverId}/notifications`;

  //         // Real-time listener
  //         const notificationRef = database().ref(driverPath);

  //         notificationRef.on('child_added', snapshot => {
  //           const newNotification = snapshot.val();
  //           setNotification(newNotification);
  //           // Trigger the pop-up or any other logic
  //           showRatingPopup(newNotification);
  //         });

  //         // Cleanup listener when component unmounts
  //         return () => {
  //           notificationRef.off('child_added');
  //         };
  //       }
  //     } catch (error) {
  //       console.error('Error setting up notification listener:', error);
  //     }
  //   };

  //   setupListener();
  // }, [orderData]);

  // Function to show the rating popup
  const showRatingPopup = notification => {
    if (notification && notification?.type === 3) {
      ///toast 
      
      const handleOrderCancel = notification => {
        const { order_id } = notification;
        const canceledOrderStatus = getOrderStatus(orderData, order_id);

        if (canceledOrderStatus) {
      errorToast('Ride Cancelled', 'The customer has cancelled the ride.');
          const { status } = canceledOrderStatus;
          if (status === 'first') {
            if (nextOrderData) {
              dispatch(setOrderData(nextOrderData));
              dispatch(setupdate_order(null));
              dispatch(setnextOrderData(null));

            } else {
              dispatch(setOrderData(null));
              dispatch(setupdate_order(null));
              dispatch(setlivetripmenu(false));
              navigation.navigate('OrderScreen');
            }
          } else if (status === 'next') {
            dispatch(setnextOrderData(null));
          }
        }
      };

      handleOrderCancel(notification)
    }
    if (notification && notification.type === 1) {
      Alert.alert(
        'Rating Request',
        'Your trip has ended. Please rate your experience.',
        [
          {
            text: 'Rate Now',
            onPress: () => {
              // Handle navigation to rating screen or show rating modal
              console.log('Navigate to rating screen...');
            },
          },
          { text: 'Cancel' },
        ],
      );
    }
  };

  return <>{children}</>;
};

export default NotificationListener;