import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'; // Correct import
import { useDispatch, useSelector } from 'react-redux';
import { setlivetripmenu, setnextOrderData, setOrderData, setSelectedDriverRedux, setupdate_order } from './src/redux/HitApis/HitApiSlice';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// const NotificationListener = ({ children }) => {
//   const { orderData } = useSelector(state => state?.parsalPartner);
//   const nextOrderData = useSelector(
//     state => state?.parsalPartner?.nextOrderData,
//   );
//   const nextId = nextOrderData?.newOrder?.id || nextOrderData?.id
//   const nextIdRef = useRef(nextId);
//   const dispatch = useDispatch()
//   const navigation = useNavigation()
//   const getOrderStatus = (orderData, orderId) => {
//     if (!orderId) return null; // Ensure orderId is valid

//     const orderDataId = orderData?.newOrder?.id ?? orderData?.id;
//     const nextOrderDataId = nextIdRef?.current ?? null;

//     if (orderDataId && orderDataId === orderId) {
//       return { status: 'first', matchedOrderId: orderDataId };
//     }
//     if (nextOrderDataId && nextOrderDataId === orderId) {
//       return { status: 'next', matchedOrderId: nextOrderDataId };
//     }

//     return null; // No match found
//   };


//   useEffect(() => {
//     const setupListener = async () => {
//       try {
//         const user = await AsyncStorage.getItem('user');
//         const parsedUser = user ? JSON.parse(user) : null;
//         if (
//           parsedUser?.payload?.owner_type === 0 ||
//           parsedUser?.payload?.owner_type === 2
//         ) {
//           const driverId = parsedUser?.payload?.driver_id;
//           if (!driverId) {
//             console.error('Driver ID not found in AsyncStorage');
//             return;
//           }

//           const driverPath = `driver/${driverId}/notifications`;

//           // Real-time listener
//           const notificationRef = database().ref(driverPath);

//           notificationRef.on('child_added', snapshot => {
//             const newNotification = snapshot.val();
//             console.log("newNotification", newNotification);
//             // Trigger the pop-up or any other logic
//             showRatingPopup(newNotification);
//           });

//           // Cleanup listener when component unmounts
//           return () => {
//             notificationRef.off('child_added');
//           };
//         }
//       } catch (error) {
//         console.error('Error setting up notification listener:', error);
//       }
//     };

//     setupListener();
//   }, [orderData]);

//   // Function to show the rating popup
//   const showRatingPopup = notification => {
//     if (notification && notification?.type === 4) {
//       if (nextOrderData) {
//         dispatch(setOrderData(nextOrderData));
//         dispatch(setupdate_order(null));
//         dispatch(setnextOrderData(null));
//         dispatch(
//           setSelectedDriverRedux({
//             driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
//           }),
//         );
//         navigation.goBack('');
//       } else {
//         dispatch(setOrderData(null));
//         dispatch(setupdate_order(null));
//         dispatch(setlivetripmenu(false));
//         dispatch(
//           setSelectedDriverRedux({
//             driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id,
//           }),
//         );
//         navigation.navigate('Earning');
//       }
//     }
//     if (notification && notification?.type === 3) {
//       const handleOrderCancel = notification => {
//         const { order_id } = notification;
//         const canceledOrderStatus = getOrderStatus(orderData, order_id);

//         if (canceledOrderStatus) {
//           const { status } = canceledOrderStatus;
//           if (status === 'first') {
//             if (nextOrderData) {
//               dispatch(setOrderData(nextOrderData));
//               dispatch(setupdate_order(null));
//               dispatch(setnextOrderData(null));

//             } else {
//               dispatch(setOrderData(null));
//               dispatch(setupdate_order(null));
//               dispatch(setlivetripmenu(false));
//               navigation.navigate('OrderScreen');
//             }
//           } else if (status === 'next') {
//             dispatch(setnextOrderData(null));
//           }
//         }
//       };
//       handleOrderCancel(notification)
//     }
//     if (notification && notification.type === 1) {
//       Alert.alert(
//         'Rating Request',
//         'Your trip has ended. Please rate your experience.',
//         [
//           {
//             text: 'Rate Now',
//             onPress: () => {
//               // Handle navigation to rating screen or show rating modal
//               console.log('Navigate to rating screen...');
//             },
//           },
//           { text: 'Cancel' },
//         ],
//       );
//     }
//   };

