import React from 'react';
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

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Login"> 
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Otp" component={OtpScreen} />
    <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
    <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
    <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
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

export default StackNavigator;
