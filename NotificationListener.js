import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'; // Correct import
import {useSelector} from 'react-redux';

const NotificationListener = ({children}) => {
  const [notification, setNotification] = useState(null);
  const {orderData} = useSelector(state => state?.parsalPartner);

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

          notificationRef.on('child_added', snapshot => {
            const newNotification = snapshot.val();
            setNotification(newNotification);
            // Trigger the pop-up or any other logic
            showRatingPopup(newNotification);
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

  // Function to show the rating popup
  const showRatingPopup = notification => {
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
          {text: 'Cancel'},
        ],
      );
    }
  };

  return <>{children}</>;
};

export default NotificationListener;
