import React, { useEffect, useState } from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import StackNavigator from './navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import NotificationModal from './src/components/CustomNotificationModal/NotificationModal';
import firebase from '@react-native-firebase/app';
import {
  requestLocationPermission,
  requestNotificationPermission,
} from './src/common/CommonFunction';
import SoundPlayer from 'react-native-sound-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hitCheckReqStatusApi, hitUpdateFcmApi } from './src/config/api/api';
const TOPIC = 'MyNews';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import { Provider as PaperProvider } from 'react-native-paper';
import NotificationListener from './NotificationListener';
import AppStateHandler from './AppStateHandler';
import AuthChecker from './src/Auth/AuthChecker';
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
    request_id: '',
    insured: '',
    receiver_name: '',
    receiver_phone: '',
    tips: '',
    service_city: '',
    stops: []
  });
  const [timer, setTimer] = useState(15); // Timer state
  // Initialize Firebase with Realtime Database URL
  if (!firebase.apps.length) {
    firebase.initializeApp({
      databaseURL: 'https://parsal-4c318-default-rtdb.firebaseio.com/',
    });
  } else {
    firebase.app();
    // if already initialized, use the existing one
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
        console.log('FCM token updated successfully in DB', response);
      } else {
        console.error('User data not found!');
      }
    } catch (error) {
      console.error('Error updating FCM token in DB:', error);
    }
  };
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("token", token);

    updateFcmTokenInDB(token);
  };

  const handleNotification = remoteMessage => {
    // When handling the remote message
    const { notification } = remoteMessage;
    const { data } = remoteMessage;
    // console.log("data",data?.stops);

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
      request_id = '',
      insured = '',
      charity = '',
      loading_unloading = '',
      receiver_name = '',
      receiver_phone = '',
      tips = '',
      service_city = '',
      stops = []
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
      request_id,
      insured,
      loading_unloading,
      charity,
      receiver_name,
      receiver_phone,
      tips,
      service_city,
      stops
    });
    setModalVisible(true);
    // setTimer(15);
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

  const handleNotificationWithTimeCheck = async remoteMessage => {
    const user = await get_user_data();

    if (user?.payload?.driver_id == remoteMessage?.data?.driverId)
      try {
        const sentTime = remoteMessage.sentTime;
        const currentTime = Date.now();
        const timeDifference = currentTime - sentTime;
        const remainingTime = Math.max(
          15 - Math.floor(timeDifference / 1000),
          0,
        );

        // Exit early if the notification is older than 15 seconds
        if (remainingTime <= 0) {
          setModalVisible(false);
          return;
        }

        const res = await hitCheckReqStatusApi({
          request_id: remoteMessage?.data?.request_id,
        });

        // Open the modal if the accept_status is 0 and remaining time is valid
        if (
          res?.accept_status == 0 &&
          remoteMessage?.data &&
          remainingTime > 0
        ) {
          setModalVisible(false);
          setTimeout(() => {
            setModalVisible(true);
            setTimer(remainingTime == 17 ? 15 : remainingTime);
            handleNotification(remoteMessage);
            playNotificationSound();
          }, 100); // Small delay to reset modal state before opening
        } else {
          setModalVisible(false);
        }
      } catch (error) {
        console.error('Error handling notification with time check:', error);
      }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await getToken();


        await requestUserPermission();
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initialize();

    const handleUserNotification = async remoteMessage => {
      try {
        const user = await get_user_data();
        if (user?.payload?.driver_id == remoteMessage?.data?.driverId)
          if (
            user?.payload?.owner_type === 0 ||
            (user?.payload?.owner_type === 2 && remoteMessage?.data)
          ) {
            const sentTime = remoteMessage.sentTime;
            const currentTime = Date.now();
            const timeDifference = currentTime - sentTime;
            const remainingTime = Math.max(
              15 - Math.floor(timeDifference / 1000),
              0,
            );

            // Exit if remaining time is zero or negative
            if (remainingTime <= 0) {
              setModalVisible(false);
              return;
            }

            setModalVisible(false);
            setTimeout(() => {
              setModalVisible(true);
              setTimer(remainingTime == 17 ? 15 : remainingTime);
              handleNotification(remoteMessage);
              playNotificationSound();
            }, 100);
          }
      } catch (error) {
        console.error('Error handling user notification:', error);
      }
    };

    // Handle initial notification if app opens from background or closed state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) handleNotificationWithTimeCheck(remoteMessage);
      })
      .catch(error => console.error('Error in getInitialNotification:', error));

    // Set up listeners for notifications
    const unsubscribeNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage) handleNotificationWithTimeCheck(remoteMessage);
      });

    const unsubscribeOnMessage = messaging().onMessage(remoteMessage => {
      handleUserNotification(remoteMessage);
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) handleNotificationWithTimeCheck(remoteMessage);
    });

    // Subscribe to topic (if needed)
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => console.log(`Subscribed to topic: ${TOPIC}`))
      .catch(error => console.error('Error in subscribeToTopic:', error));

    return () => {
      unsubscribeNotificationOpenedApp();
      unsubscribeOnMessage();
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
      }, 1000);
    }

    if (timer === 0 && isModalVisible) {
      setModalVisible(false);
    }

    return () => clearInterval(interval);
  }, [isModalVisible, timer]);

  useEffect(() => {
    // Define the back button handler function
    const backAction = () => {
      return true; // Returning true prevents the default back action
    };

    // Add the back event listener
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Clean up the event listener when the component unmounts
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  return (
    <PaperProvider>
      <Provider store={store}>
        <NotificationListener />
        <NavigationContainer>
          <AppStateHandler />
          <StackNavigator />
          <Toast />
          <AuthChecker />
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
            request_id={notificationData?.request_id}
            insured={notificationData?.insured}
            charity={notificationData?.charity}
            loading_unloading={notificationData?.loading_unloading}
            receiver_name={notificationData?.receiver_name}
            receiver_phone={notificationData?.receiver_phone}
            tips={notificationData?.tips}
            service_city={notificationData?.service_city}
            onClose={() => setModalVisible(false)}
            setModalVisible={setModalVisible}
            timer={timer}
            stops={notificationData?.stops}
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