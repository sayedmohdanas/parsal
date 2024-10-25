// import React, { useEffect, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../src/screen/LoginScreen';
// import OtpScreen from '../src/screen/OtpScreen';
// import OwnerDetailScreen from '../src/screen/OwnerDetail';
// import DriverDetailScreen from '../src/screen/DriverDetailScreen';
// import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
// import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
// import MyVehiclesHeader from '../src/components/MyVehiclesHeader/MyVehiclesHeader';
// import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
// import DrawerNavigator from './DrawerNavigaton';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { ActivityIndicator, View } from 'react-native';
// import UpdateBankDetailsScreen from '../src/screen/UpdateBankDetails/UpdateBankDetailsScreen';
// import RideCompleteScreen from '../src/screen/DashBoard/screen/RideCompleteScreen';
// import AmountCollectScreen from '../src/screen/DashBoard/screen/AmountCollectScreen';
// import DriverDashboard from '../src/screen/DashBoard/DriverDashboard';
// import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
// import Earning from '../src/screen/DriverEarning/DriverEarning';
// const Stack = createStackNavigator();
// const StackNavigator = () => {
//   const [initialRoute, setInitialRoute] = useState(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const checkPartnerName = async () => {
//       try {
//         // await AsyncStorage.removeItem('partner_id')
//         // await AsyncStorage.removeItem('partner_name')
//         // await AsyncStorage.setItem('partner_name', JSON.stringify(24));
//         // await AsyncStorage.setItem('partner_name', 'Salman');
//         const partnerName = await AsyncStorage.getItem('partner_name');
//         const partnerId=  await AsyncStorage.getItem('partner_id');
//         console.log('====================================');
//         console.log(partnerName,partnerId);
//         console.log('====================================');
//         if (partnerName === '-' || partnerName === null || !partnerName||!partnerId) {
//           setInitialRoute('Dashboards');
//           // setInitialRoute('DriverDashboard');
//         } else {
//           setInitialRoute('Dashboards');
//         }
//       } catch (error) {
//         setInitialRoute('Login');
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkPartnerName();
//   }, []);
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//   return (
//       <Stack.Navigator initialRouteName={initialRoute}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Otp" component={OtpScreen} />
//         <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
//         <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
//         <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
//         <Stack.Screen name="UpdateBannkDetails" component={UpdateBankDetailsScreen} />
//         <Stack.Screen name="rideComplete" component={RideCompleteScreen} />
//         <Stack.Screen name="AmountCollect" component={AmountCollectScreen} />
//         <Stack.Screen name="DriverDashboard" component={DriverDashboard}  options={{ headerShown: false }}/>
//         <Stack.Screen name="Trip" component={LiveTripScreen}   options={{ headerShown: false }}/>
//         <Stack.Screen name="Earning" component={Earning}
//      options={{headerShown: false}}
//     />
//         <Stack.Screen
//           name="MyVehicles"
//           component={MyVehiclesScreen}
//           options={{ header: () => <MyVehiclesHeader /> }}
//         />
//         <Stack.Screen name="DriverMap" component={DriverMapScreen} />
//         <Stack.Screen
//           name="Dashboards"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//   );
// };
// export default StackNavigator;





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
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen}  options={{headerShown: false}} />


      
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
