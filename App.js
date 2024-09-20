import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import StackNavigator from './navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging'
import NotificationModal from './src/components/CustomNotificationModal/NotificationModal';
const TOPIC = 'MyNews';



export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', body: '' });


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  const getToken =async ()=>{
    const token = await messaging().getToken();
    console.log(token,'token---')

  }

  const handleNotification = (remoteMessage) => {
    const { title, body } = remoteMessage.notification;
    setNotificationData({ title, body });
    setModalVisible(true);

    Alert.alert(
      title,
      body,
      [
        { text: 'Reject', onPress: () => console.log('Rejected') },
        { text: 'Accept', onPress: () => console.log('Accepted') }
      ]
    );
  };
  const handleAccept = () => {
    console.log('Accepted');
    setModalVisible(false);
  };
  const handleReject = () => {
    console.log('Rejected');
    setModalVisible(false);
  };

  // setInterval(()=>{
  //   setNotificationData({title:"New Delivery Request",body:"A parcel is ready for pickup. Tap to view details and accept the delivery"})
  //   setModalVisible(true);

  // },5000)


  React.useEffect(() => {
    /**
     * When a notification from FCM has triggered the application
     * to open from a quit state, this method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */ 
    getToken()
    requestUserPermission()
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
            'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
          handleNotification(remoteMessage);
          // alert(
          //   'getInitialNotification: Notification caused app to' +
          //   ' open from quit state',
          // );
        }
      });
    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        console.log(
          'onNotificationOpenedApp: ' +
          'Notification caused app to open from background state',
        );
        console.log(remoteMessage);
        handleNotification(remoteMessage);

        // alert(
        //   'onNotificationOpenedApp: Notification caused app to' +
        //   ' open from background state',
        // );
      }
    });
    /**
     * Set a message handler function which is called when
     * the app is in the background or terminated. In Android,
     * a headless task is created, allowing you to access the
     * React Native environment to perform tasks such as updating
     * local storage, or sending a network request.
     */
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);

    });
    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      handleNotification(remoteMessage);

    });
    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });
    return () => {
      unsubscribe;
      /**
       * Unsubscribe the device from a topic.
       */
      // messaging().unsubscribeFromTopic(TOPIC);
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
    backgroundColor: '#ffffff',
  },
});



