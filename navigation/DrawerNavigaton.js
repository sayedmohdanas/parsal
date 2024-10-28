import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DriverDashboard from '../src/screen/DashBoard/DriverDashboard';
import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
import Earning from '../src/screen/DriverEarning/DriverEarning';
import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
import Menu from '../src/screen/DashBoard/components/Menu';
import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
import AmountCollectScreen from '../src/screen/DashBoard/screen/AmountCollectScreen';
import UpdateBankDetailsScreen from '../src/screen/UpdateBankDetails/UpdateBankDetailsScreen';
import RideCompleteScreen from '../src/screen/DashBoard/screen/RideCompleteScreen';
import ProfileScreen from '../src/screen/DashBoard/screen/Profile/ProfileScreen';
import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
import OrderInfo from '../src/screen/DashBoard/screen/OrderInfo/OrderInfoScreen';
import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
import ChatScreen from '../src/screen/DashBoard/Chat/ChatScreen';
import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
import AddCashScreen from '../src/screen/DashBoard/screen/Wallet/AddCachScreen';
import HelpAndSupportChat from '../src/screen/DashBoard/screen/HelpAndSupport/HelpAndSupportChat';
import TransactionHistory from '../src/screen/TransactionHistory';
import HelpAndSupportMain from '../src/screen/HelpAndSupport/HelpAndSupportMain';
import AddHelpAndSupport from '../src/screen/HelpAndSupport/AddHelpAndSupport';

// Driver Drawer
// const DriverDrawer = createDrawerNavigator();

// const DriverDrawerNavigator = () => {
//   return (
//     <DriverDrawer.Navigator drawerContent={props => <Menu {...props} />}>
//       <DriverDrawer.Screen name="DriverDashboard" component={DriverDashboard} />
//       <DriverDrawer.Screen
//         component={LiveTripScreen}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen
//         name="Earning"
//         component={Earning}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen name="MyVehicles" component={MyVehiclesScreen} />
//       <DriverDrawer.Screen
//         name="orderinfo"
//         component={OrderInfo}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen
//         name="Notification"
//         component={Notification}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen
//         name="Wallet"
//         component={WalletScreen}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen
//         name="HelpChat"
//         component={HelpAndSupportChat}
//         options={{headerShown: false}}
//       />
//       <DriverDrawer.Screen name="AddCash" component={AddCashScreen} />
//       <DriverDrawer.Screen name="DriverMap" component={DriverMapScreen} />
//       <DriverDrawer.Screen
//         name="HelpandSupport"
//         component={HelpAndSupportMain}
//       />
//       <DriverDrawer.Screen
//         name="TicketSubmission"
//         component={AddHelpAndSupport}
//       />

//       <DriverDrawer.Screen
//         name="AmountCollected"
//         component={AmountCollectScreen}
//       />
//       <DriverDrawer.Screen
//         name="RideCompleteScreen"
//         component={RideCompleteScreen}
//       />
// <DriverDrawer.Screen
//   name="TransactionHistory"
//   component={TransactionHistory}
// />
//     </DriverDrawer.Navigator>
//   );
// };

// // Owner Drawer
// const OwnerDrawer = createDrawerNavigator();

// const OwnerDrawerNavigator = () => {
//   return (
//     <OwnerDrawer.Navigator
//       drawerContent={props => <Menu {...props} owner={1} />}>
//       <OwnerDrawer.Screen
//         name="Trip"
//         component={LiveTripScreen}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="MyVehicles"
//         component={MyVehiclesScreen}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="Earning"
//         component={Earning}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="orderinfo"
//         component={OrderInfo}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="Wallet"
//         component={WalletScreen}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="Notification"
//         component={Notification}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="Chat"
//         component={ChatScreen}
//         options={{headerShown: false}}
//       />
//       <OwnerDrawer.Screen
//         name="ProfileDetail"
//         component={ProfileDetail}
//         options={{headerTitle: 'Driver Name'}}
//       />
// <OwnerDrawer.Screen
//   name="TransactionHistory"
//   component={TransactionHistory}
// />
//       <OwnerDrawer.Screen name="HelpChat" component={HelpAndSupportChat} />

//       <OwnerDrawer.Screen name="AddBank" component={UpdateBankDetailsScreen} />
//       <OwnerDrawer.Screen
//         name="HelpandSupport"
//         component={HelpAndSupportMain}
//       />
//       <OwnerDrawer.Screen
//         name="TicketSubmission"
//         component={AddHelpAndSupport}
//       />

