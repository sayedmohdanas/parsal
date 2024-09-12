// // src/navigation/DrawerNavigator.js
// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import DashboardScreen from '../src/screen/DashBoard/DashBoardScreen';
// import Earning from '../src/screen/DriverEarning/DriverEarning';
// import Menu from '../src/screen/DashBoard/components/Menu';

// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => (
//   <Drawer.Navigator
//     drawerContent={(props) => <Menu {...props} />} // Pass navigation props to your Menu
//   >
//     <Drawer.Screen name="Dashboard" component={DashboardScreen} />
//     <Drawer.Screen name="Earning" component={Earning} />
//     {/* Add other drawer screens if needed */}
//   </Drawer.Navigator>
// );

// export default DrawerNavigator;
// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../src/screen/DashBoard/DashBoardScreen';
import Earning from '../src/screen/DriverEarning/DriverEarning';
import PaymentsScreen from '../src/screen/DashBoard/screen/Payments/PaymentsScreen';
import LoansScreen from '../src/screen/DashBoard/screen/Loans/LoansScreen';
import TrainingScreen from '../src/screen/DashBoard/screen/Training/TrainingScreen';
import NotificationsScreen from '../src/screen/DashBoard/screen/Notifications/NotificationsScreen';
import ProfileScreen from '../src/screen/DashBoard/screen/Profile/ProfileScreen';
import PrivacyPolicyScreen from '../src/screen/DashBoard/screen/PrivacyPolicy/PrivacyPolicyScreen';
import Menu from '../src/screen/DashBoard/components/Menu';
import LedgerScreen from '../src/screen/DashBoard/screen/Ledger/LedgerScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <Menu {...props} />} // Pass navigation props to your Menu
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Earning" component={Earning} />
    <Drawer.Screen name="Ledger" component={LedgerScreen} />

    <Drawer.Screen name="Payments" component={PaymentsScreen} />
    <Drawer.Screen name="Loans" component={LoansScreen} />
    <Drawer.Screen name="Training" component={TrainingScreen} />
    <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
