// import React, { useEffect } from 'react';
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

// const Stack = createStackNavigator();

// const StackNavigator = () => (
  
//   <Stack.Navigator initialRouteName="Login"> 
//     <Stack.Screen name="Login" component={LoginScreen} />
//     <Stack.Screen name="Otp" component={OtpScreen} />
//     <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
//     <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
//     <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
//     <Stack.Screen
//       name="MyVehicles"
//       component={MyVehiclesScreen}
//       options={{ header: () => <MyVehiclesHeader /> }}
//     />
//     <Stack.Screen name="DriverMap" component={DriverMapScreen} />
//     <Stack.Screen
//       name="Dashboards"
//       component={DrawerNavigator} 
//       options={{ headerShown: false }} 
//     />
//   </Stack.Navigator>
// );

// export default StackNavigator;


import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screen/LoginScreen';
import OtpScreen from '../src/screen/OtpScreen';
import OwnerDetailScreen from '../src/screen/OwnerDetail';
import DriverDetailScreen from '../src/screen/DriverDetailScreen';
import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
import MyVehiclesHeader from '../src/components/MyVehiclesHeader/MyVehiclesHeader';
import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
import DrawerNavigator from './DrawerNavigaton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import UpdateBankDetailsScreen from '../src/screen/UpdateBankDetails/UpdateBankDetailsScreen';
import RideCompleteScreen from '../src/screen/DashBoard/screen/RideCompleteScreen';
import AmountCollectScreen from '../src/screen/DashBoard/screen/AmountCollectScreen';
import DriverDashboard from '../src/screen/DashBoard/DriverDashboard';
import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
import Earning from '../src/screen/DriverEarning/DriverEarning';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPartnerName = async () => {
      try {
        // await AsyncStorage.removeItem('partner_id')
        // await AsyncStorage.removeItem('partner_name')
        // await AsyncStorage.setItem('partner_name', JSON.stringify(24));
        // await AsyncStorage.setItem('partner_name', 'Salman');


        const partnerName = await AsyncStorage.getItem('partner_name');
        const partnerId=  await AsyncStorage.getItem('partner_id');

        console.log('====================================');
        console.log(partnerName,partnerId);
        console.log('====================================');

        if (partnerName === '-' || partnerName === null || !partnerName||!partnerId) {
          setInitialRoute('Dashboards');
          // setInitialRoute('DriverDashboard');

        } else {
          setInitialRoute('Dashboards');
        }
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setLoading(false); 
      }
    };

    checkPartnerName();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
        <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        <Stack.Screen name="UpdateBankDetails" component={UpdateBankDetailsScreen} />
        <Stack.Screen name="rideComplete" component={RideCompleteScreen} />
        <Stack.Screen name="AmountCollect" component={AmountCollectScreen} />
        <Stack.Screen name="DriverDashboard" component={DriverDashboard}  options={{ headerShown: false }}/>
        <Stack.Screen name="Trip" component={LiveTripScreen}   options={{ headerShown: false }}/>
        <Stack.Screen name="Earning" component={Earning}
     options={{headerShown: false}}
    />

        <Stack.Screen
          name="MyVehicles"
          component={MyVehiclesScreen}
          options={{ header: () => <MyVehiclesHeader /> }}
        />
        <Stack.Screen name="DriverMap" component={DriverMapScreen} />
        <Stack.Screen
          name="Dashboards"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

export default StackNavigator;