//   return <>{children}</>;
// };

// export default NotificationListener;
const NotificationListener = ({ children }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { orderData } = useSelector(state => state?.parsalPartner);
  const nextOrderData = useSelector(state => state?.parsalPartner?.nextOrderData);
  const nextId = nextOrderData?.newOrder?.id || nextOrderData?.id;
  const nextIdRef = useRef(nextId);
  useEffect(() => {
    nextIdRef.current = nextId; // Keep ref updated
  }, [nextId]);

  useEffect(() => {
    let notificationRef = null;

    const setupListener = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;

        if (!parsedUser?.payload) return;

        const { owner_type, driver_id } = parsedUser.payload;

        if ((owner_type === 0 || owner_type === 2) && driver_id) {
          const driverPath = `driver/${driver_id}/notifications`;
          notificationRef = database().ref(driverPath);

          notificationRef.on('child_added', snapshot => {
            const newNotification = snapshot.val();
            showNotificationPopup(newNotification);

            // Remove the notification from Firebase after processing it
            snapshot.ref.remove()
              .then(() => console.log("Notification removed from Firebase"))
              .catch(error => console.error("Error removing notification:", error));
          });
        }
      } catch (error) {
        console.error('Error setting up notification listener:', error);
      }
    };

    setupListener();

    return () => {
      if (notificationRef) {
        notificationRef.off('child_added');
      }
    };
  }, []);

  const getOrderStatus = (orderId) => {
    if (!orderId) return null;
    const orderDataId = orderData?.newOrder?.id ?? orderData?.id;
    const nextOrderDataId = nextIdRef.current;
    if (orderDataId === orderId) return { status: 'first', matchedOrderId: orderDataId };
    if (nextOrderDataId === orderId) return { status: 'next', matchedOrderId: nextOrderDataId };

    return null;
  };

  const showNotificationPopup = (notification) => {
    if (!notification) return;

    if (notification.type == 4) {
      handleCompletedTrip();
    }
    else if (notification.type == 3) {
      handleOrderCancel(notification);
    }
    else if (notification.type == 1) {
    
    }
  };
  const showToast = (body, title) => {
    Toast.show({
      type: 'success', // 'success' | 'error' | 'info'
      text1: body,
      text2: title,
    });
  };
  const handleCompletedTrip = () => {
    if (nextOrderData) {
      showToast("Alert", "Payment Successfull");
      dispatch(setOrderData(nextOrderData));
      dispatch(setupdate_order(null));
      dispatch(setnextOrderData(null));
      dispatch(setSelectedDriverRedux({ driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id }));
      navigation.goBack();
    } else {
      showToast("Alert", "Payment Successfull");
      dispatch(setOrderData(null));
      dispatch(setupdate_order(null));
      dispatch(setlivetripmenu(false));
      dispatch(setSelectedDriverRedux({ driver_id: orderData?.newOrder?.driver_id || orderData?.driver_id }));
      navigation.navigate('Earning');
    }
  };

  const handleOrderCancel = (notification) => {
    const { order_id } = notification;
    const canceledOrderStatus = getOrderStatus(order_id);



    // if (!canceledOrderStatus) return;
    if (canceledOrderStatus?.status === 'first') {
      showToast("Cancel", "Order Cancel")
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
    } else if (canceledOrderStatus?.status === 'next') {
      dispatch(setnextOrderData(null));
    } else {
      dispatch(setOrderData(null));
      dispatch(setupdate_order(null));
      dispatch(setlivetripmenu(false));
      navigation.navigate('OrderScreen');
    }
  };

  return <>{children}</>;
};


export default NotificationListener;