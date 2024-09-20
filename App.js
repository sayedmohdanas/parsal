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

const TOPIC = 'MyNews';

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', body: '' });

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
    const { title, body } = remoteMessage.notification;
    setNotificationData({ title, body });
    setModalVisible(true);
    // Alert.alert(
    //   title,
    //   body,
    //   [
    //     { text: 'Reject', onPress: () => console.log('Rejected') },
    //     { text: 'Accept', onPress: () => console.log('Accepted') }
    //   ]
    // );
  };

  const handleAccept = () => {
    console.log('Accepted');
    setModalVisible(false);
  };

  const handleReject = () => {
    console.log('Rejected');
    setModalVisible(false);
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
        }
      });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        console.log('onNotificationOpenedApp: Notification caused app to open from background state');
        handleNotification(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      handleNotification(remoteMessage);
    });

    messaging().subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Subscribed`);
      });

    return () => {
      unsubscribe;
    };
  }, []);

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
          onClose={() => setModalVisible(false)}
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