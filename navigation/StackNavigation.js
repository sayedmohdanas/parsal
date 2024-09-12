// // // import React from 'react';
// // // import { createStackNavigator } from '@react-navigation/stack';
// // // import { NavigationContainer } from '@react-navigation/native';
// // // import LoginScreen from '../src/screen/LoginScreen';
// // // import OtpScreen from '../src/screen/OtpScreen';
// // // import OwnerDetailScreen from '../src/screen/OwnerDetail';
// // // import DriverDetailScreen from '../src/screen/DriverDetailScreen';
// // // import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
// // // import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';

// // // const Stack = createStackNavigator();

// // // const StackNavigator = () => (
 
// // //     <Stack.Navigator initialRouteName="VehicleDetail">
// // //       <Stack.Screen name="Login" component={LoginScreen} />
// // //       <Stack.Screen name="Otp" component={OtpScreen} />
// // //       <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
// // //       <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
// // //       <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
// // //       <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />




// // //     </Stack.Navigator>
 
// // // );

// // // export default StackNavigator;
// // import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from '../src/screen/LoginScreen';
// import OtpScreen from '../src/screen/OtpScreen';
// import OwnerDetailScreen from '../src/screen/OwnerDetail';
// import DriverDetailScreen from '../src/screen/DriverDetailScreen';
// import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
// import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
// import MyVehiclesHeader from '../src/components/MyVehiclesHeader/MyVehiclesHeader';
// import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
// import Earning from '../src/screen/DriverEarning/DriverEarning';
// // import DashboardScreen from '../src/screen/DashBoardScreen/DashBoardScreen';

// // const Stack = createStackNavigator();

// // const StackNavigator = () => (
// //     <Stack.Navigator initialRouteName="Dashboard">
// //       <Stack.Screen name="Login" component={LoginScreen} />
// //       <Stack.Screen name="Otp" component={OtpScreen} />
// //       <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
// //       <Stack.Screen name="DriverDetail" component={DriverDetailScreen} 
// //       />
// //             <Stack.Screen name="Earning" component={Earning} 
// //       />
// //       <Stack.Screen
// //         name="VehicleDetail"
// //         component={VehicleDetailScreen}
        
// //       />
// //       <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} options={{
// //           header: () =><MyVehiclesHeader/>,
// //         }} />
// //         <Stack.Screen name="DriverMap" component={DriverMapScreen} 
// //       />

// // <Stack.Screen
// //         name="Dashboard"
// //         component={DashboardScreen}
// //         options={{
// //           headerShown: false, // Hide the header for DashboardScreen
// //         }}
// //       />
// //     </Stack.Navigator>
// // );

// // export default StackNavigator;
// // src/navigation/StackNavigation.js
// import React from 'react';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import { NavigationContainer } from '@react-navigation/native';
// // import LoginScreen from '../screen/LoginScreen';
// // import OtpScreen from '../screen/OtpScreen';
// // import OwnerDetailScreen from '../screen/OwnerDetail';
// // import DriverDetailScreen from '../screen/DriverDetailScreen';
// // import VehicleDetailScreen from '../screen/VehicleDetailScreen';
// // import MyVehiclesScreen from '../screen/MyVehiclesScreen';
// // import MyVehiclesHeader from '../components/MyVehiclesHeader/MyVehiclesHeader';
// // import DriverMapScreen from '../screen/DriverMapScreen/DriverMap';
// import DrawerNavigator from './DrawerNavigaton';

// const Stack = createStackNavigator();

// const StackNavigator = () => (
//   <Stack.Navigator initialRouteName="Dashboard">
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
//       name="Dashboard"
//       component={DrawerNavigator} // Use DrawerNavigator for Dashboard screen
//       options={{ headerShown: false }} // Hide header for Dashboard screen
//     />
//   </Stack.Navigator>
// );

// export default StackNavigator;








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
  <Stack.Navigator initialRouteName="Dashboards">
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
      component={DrawerNavigator} // Use DrawerNavigator for the Dashboard screen
      options={{ headerShown: false }} // Hide header for Dashboard screen
    />
  </Stack.Navigator>
);

export default StackNavigator;
