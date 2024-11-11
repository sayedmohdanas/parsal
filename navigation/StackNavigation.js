import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
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
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../src/components/Loading/Loading';
import AccountScreen from '../src/screen/AccountScreen/AccountScreen';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import OrderScreen from '../src/screen/OrderList/OrderScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);

    if (parsed_user?.payload?.owner_type == 0) {
      hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
        .then(res => {
          // setuser_details(res?.drivers[0]);
          dispatch(setloginuserdetails(res?.drivers[0]));
          const param = {driver_id: parsed_user?.payload?.driver_id};

          // parsed_user?.payload?.driver_id};
          hitGetWalletBalanceApi(param)
            .then(res => {
              dispatch(setwalletBalance(res));
            })
            .catch(err => {
              console.error(err);
            });
          const parameter = {
            user_id: parsed_user?.payload?.driver_id,
            type: 'driver',
          };
          hitGetLiveOrderApi(parameter)
            .then(res => {
              if (res?.status == 0) {
                setshow_live(false);
                dispatch(setlivetripmenu(false));
              } else {
                dispatch(setlivetripmenu(true));
                setshow_live(true);
                const {order_otp, ...restOrderData} = res?.ongoingOrder || {};
                const modifiedOrderData = {...restOrderData, otp: order_otp};
                dispatch(setOrderData(modifiedOrderData));
                if (res?.ongoingOrder?.is_arrived_pickup) {
                  dispatch(setupdate_order(modifiedOrderData));
                }
                // navigation.navigate('DriverMap');
              }
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      hitGetPartner({
        partner_id: parsed_user?.payload?.partner_id,
      })
        .then(res => {
          // setuser_details(res?.partner);
          dispatch(setloginuserdetails(res?.partner));
          if (parsed_user?.payload?.owner_type == 2) {
            const param = {driver_id: parsed_user?.payload?.driver_id};

            // parsed_user?.payload?.driver_id};
            hitGetWalletBalanceApi(param)
              .then(res => {
                dispatch(setwalletBalance(res));
              })
              .catch(err => {
                console.error(err);
              });
            const parameter = {
              user_id: parsed_user?.payload?.driver_id,
              type: 'driver',
            };
            hitGetLiveOrderApi(parameter)
              .then(res => {
                if (res?.ongoingOrder?.length == 0) {
                  // setshow_live(false);
                  dispatch(setlivetripmenu(false));
                  return;
                } else {
                  // setshow_live(true);
                  dispatch(setlivetripmenu(true));

                  const {order_otp, ...restOrderData} =
                    res?.ongoingOrder[0] || {};
                  const modifiedOrderData = {...restOrderData, otp: order_otp};

                  dispatch(setOrderData(modifiedOrderData));

                  if (res?.ongoingOrder[0]?.is_arrived_pickup) {
                    dispatch(setupdate_order(modifiedOrderData));
                  }
                  if (res?.ongoingOrder?.length > 1) {
                    const {order_otp, ...restOrderData} =
                      res?.ongoingOrder[1] || {};
                    const modifiedOrderData = {
                      ...restOrderData,
                      otp: order_otp,
                    };
                    dispatch(setnextOrderData(modifiedOrderData));
                  }
                  navigation.navigate('DriverMap');
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
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
                const hasDriverAssigned = res.vehicles.some(
                  vehicle => vehicle.driver_id !== null,
                );

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
              setInitialRoute('Trip');
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
    // <Stack.Navigator initialRouteName={initialRoute}>
    //   <Stack.Screen name="Login" component={LoginScreen} />
    //   <Stack.Screen name="Otp" component={OtpScreen} />
    //   <Stack.Screen name="TermsCondition" component={TermsAndCondition} />
    //   <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} />
    //   <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
    //   <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
    //   <Stack.Screen name="UpdateDriver" component={UpdateDriver} />
    //   <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
    //   <Stack.Screen name="Notification" component={Notification} />
    //   <Stack.Screen
    //     name="MyVehicles"
    //     component={MyVehiclesScreen}
    //     options={{headerShown: false}}
    //   />

    //   <Stack.Screen
    //     name="DriverDashboard"
    //     component={DriverDrawerNavigator} // Driver's drawer
    //     options={{headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="OwnerDashboard"
    //     component={OwnerDrawerNavigator} // Owner's drawer
    //     options={{headerShown: false}}
    //   />
    // </Stack.Navigator>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
      {/* Main Screens */}
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen
        name="MyVehicles"
        component={MyVehiclesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DriverDashboard"
        component={DriverDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Trip"
        component={LiveTripScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Earning"
        component={Earning}
        options={{headerShown: false}}
      />
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="orderinfo"
        component={OrderInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AddCash" component={AddCashScreen} />
      <Stack.Screen name="HelpChat" component={HelpAndSupportChat} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupportMain} />
      <Stack.Screen name="TicketSubmission" component={AddHelpAndSupport} />
      <Stack.Screen name="Setting" component={AccountScreen} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
