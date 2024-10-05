import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import StackNavigator from './navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import NotificationModal from './src/components/CustomNotificationModal/NotificationModal';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import { requestLocationPermission } from './src/common/CommonFunction';
// import Sound from 'react-native-sound'
import SoundPlayer from 'react-native-sound-player';

const TOPIC = 'MyNews';

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
    cust_mobile:'',
    cust_name:'',
    goods_type_id:''
  });
  const [timer, setTimer] = useState(30); // Timer state
  // Initialize Firebase with Realtime Database URL
  if (!firebase.apps.length) {
    firebase.initializeApp({
      databaseURL: "https://parsal-4c318-default-rtdb.firebaseio.com/"
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
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log(token, 'token---');
  }

  const handleNotification = (remoteMessage) => {
    // When handling the remote message
    const { notification } = remoteMessage;
    const { data } = remoteMessage;
    console.log('remotemessage=========>>>>>',remoteMessage);
    
    // Use optional chaining to avoid errors
    const title = notification?.title || '';
    const body = notification?.body || '';
    const {goods_type_id="", drop_lat = '',vehicle_id="",
       drop_long = '', pickup_lat = '', pickup_long = '', vehicle_type = '', cust_id = " ",  cust_name = " ", cust_mobile = " ",driverId = "", pickup_address = '', drop_address = '', expected_price = '', expected_distance = '', expected_time = '',
    
    } = data || {};
    // Update the notification data state
    setNotificationData({ goods_type_id,title, body, drop_lat, drop_long, pickup_lat, pickup_long, vehicle_type, cust_id, driverId, pickup_address, drop_address, expected_price, expected_distance, expected_time ,cust_name,cust_mobile,vehicle_id});
    setModalVisible(true);
    setTimer(30);
  };

  const handleAccept = (res) => {
    console.log(res)
    console.log('Accepted');
    setModalVisible(false);
  };

  const handleReject = () => {
    console.log('Rejected');
    setModalVisible(false);
  };
  const playNotificationSound = () => {
    try {
      SoundPlayer.playSoundFile('notification', 'mp3');
    } catch (e) {
      console.log('Cannot play the sound file', e);
    }
  };

  useEffect(() => {
    getToken();
    requestUserPermission();

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('getInitialNotification: Notification caused app to open from quit state');
          handleNotification(remoteMessage);
          playNotificationSound();

        }
      });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        console.log('onNotificationOpenedApp: Notification caused app to open from background state');
        handleNotification(remoteMessage);
        playNotificationSound();
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      handleNotification(remoteMessage);
      playNotificationSound();
    });

    messaging().subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Subscribed`);
      });

    return () => {
      unsubscribe;
    };
  }, []);
  useEffect(() => {
    requestLocationPermission()
  }, [])

  return (
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