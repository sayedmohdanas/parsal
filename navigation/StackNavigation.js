import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../src/screen/LoginScreen';
import OtpScreen from '../src/screen/OtpScreen';
import OwnerDetailScreen from '../src/screen/OwnerDetail';
import DriverDetailScreen from '../src/screen/DriverDetailScreen';
import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
import { DriverDrawerNavigator, OwnerDrawerNavigator } from './DrawerNavigaton';
import Loading from '../src/components/Loading/Loading';
import { setOwner, setPartnerdetails, setShowDashBoard } from '../src/redux/HitApis/HitApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import TermsAndCondition from '../src/screen/TermsAndCondition/TermsAndCondition';
import Earning from '../src/screen/DriverEarning/DriverEarning';
import UpdateDriver from '../src/screen/MyVehiclesScreen/UpdateDriver';
import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
import TransactionHistory from '../src/screen/TransactionHistory';
import { hitGetUserDetails } from '../src/config/api/api';
import AccountScreen from '../src/screen/AccountScreen/AccountScreen';
import HelpAndSupportMain from '../src/screen/HelpAndSupport/HelpAndSupportMain';
import AddHelpAndSupport from '../src/screen/HelpAndSupport/AddHelpAndSupport';
import ChatScreen from '../src/screen/DashBoard/Chat/ChatScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();
  const showDashBoard = useSelector(
    state => state?.parsalPartner?.showDashBoard || false,
  );
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      try {
        const user = await AsyncStorage.getItem('user');
        if (!user) {
          setInitialRoute('Login');
        } else {
          if (user.startsWith('{')) {
            try {
              const parsedUser = JSON.parse(user);
              const ownerType = parsedUser?.payload?.owner_type;
              const partnerId = parsedUser?.payload?.partner_id;
              console.log('partner__id====>>>>>>>', parsedUser)
              if (ownerType === 0) {
                console.log('hello-anas==>', ownerType);

                setInitialRoute('DriverDashboard');
              } else if (ownerType == 1 || ownerType == 2) {
                console.log('hello-anas', ownerType);
                const response = await hitGetUserDetails({ partner_id: partnerId })
                console.log(response, 'responsedromstacknav')
                if (response?.status == 1) {
                  dispatch(setShowDashBoard(true))
                  if (showDashBoard) {
                    console.log('showDashboard', showDashBoard);
                    dispatch(setPartnerdetails(2))
                    setInitialRoute('OwnerDashboard');

                  }

                  dispatch(setPartnerdetails(2))
                  setInitialRoute('OwnerDashboard');



                } else {
                  // Alert.alert('4')
                  // if(showDashBoard){

                  // console.log('showDashboard',showDashBoard);
                  //   dispatch(setPartnerdetails(1))
                  //   setInitialRoute('OwnerDashboard');

                  // }
                  dispatch(setPartnerdetails(1))


                  setInitialRoute('OwnerDashboard');

                }
                // setInitialRoute('OwnerDashboard');
              } else {
                setInitialRoute('Login');
              }
            } catch (jsonError) {
              setInitialRoute('Login');
            }
          } else {
            console.log('Invalid user data format, navigating to Login');
            setInitialRoute('Login');
          }
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setInitialRoute('Login');
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="TermsCondition" component={TermsAndCondition} />
      <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
      <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="UpdateDriver" component={UpdateDriver} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Setting" component={AccountScreen} />
      <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
   
       <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpandSupport"
        component={HelpAndSupportMain}
      />
      <Stack.Screen
        name="TicketSubmission"
        component={AddHelpAndSupport}
      />
      <Stack.Screen
        name="DriverDashboard"
        component={DriverDrawerNavigator} // Driver's drawer
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OwnerDashboard"
        component={OwnerDrawerNavigator} // Owner's drawer
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
