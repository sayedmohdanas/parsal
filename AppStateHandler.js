// AppStateHandler.js
import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { updateReduxData } from './redux/actions'; // Import your Redux action
import {
    hitGetDriverDetails,
    hitGetLiveOrderApi,
    hitGetPartner,
    hitGetWalletBalanceApi,
  } from './src/config/api/api';
  import {
    setOrderData,
    setlivetripmenu,
    setloginuserdetails,
    setnextOrderData,
    setupdate_order,
    setwalletBalance,
  } from './src/redux/HitApis/HitApiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const AppStateHandler = () => {
    const navigation = useNavigation()
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const {orderData, update_order, nextOrderData} = useSelector(
    state => state?.parsalPartner,
  );
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);
    // setparsed_data(parsed_user);
   
    if (parsed_user?.payload?.owner_type == 0) {
          const parameter = {
            user_id: parsed_user?.payload?.driver_id,
            type: 'driver',
          };
          hitGetLiveOrderApi(parameter)
            .then(res => {
              if (res?.ongoingOrder.length == 0) {
                // navigation.navigate("DriverDashboard")
                dispatch(setOrderData(null))
                dispatch(setnextOrderData(null))
                dispatch(setlivetripmenu(false));
              } else {
                
              }
            })
            .catch(err => {
              console.error(err);
            });
        // })
        // .catch(err => {
        //   console.log(err);
        // });
    } else {
      hitGetPartner({
        partner_id: parsed_user?.payload?.partner_id,
      })
        .then(res => {
          // setuser_details(res?.partner);
          dispatch(setloginuserdetails(res?.partner));
          if (parsed_user?.payload?.owner_type == 2) {
            const param = {driver_id: parsed_user?.payload?.driver_id};
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
                //   setshow_live(false);
                  dispatch(setlivetripmenu(false));
                  return;
                } else {
                //   setshow_live(true);
                  dispatch(setlivetripmenu(true));
                  const {order_otp, ...restOrderData} =
                    res?.ongoingOrder[0] || {};
                  const modifiedOrderData = {...restOrderData, otp: order_otp};
                  dispatch(setOrderData(modifiedOrderData));
                  if (res?.ongoingOrder[0]?.is_arrived_pickup) {
                    if (modifiedOrderData?.delivered_at) {
                      dispatch(setupdate_order(modifiedOrderData));
                      // navigation.navigate('AmountCollected');
                    } else {
                      dispatch(setupdate_order(modifiedOrderData));
                      // navigation.navigate('DriverMap');
                      return;
                    }
                  } else {
                    // navigation.navigate('DriverMap');
                    return;
                  }
                  if (res?.ongoingOrder?.length > 1) {
                    const {order_otp, ...restOrderData} =
                      res?.ongoingOrder[1] || {};
                    const modifiedOrderData = {
                      ...restOrderData,
                      otp: order_otp,
                    };
                    dispatch(setnextOrderData(modifiedOrderData));
                    // navigation.navigate('DriverMap');
                    return;
                  }
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
    // Listener for AppState changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Cleanup the listener
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      console.log('App has come to the foreground');
      callApiAndUpdateRedux();
    }
    appState.current = nextAppState;
  };

  const callApiAndUpdateRedux = async () => {
    try {
    //   console.log('Calling API on foreground...');
    //   const response = await fetch('https://yourapi.com/endpoint', {
    //     method: 'GET', // Adjust to your API's method
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('API Response:', data);

    //     // Dispatch Redux action to update the store
    //     // dispatch(updateReduxData(data));
    //   } else {
    //     console.error('API call failed with status:', response.status);
    //   }
         get_user_details()
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  return null; // This component does not render anything
};

export default AppStateHandler;
