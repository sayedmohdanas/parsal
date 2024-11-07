import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, AppState} from 'react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import StackNavigator from './navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import NotificationModal from './src/components/CustomNotificationModal/NotificationModal';
import firebase from '@react-native-firebase/app';
import {requestLocationPermission} from './src/common/CommonFunction';
import SoundPlayer from 'react-native-sound-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hitUpdateFcmApi} from './src/config/api/api';
const TOPIC = 'MyNews';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import {Provider as PaperProvider} from 'react-native-paper';
export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    body: '',
    drop_lat: '',
    drop_long: '',
    pickup_lat: '',
    pickup_long: '',
    vehicle_type: '',
    vehicle_id: '',
    cust_id: '',
    driverId: '',
    drop_address: '',
    pickup_address: '',
    expected_price: '',
    expected_distance: '',
    expected_time: '',
    cust_mobile: '',
    cust_name: '',
    goods_type_id: '',
  });
  const [timer, setTimer] = useState(15); // Timer state
  // Initialize Firebase with Realtime Database URL
  if (!firebase.apps.length) {
    firebase.initializeApp({
      databaseURL: 'https://parsal-4c318-default-rtdb.firebaseio.com/',
    });
  } else {
    firebase.app(); // if already initialized, use the existing one
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };
  const updateFcmTokenInDB = async token => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      if (
        parsedUser?.payload?.owner_type == 0 ||
        parsedUser?.payload?.owner_type == 2
      ) {
        // Call your backend API to update the token in the database
        const param = {
          driverId: parsedUser?.payload?.driver_id,
          fcm_token: token,
        };
        const response = await hitUpdateFcmApi(param);

        console.log('FCM token updated successfully in DB', response.data);
      } else {
        console.error('User data not found!');
      }
    } catch (error) {
      console.error('Error updating FCM token in DB:', error);
    }
  };
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('token', token);
  };

  const handleNotification = remoteMessage => {
    // When handling the remote message
    const {notification} = remoteMessage;
    const {data} = remoteMessage;

    // Use optional chaining to avoid errors
    const title = notification?.title || '';
    const body = notification?.body || '';
    const {
      goods_type_id = '',
      drop_lat = '',
      vehicle_id = '',
      drop_long = '',
      pickup_lat = '',
      pickup_long = '',
      vehicle_type = '',
      cust_id = ' ',
      cust_name = ' ',
      cust_mobile = ' ',
      driverId = '',
      pickup_address = '',
      drop_address = '',
      expected_price = '',
      expected_distance = '',
      expected_time = '',
    } = data || {};
    // Update the notification data state
    setNotificationData({
      goods_type_id,
      title,
      body,
      drop_lat,
      drop_long,
      pickup_lat,
      pickup_long,
      vehicle_type,
      cust_id,
      driverId,
      pickup_address,
      drop_address,
      expected_price,
      expected_distance,
      expected_time,
      cust_name,
      cust_mobile,
      vehicle_id,
    });
    setModalVisible(true);
    setTimer(15);
  };

  const handleAccept = res => {
    setModalVisible(false);
  };

  const handleReject = () => {
    setModalVisible(false);
  };
  const playNotificationSound = () => {
    try {
      SoundPlayer.playSoundFile('notification', 'mp3');
    } catch (e) {
      console.log('Cannot play the sound file', e);
    }
  };
  const get_user_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Failed to load user from AsyncStorage', e);
      return null;
    }
  };

  useEffect(() => {
    getToken();
    requestUserPermission();

    const handleUserNotification = async remoteMessage => {
      const user = await get_user_data(); // Get the parsed user data
      if (user?.payload?.owner_type === 0 || user?.payload?.owner_type === 2) {
        setModalVisible(true);
        setTimer(10); // Reset timer to 10 seconds (or desired duration)
        handleNotification(remoteMessage);
        playNotificationSound();
      }
    };

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          setModalVisible(true);
          setTimer(10); // Reset timer
          handleNotification(remoteMessage);
          playNotificationSound();
        }
      });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        setModalVisible(true);
        setTimer(10); // Reset timer
        handleNotification(remoteMessage);
        playNotificationSound();
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      setModalVisible(true);
      setTimer(10); // Reset timer
    });

    messaging().onTokenRefresh(async newToken => {
      console.log('New FCM token:', newToken);
      updateFcmTokenInDB(newToken);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await handleUserNotification(remoteMessage);
    });

    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Subscribed to topic: ${TOPIC}`);
      });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    let interval;

    if (isModalVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000); // Countdown by 1 second
    }

    if (timer === 0 && isModalVisible) {
      setModalVisible(false); // Close modal when timer reaches 0
    }

    return () => {
      clearInterval(interval);
    };
  }, [isModalVisible, timer]);
  return (
    <PaperProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigator />
          <Toast />
          <NotificationModal
            isVisible={isModalVisible}
            onAccept={handleAccept}
            onReject={handleReject}
            title={notificationData.title}
            body={notificationData.body}
            drop_lat={notificationData.drop_lat}
            drop_long={notificationData.drop_long}
            pickup_lat={notificationData.pickup_lat}
            pickup_long={notificationData.pickup_long}
            vehicle_id={notificationData.vehicle_id}
            vehicle_type_id={notificationData?.vehicle_type}
            cust_id={notificationData.cust_id}
            driverId={notificationData?.driverId}
            pickup_address={notificationData?.pickup_address}
            drop_address={notificationData?.drop_address}
            expected_distance={notificationData?.expected_distance}
            expected_price={notificationData?.expected_price}
            expected_time={notificationData?.expected_time}
            goods_type_id={notificationData?.goods_type_id}
            cust_name={notificationData?.cust_name}
            cust_mobile={notificationData?.cust_mobile}
            onClose={() => setModalVisible(false)}
            setModalVisible={setModalVisible}
            timer={timer}
          />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
