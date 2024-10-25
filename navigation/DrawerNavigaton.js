
// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import DashboardScreen from '../src/screen/DashBoard/DashBoardScreen';
// import Earning from '../src/screen/DriverEarning/DriverEarning';
// import PaymentsScreen from '../src/screen/DashBoard/screen/Payments/PaymentsScreen';
// import LoansScreen from '../src/screen/DashBoard/screen/Loans/LoansScreen';
// import TrainingScreen from '../src/screen/DashBoard/screen/Training/TrainingScreen';
// import NotificationsScreen from '../src/screen/DashBoard/screen/Notifications/NotificationsScreen';
// import ProfileScreen from '../src/screen/DashBoard/screen/Profile/ProfileScreen';
// import PrivacyPolicyScreen from '../src/screen/DashBoard/screen/PrivacyPolicy/PrivacyPolicyScreen';
// import Menu from '../src/screen/DashBoard/components/Menu';
// import LedgerScreen from '../src/screen/DashBoard/screen/Ledger/LedgerScreen';
// import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
// import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
// import SettingScreen from '../src/screen/DashBoard/screen/SettingScreen/SettingScreen';
// import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
// const Drawer = createDrawerNavigator();
// const DrawerNavigator = () => (
//   <Drawer.Navigator
//     drawerContent={(props) => <Menu {...props} />} // Pass navigation props to your Menu
//   >
//     <Drawer.Screen name="Dashboard" component={DashboardScreen} />
//     <Drawer.Screen name="Trip" component={LiveTripScreen}
//        options={{headerShown: false}}
//     />
//     <Drawer.Screen name="Earning" component={Earning}
//      options={{headerShown: false}}
//     />
//     <Drawer.Screen name="Ledger" component={LedgerScreen} />
//     <Drawer.Screen name="Payments" component={PaymentsScreen} />
//     <Drawer.Screen name="Loans" component={LoansScreen} />
//     <Drawer.Screen name="Training" component={TrainingScreen} />
//     <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//     <Drawer.Screen name="Profile" component={ProfileScreen} />
//     <Drawer.Screen name="ProfileDetail" component={ProfileDetail}options={{
//             headerTitle: 'Driver Name',
//           }} />
//     <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
//     <Drawer.Screen name="DriverMap" component={DriverMapScreen} />
//     <Drawer.Screen name="Setting" component={SettingScreen}
//        options={{headerShown: false}}
//     />
//     {/* <Stack.Screen name="DriverMap" component={DriverMap} /> */}
//   </Drawer.Navigator>
// );
// export default DrawerNavigator;



















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
import { Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderInfo from '../src/screen/DashBoard/screen/OrderInfo/OrderInfoScreen';
import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
import ChatScreen from '../src/screen/DashBoard/Chat/ChatScreen';
import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
import AddCashScreen from '../src/screen/DashBoard/screen/Wallet/AddCachScreen';
import HelpAndSupportChat from '../src/screen/DashBoard/screen/HelpAndSupport/HelpAndSupportChat';

// Driver Drawer
const DriverDrawer = createDrawerNavigator();

const DriverDrawerNavigator = () => {
  return (
    <DriverDrawer.Navigator drawerContent={props => <Menu {...props}   />}>
      <DriverDrawer.Screen name="DriverDashboard" component={DriverDashboard} />
      <DriverDrawer.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{ headerShown: false }}
      />
      <DriverDrawer.Screen
        name="Earning"
        component={Earning}
        options={{ headerShown: false }}
      />
      <DriverDrawer.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <OwnerDrawer.Screen name="orderinfo" component={OrderInfo} options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="Wallet" component={WalletScreen}  options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="AddCash" component={AddCashScreen}  />
      <OwnerDrawer.Screen name="Help" component={HelpAndSupportChat} options={{ headerShown: false }} />



      <DriverDrawer.Screen name="DriverMap" component={DriverMapScreen} />
      <DriverDrawer.Screen name="AmountCollected" component={AmountCollectScreen} />
      <DriverDrawer.Screen name="RideCompleteScreen" component={RideCompleteScreen} />


    </DriverDrawer.Navigator>
  );
};

// Owner Drawer
const OwnerDrawer = createDrawerNavigator();
//     <Drawer.

const OwnerDrawerNavigator = () => {
  return (
    <OwnerDrawer.Navigator 
    drawerContent={props => <Menu {...props} owner={1} />}>
      {/* Include direct screen components for the owner */}
      <OwnerDrawer.Screen name="Trip" component={LiveTripScreen} options={{ headerShown: false }} />
          <OwnerDrawer.Screen name="Help" component={HelpAndSupportChat}  />
      <OwnerDrawer.Screen name="MyVehicles" component={MyVehiclesScreen} options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="Earning"component={Earning} options={{ headerShown: false }}/>
          <OwnerDrawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <OwnerDrawer.Screen name="orderinfo" component={OrderInfo} options={{ headerShown: false }} />
          <OwnerDrawer.Screen name="ProfileDetail" component={ProfileDetail}options={{
            headerTitle: 'Driver Name',
          }} />
      <OwnerDrawer.Screen name="AddBank" component={UpdateBankDetailsScreen} />
      <OwnerDrawer.Screen name="Wallet" component={WalletScreen}   options={{ headerShown: false }}/>
      <OwnerDrawer.Screen name="AddCash" component={AddCashScreen}  />
      <OwnerDrawer.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      <OwnerDrawer.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
      <DriverDrawer.Screen name="DriverMap" component={DriverMapScreen} />
      <DriverDrawer.Screen name="AmountCollected" component={AmountCollectScreen} />
      <DriverDrawer.Screen name="RideCompleteScreen" component={RideCompleteScreen} />
      {/* Add other owner-specific screens here */}
    </OwnerDrawer.Navigator>
  );
};

// Export both navigators
export { OwnerDrawerNavigator, DriverDrawerNavigator };
