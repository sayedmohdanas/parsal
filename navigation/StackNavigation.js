import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ActivityIndicator, Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../src/screen/LoginScreen';
import OtpScreen from '../src/screen/OtpScreen';
import OwnerDetailScreen from '../src/screen/OwnerDetail';
import DriverDetailScreen from '../src/screen/DriverDetailScreen';
import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
import {DriverDrawerNavigator, OwnerDrawerNavigator} from './DrawerNavigaton';
import Loading from '../src/components/Loading/Loading';
import {setOwner} from '../src/redux/HitApis/HitApiSlice';
import {useDispatch} from 'react-redux';
import TermsAndCondition from '../src/screen/TermsAndCondition/TermsAndCondition';
import Earning from '../src/screen/DriverEarning/DriverEarning';
import UpdateDriver from '../src/screen/MyVehiclesScreen/UpdateDriver';
import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
import TransactionHistory from '../src/screen/TransactionHistory';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();

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
              if (ownerType === 0) {
                setInitialRoute('DriverDashboard');
              } else if (ownerType == 1 || ownerType == 2) {
                setInitialRoute('OwnerDashboard');
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
      <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="DriverDashboard"
        component={DriverDrawerNavigator} // Driver's drawer
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OwnerDashboard"
        component={OwnerDrawerNavigator} // Owner's drawer
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
