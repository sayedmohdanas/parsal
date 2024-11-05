import React, { useEffect, useState } from 'react';
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

import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getPartner } from '../src_/config/url';
import Loading from '../src/components/Loading/Loading';
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
  const partnerDetail = useSelector(state => state?.parsalPartner?.partnerDetail || false);
  const [initialRouteName, setInitialRouteName] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true);
    if (partnerDetail === 2) {
      setInitialRouteName('Trip');
    } else {
      setInitialRouteName('MyVehicles');
    }
    setLoading(false); 
  }, [partnerDetail]);

  if (loading || !initialRouteName) {
    // Render the Loading component while determining the initial route
    return <Loading loading={loading} />;
  }
  return (
    <OwnerDrawer.Navigator
      initialRouteName={initialRouteName}
      drawerContent={props => <Menu {...props} owner={1} />}
    >
      
      <OwnerDrawer.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen name="Help" component={HelpAndSupportChat} />
      <OwnerDrawer.Screen
        name="Earning"
        component={Earning}
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen
        name="orderinfo"
        component={OrderInfo}
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen name="AddCash" component={AddCashScreen} />
      <OwnerDrawer.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <OwnerDrawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
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
