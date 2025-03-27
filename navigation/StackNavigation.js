import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screen/LoginScreen';
import OtpScreen from '../src/screen/OtpScreen';
import OwnerDetailScreen from '../src/screen/OwnerDetail';
import DriverDetailScreen from '../src/screen/DriverDetailScreen';
import VehicleDetailScreen from '../src/screen/VehicleDetailScreen';
import TermsAndCondition from '../src/screen/TermsAndCondition/TermsAndCondition';
import UpdateDriver from '../src/screen/MyVehiclesScreen/UpdateDriver';
import ProfileDetail from '../src/screen/DashBoard/screen/ProfileDetailScreen/ProfileDetailScreen';
import Notification from '../src/screen/DashBoard/screen/Notification/Notification';
import MyVehiclesScreen from '../src/screen/MyVehiclesScreen';
import WalletScreen from '../src/screen/DashBoard/screen/Wallet/WalletScreen';
import TransactionHistory from '../src/screen/TransactionHistory';
import DriverDashboard from '../src/screen/DashBoard/DriverDashboard';
import LiveTripScreen from '../src/screen/DashBoard/screen/LiveTripScreen/LiveTrip';
import Earning from '../src/screen/DriverEarning/DriverEarning';
import DriverMapScreen from '../src/screen/DriverMapScreen/DriverMap';
import AmountCollectScreen from '../src/screen/DashBoard/screen/AmountCollectScreen';
import UpdateBankDetailsScreen from '../src/screen/UpdateBankDetails/UpdateBankDetailsScreen';
import RideCompleteScreen from '../src/screen/DashBoard/screen/RideCompleteScreen';
import ProfileScreen from '../src/screen/DashBoard/screen/Profile/ProfileScreen';
import OrderInfo from '../src/screen/DashBoard/screen/OrderInfo/OrderInfoScreen';
import ChatScreen from '../src/screen/DashBoard/Chat/ChatScreen';
import AddCashScreen from '../src/screen/DashBoard/screen/Wallet/AddCachScreen';
import HelpAndSupportChat from '../src/screen/DashBoard/screen/HelpAndSupport/HelpAndSupportChat';
import HelpAndSupportMain from '../src/screen/HelpAndSupport/HelpAndSupportMain';
import AddHelpAndSupport from '../src/screen/HelpAndSupport/AddHelpAndSupport';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../src/components/Loading/Loading';
import AccountScreen from '../src/screen/AccountScreen/AccountScreen';
import LedgerScreen from '../src/screen/DashBoard/screen/LedgerScreen';
import {
  hitGetDriverDetails,
  hitGetLiveOrderApi,
  hitGetPartner,
  hitGetWalletBalanceApi,
  hitMyVehicle,
} from '../src/config/api/api';
import {
  setOrderData,
  setlivetripmenu,
  setloginuserdetails,
  setnextOrderData,
  setupdate_order,
  setwalletBalance,
} from '../src/redux/HitApis/HitApiSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import OrderScreen from '../src/screen/OrderList/OrderScreen';
import AuthWrapper from '../src/common/AuthWrapper';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);








  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      try {
        const user = await AsyncStorage.getItem('user');
        if (!user) {
          setInitialRoute('Login');
        } else if (user.startsWith('{')) {
          try {
            const parsedUser = JSON.parse(user);
            const ownerType = parsedUser?.payload?.owner_type;
            if (ownerType === 0) {
              setInitialRoute('DriverDashboard');
            } else if (ownerType === 1) {
              const res = await hitMyVehicle({
                partnerId: parsedUser?.payload?.partner_id,
              });
              if (res?.status === 1 && res?.vehicles) {
                res.vehicles.forEach(vehicle => {
                  const vehicleStatus = vehicle?.vehicle_status ?? 0;
                  const mDriverStatus = vehicle?.driver?.m_driver_status ?? 0;
                  const driverVehicleStatus = vehicle?.driver?.driver_vehicle_status ?? 0;

                  console.log('vehicle_status:', vehicleStatus);
                  console.log('m_driver_status:', mDriverStatus);
                  console.log('driver_vehicle_status:', driverVehicleStatus);
                });

                const hasDriverAssigned = res.vehicles.some(vehicle => {
                  const vehicleStatus = vehicle?.vehicle_status ?? 0;
                  const mDriverStatus = vehicle?.driver?.m_driver_status ?? 0;
                  const driverVehicleStatus = vehicle?.driver?.driver_vehicle_status ?? 0;

                  return (
                    vehicleStatus == 1 &&
                    mDriverStatus == 1 &&
                    driverVehicleStatus == 1
                  );
                });
                // console.log('anas=====>>>>>>',res?.vehicles.map(vehicle => 
                //   vehicle.vehicle_status ==0 ||
                //   vehicle.m_driver_status == 0 ||
                //   vehicle.driver_vehicle_status == 0
                // ));


                // res?.vehicles.some(
                //   vehicle => vehicle.driver_id !== null,
                // );

                if (hasDriverAssigned) {
                  setInitialRoute('Trip');
                } else {
                  setInitialRoute('MyVehicles');
                }
              } else {
                // Handle the case where `status` is not 1 or `vehicles` is missing
                setInitialRoute('MyVehicles');
              }
            } else if (ownerType === 2) {

              const res = await hitMyVehicle({
                partnerId: parsedUser?.payload?.partner_id,
              });
              // console.log('resres===>>',res?.vehicles)
              if (res?.status === 1 && res?.vehicles) {
                // res.vehicles.forEach(vehicle => {
                //   const vehicleStatus = vehicle.vehicle_status ?? 0;
                //   const mDriverStatus = vehicle.driver?.m_driver_status ?? 0;
                //   const driverVehicleStatus = vehicle.driver?.driver_vehicle_status ?? 0;

                //   console.log('vehicle_status:', vehicleStatus);
                //   console.log('m_driver_status:', mDriverStatus);
                //   console.log('driver_vehicle_status:', driverVehicleStatus);
                // });

                const hasDriverAssigned = res.vehicles.some(vehicle => {
                  const vehicleStatus = vehicle.vehicle_status ?? 0;
                  const mDriverStatus = vehicle.driver?.m_driver_status ?? 0;
                  const driverVehicleStatus = vehicle.driver?.driver_vehicle_status ?? 0;

                  return (
                    vehicleStatus == 1 &&
                    mDriverStatus == 1 &&
                    driverVehicleStatus == 1
                  );
                });
                // console.log('anas=====>>>>>>',res?.vehicles.map(vehicle => 
                //   vehicle.vehicle_status ==0 ||
                //   vehicle.m_driver_status == 0 ||
                //   vehicle.driver_vehicle_status == 0
                // ));


                // res?.vehicles.some(
                //   vehicle => vehicle.driver_id !== null,
                // );

                if (hasDriverAssigned) {
                  setInitialRoute('Trip');
                } else {
                  setInitialRoute('MyVehicles');
                }
              }
            } else {
              setInitialRoute('Login');
            }
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            setInitialRoute('Login');
          }
        } else {
          console.log('Invalid user data format, navigating to Login');
          setInitialRoute('Login');
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




    <Stack.Navigator
      // screenOptions={{
      //   headerShown: false,
      //   animation: 'none', // This applies a default fade animation to all screens.
      //   transitionSpec: {
      //     open: { animation: 'spring', config: { stiffness: 1000, damping: 10 } },
      //     close: { animation: 'timing', config: { duration: 500 } },
      //   },
      // }}
      screenOptions={{
        headerShown: false,
        animationEnabled: false, // Disables animations for all screens
      }}
      initialRouteName={initialRoute}>
      {/* Authentication and Profile Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="TermsCondition" component={TermsAndCondition} />
      <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
      <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="UpdateDriver" component={UpdateDriver} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
      <Stack.Screen name="Ledger" component={LedgerScreen} />
      {/* Main Screens */}
      <Stack.Screen name="Notification" component={Notification} />
      {/* <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen name="MyVehicles">
        {() => (
          <AuthWrapper>
            <MyVehiclesScreen />
          </AuthWrapper>
        )}
      </Stack.Screen>

      {/* <Stack.Screen
        name="DriverDashboard"
        component={DriverDashboard}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen name="DriverDashboard">
        {() => (
          <AuthWrapper>
            <DriverDashboard />
          </AuthWrapper>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Earning"
        component={Earning}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="Earning"
        options={{ headerShown: false }}
      >
        {() => (
          <AuthWrapper>
            <Earning />
          </AuthWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="DriverMap" component={DriverMapScreen} />
      <Stack.Screen name="AmountCollected" component={AmountCollectScreen} />
      <Stack.Screen
        name="UpdateBankDetails"
        component={UpdateBankDetailsScreen}
      />
      <Stack.Screen name="RideComplete" component={RideCompleteScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="orderinfo"
        component={OrderInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddCash" component={AddCashScreen} />
      <Stack.Screen name="HelpChat" component={HelpAndSupportChat} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupportMain} />
      <Stack.Screen name="TicketSubmission" component={AddHelpAndSupport} />
      <Stack.Screen name="Setting" options={{ headerShown: false }}>
        {() => (
          <AuthWrapper>
            <AccountScreen />
          </AuthWrapper>
        )}
      </Stack.Screen>

      <Stack.Screen name="OrderScreen" options={{ headerShown: false }}>
        {() => (
          <AuthWrapper>
            <OrderScreen />
          </AuthWrapper>
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default StackNavigator;