//       <OwnerDrawer.Screen name="AddCash" component={AddCashScreen} />
//       <OwnerDrawer.Screen name="DriverMap" component={DriverMapScreen} />
//       <OwnerDrawer.Screen
//         name="AmountCollected"
//         component={AmountCollectScreen}
//       />
//       <OwnerDrawer.Screen
//         name="RideCompleteScreen"
//         component={RideCompleteScreen}
//       />
//     </OwnerDrawer.Navigator>
//   );
// };

// export {OwnerDrawerNavigator, DriverDrawerNavigator};
// import React from 'react';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import DriverDashboard from '../src/screen/DashBoard/DriverDashboard';
// import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
// import Earning from '../src/screen/DriverEarning/DriverEarning';
// import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
// import Menu from '../src/screen/DashBoard/components/Menu';
// import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
// import AmountCollectScreen from '../src/screen/DashBoard/screen/AmountCollectScreen';
// import UpdateBankDetailsScreen from '../src/screen/UpdateBankDetails/UpdateBankDetailsScreen';
// import RideCompleteScreen from '../src/screen/DashBoard/screen/RideCompleteScreen';
// import ProfileScreen from '../src/screen/DashBoard/screen/Profile/ProfileScreen';
// import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
// import { Alert } from 'react-native';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import OrderInfo from '../src/screen/DashBoard/screen/OrderInfo/OrderInfoScreen';
// import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
// import ChatScreen from '../src/screen/DashBoard/Chat/ChatScreen';
// import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
// import AddCashScreen from '../src/screen/DashBoard/screen/Wallet/AddCachScreen';
// import HelpAndSupportChat from '../src/screen/DashBoard/screen/HelpAndSupport/HelpAndSupportChat';
// Driver Drawer
const DriverDrawer = createDrawerNavigator();
const DriverDrawerNavigator = () => {
  return (
    <DriverDrawer.Navigator drawerContent={props => <Menu {...props} />}>
      <DriverDrawer.Screen name="DriverDashboard" component={DriverDashboard} />
      <DriverDrawer.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{headerShown: false}}
      />
      <DriverDrawer.Screen
        name="Earning"
        component={Earning}
        options={{headerShown: false}}
      />
      <DriverDrawer.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <OwnerDrawer.Screen
        name="orderinfo"
        component={OrderInfo}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen name="AddCash" component={AddCashScreen} />
      <OwnerDrawer.Screen
        name="Help"
        component={HelpAndSupportChat}
        options={{headerShown: false}}
      />
      <DriverDrawer.Screen name="DriverMap" component={DriverMapScreen} />
      <DriverDrawer.Screen
        name="HelpandSupport"
        component={HelpAndSupportMain}
      />
      <DriverDrawer.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      />
      <DriverDrawer.Screen name="HelpChat" component={HelpAndSupportChat} />

      <DriverDrawer.Screen
        name="TicketSubmission"
        component={AddHelpAndSupport}
      />
      <DriverDrawer.Screen
        name="AmountCollected"
        component={AmountCollectScreen}
      />
      <DriverDrawer.Screen
        name="RideCompleteScreen"
        component={RideCompleteScreen}
      />
    </DriverDrawer.Navigator>
  );
};
const OwnerDrawer = createDrawerNavigator();
const OwnerDrawerNavigator = () => {
  return (
    <OwnerDrawer.Navigator
      drawerContent={props => <Menu {...props} owner={1} />}>
      {/* Include direct screen components for the owner */}
      <OwnerDrawer.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen name="Help" component={HelpAndSupportChat} />
      <OwnerDrawer.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Earning"
        component={Earning}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="orderinfo"
        component={OrderInfo}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="ProfileDetail"
        component={ProfileDetail}
        options={{
          headerTitle: 'Driver Name',
        }}
      />
      <OwnerDrawer.Screen name="AddBank" component={UpdateBankDetailsScreen} />
      <OwnerDrawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen name="AddCash" component={AddCashScreen} />
      <OwnerDrawer.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <OwnerDrawer.Screen
        name="HelpandSupport"
        component={HelpAndSupportMain}
      />
      <OwnerDrawer.Screen
        name="TicketSubmission"
        component={AddHelpAndSupport}
      />
      <DriverDrawer.Screen name="DriverMap" component={DriverMapScreen} />
      <DriverDrawer.Screen
        name="AmountCollected"
        component={AmountCollectScreen}
      />
      <DriverDrawer.Screen
        name="RideCompleteScreen"
        component={RideCompleteScreen}
      />
      <OwnerDrawer.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      />
      <OwnerDrawer.Screen name="HelpChat" component={HelpAndSupportChat} />
      {/* Add other owner-specific screens here */}
    </OwnerDrawer.Navigator>
  );
};
// Export both navigators
export {OwnerDrawerNavigator, DriverDrawerNavigator};
