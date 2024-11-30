////old
// import React, {useCallback, useEffect, useState} from 'react';
// import {View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
// import {
//   useFocusEffect,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../common/metrices';
// import Colors from '../../../common/Colors';
// import AppImages from '../../../common/AppImages';
// import {Switch} from 'react-native-switch';
// import {useDispatch, useSelector} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {GetDriverCurrentLocation} from '../../../common/CommonFunction';
// import {
//   hitGetDriverDetails,
//   hitGetPartner,
//   hitUpdateDriverStatus,
// } from '../../../config/api/api';
// import {
//   setlogindriverdetails,
//   setworking_status,
// } from '../../../redux/HitApis/HitApiSlice';

// const CustomHeader = ({
//   screenName,
//   onPress,
//   leftimage,
//   rotate,
//   not_show,
//   showSplash,
// }) => {
//   const [check_owner, setCheckOwner] = useState();
//   const [userDetails, setUserDetails] = useState({});
//   const [isEnabled, setIsEnabled] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // To block rapid toggles

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const toggleOnlineStatus = async () => {
//     const previousState = isEnabled; // Store the current state
//     try {
//       setIsEnabled(!isEnabled); // Optimistic update

//       const driverData = JSON.parse(await AsyncStorage.getItem('user'));
//       const { latitude, longitude } = await GetDriverCurrentLocation();

//       const param = {
//         driver_id: driverData?.payload?.driver_id,
//         current_lat: latitude,
//         current_long: longitude,
//         working_status: !isEnabled ? 1 : 0,
//       };

//       await hitUpdateDriverStatus(param);
//       dispatch(setworking_status(!isEnabled)); // Sync with Redux
//     } catch (error) {
//       console.error('Error toggling online status:', error);

//       // Revert state in case of failure
//       setIsEnabled(previousState);
//       dispatch(setworking_status(previousState));
//     }
//   };




//   const updateDriverLocation = async () => {
//     try {
//       const {latitude, longitude} = await GetDriverCurrentLocation();
//       const driverData = JSON.parse(await AsyncStorage.getItem('user'));

//       const param = {
//         driver_id: driverData?.payload?.driver_id,
//         current_lat: latitude,
//         current_long: longitude,
//         working_status: null,
//       };
//       await hitUpdateDriverStatus(param);
//     } catch (error) {
//       console.error('Error updating driver location:', error);
//     }
//   };

//   const fetchDriverData = async () => {
//     try {
//       const driverData = JSON.parse(await AsyncStorage.getItem('user'));
//       setCheckOwner(driverData?.payload?.owner_type);

//       if (driverData?.payload?.owner_type === 0) {
//         const res = await hitGetDriverDetails({
//           ids: [driverData.payload.driver_id],
//         });
//         const driver = res?.drivers[0];
//         setUserDetails(driver);
//         setIsEnabled(driver.working_status === 1);
//         dispatch(setlogindriverdetails(driver));
//         dispatch(setworking_status(driver.working_status === 1));
//       } else {
//         const partnerRes = await hitGetPartner({
//           partner_id: driverData.payload.partner_id,
//         });
//         let userDetails = partnerRes?.partner;

//         if (driverData?.payload?.owner_type === 2) {
//           const driverRes = await hitGetDriverDetails({
//             ids: [driverData.payload.driver_id],
//           });
//           const driver = driverRes?.drivers[0];
//           userDetails = {
//             ...userDetails,
//             working_status: driver?.working_status,
//             vehicle_type_id: driver?.vehicle_type_id,
//           };
//           setIsEnabled(driver?.working_status === 1);
//           dispatch(setworking_status(driver.working_status === 1));
//         }
//         setUserDetails(userDetails);
//         dispatch(setlogindriverdetails(userDetails));
//       }
//     } catch (error) {
//       console.error('Error fetching driver data:', error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchDriverData();
//       updateDriverLocation();
//     }, []),
//   );

//   return (
//     <>
//       <View style={styles.headerContainer}>
//         <View style={{position: 'absolute', left: responsiveWidth(16)}}>
//           <TouchableOpacity onPress={onPress}>
//             <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
//               {leftimage && (
//                 <Image
//                   source={leftimage}
//                   style={[
//                     styles.profilePic,
//                     {transform: [{rotate: rotate ? '180deg' : '0deg'}]},
//                   ]}
//                 />
//               )}
//             </View>
//           </TouchableOpacity>
//         </View>

//         {showSplash && (
//           <Image
//             source={AppImages.SplashScreenLogo}
//             style={{
//               height: responsiveHeight(30),
//               width: responsiveWidth(75),
//               position: 'absolute',
//               left: responsiveWidth(16),
//             }}
//             resizeMode="contain"
//           />
//         )}

//         {check_owner !== 1 && !not_show ? (
//           <View
//             style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//               <TouchableOpacity  onPress={toggleOnlineStatus} style={{paddingHorizontal:responsiveWidth(10),paddingVertical:responsiveHeight(8)}}>
//             <Switch
//               value={isEnabled}
//               onValueChange={toggleOnlineStatus}
//               disabled={false}
//               activeText="ONLINE"
//               inActiveText="OFFLINE"
//               circleSize={20}
//               barHeight={30}
//               activeTextStyle={{
//                 color: Colors.brandBlue,
//                 fontSize: responsiveFontSize(12),
//                 fontWeight: '500',
//               }}
//               inactiveTextStyle={{
//                 color: Colors.grey,
//                 fontSize: responsiveFontSize(12),
//                 fontWeight: '500',
//               }}
//               circleBorderWidth={3}
//               backgroundActive="white"
//               backgroundInactive="white"
//               renderInsideCircle={() => (
//                 <Image
//                   source={
//                     isEnabled ? AppImages.Online : AppImages.OfflineButton
//                   }
//                   style={{
//                     width: responsiveWidth(15),
//                     height: responsiveHeight(15),
//                     padding: 10,
//                   }}
//                   resizeMode="contain"
//                 />
//               )}
//               changeValueImmediately
//               innerCircleStyle={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//               outerCircleStyle={{
//                 borderWidth: 1,
//                 borderColor: '#D8D8D8',
//                 borderRadius: 30,
//               }}
//               renderActiveText
//               renderInActiveText
//               switchLeftPx={90}
//               switchRightPx={90}
//               switchWidthMultiplier={4.5}
//               switchBorderRadius={30}
//             />
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View
//             style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//             <Text style={styles.screenName}>{screenName}</Text>
//           </View>
//         )}

//         <TouchableOpacity
//           style={{position: 'absolute', right: responsiveWidth(16)}}
//           onPress={() => navigation.navigate('Notification')}>
//           <Image
//             source={AppImages.notificationIcon}
//             resizeMode="contain"
//             style={{width: responsiveWidth(22), height: responsiveHeight(22)}}
//           />
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// export default CustomHeader;

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     height: responsiveHeight(60),
//     backgroundColor: Colors.white,
//     paddingHorizontal: responsiveWidth(16),
//     borderBlockColor: '#D8D8D8',
//     borderBottomWidth: 0.5,
//     flex: 1,
//   },
//   profilePic: {
//     height: responsiveHeight(28),
//     width: responsiveWidth(28),
//     // borderRadius: responsiveHeight(32),
//     // borderWidth: 1,
//     // borderColor: '#D9D9D9',
//   },
//   screenName: {
//     // fontSize: responsiveFontSize(20),
//     // fontWeight: '700',
//     // color: '#000000',
//     // textAlign: 'center',
//     color: Colors.black,
//     fontSize: responsiveFontSize(18),
//     fontWeight: '500',
//     marginLeft: responsiveWidth(10),
//   },
//   placeholder: {
//     width: responsiveWidth(40),
//   },
//   hamburgerButton: {
//     position: 'absolute',
//     left: 15,
//     zIndex: 1,
//     flexDirection: 'row',
//   },
// });
































///updated 
import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import AppImages from '../../../common/AppImages';
import { Switch } from 'react-native-switch';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetDriverCurrentLocation } from '../../../common/CommonFunction';
import {
  hitGetDriverDetails,
  hitGetPartner,
  hitUpdateDriverStatus,
} from '../../../config/api/api';
import {
  setlogindriverdetails,
  setworking_status,
  setWorkingStatus
} from '../../../redux/HitApis/HitApiSlice';

const CustomHeader = ({
  screenName,
  onPress,
  leftimage,
  rotate,
  not_show,
  showSplash,
}) => {
  const [check_owner, setCheckOwner] = useState();
  const [userDetails, setUserDetails] = useState({});
  // const [isEnabled, setIsEnabled] = useState(null);
  const isEnabled = useSelector(state => state.parsalPartner.is_online);


  const [isLoading, setIsLoading] = useState(false); // To block rapid toggles

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const toggleOnlineStatus = async () => {
    const previousState = isEnabled; // Store the current state
    try {
      // setIsEnabled(!isEnabled); // Optimistic update
      console.log('status===>>', !isEnabled);

      dispatch(setWorkingStatus(!isEnabled)); // Toggle online/offline status

      const driverData = JSON.parse(await AsyncStorage.getItem('user'));
      const { latitude, longitude } = await GetDriverCurrentLocation();

      const param = {
        driver_id: driverData?.payload?.driver_id,
        current_lat: latitude,
        current_long: longitude,
        working_status: !isEnabled ? 1 : 0,
      };

      await hitUpdateDriverStatus(param);
      dispatch(setworking_status(!isEnabled)); // Sync with Redux
    } catch (error) {
      console.error('Error toggling online status:', error);

      // Revert state in case of failure
      // setIsEnabled(previousState);
      dispatch(setWorkingStatus(!isEnabled)); // Toggle online/offline status

      dispatch(setworking_status(previousState));
    }
  };




  const updateDriverLocation = async () => {
    try {
      const driverData = JSON.parse(await AsyncStorage.getItem('user'));
      if (driverData?.payload?.owner_type == 0 || driverData?.payload?.owner_type == 2) {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          driver_id: driverData?.payload?.driver_id,
          current_lat: latitude,
          current_long: longitude,
          working_status: null,
        };
        await hitUpdateDriverStatus(param);
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  const fetchDriverData = async () => {
    try {
      const driverData = JSON.parse(await AsyncStorage.getItem('user'));
      setCheckOwner(driverData?.payload?.owner_type);

      if (driverData?.payload?.owner_type === 0) {
        const res = await hitGetDriverDetails({
          ids: [driverData.payload.driver_id],
        });
        const driver = res?.drivers[0];
        setUserDetails(driver);

        dispatch(setWorkingStatus(driver.working_status === 1)); // Toggle online/offline status

        // setIsEnabled(driver.working_status === 1);
        dispatch(setlogindriverdetails(driver));
        dispatch(setworking_status(driver.working_status === 1));
      } else {
        const partnerRes = await hitGetPartner({
          partner_id: driverData.payload.partner_id,
        });
        let userDetails = partnerRes?.partner;

        if (driverData?.payload?.owner_type === 2) {
          const driverRes = await hitGetDriverDetails({
            ids: [driverData.payload.driver_id],
          });
          const driver = driverRes?.drivers[0];
          userDetails = {
            ...userDetails,
            working_status: driver?.working_status,
            vehicle_type_id: driver?.vehicle_type_id,
          };
          console.log(driver.working_status === 1, 'heyyy');

          dispatch(setWorkingStatus(driver.working_status === 1)); // Toggle online/offline status

          // setIsEnabled(driver?.working_status === 1);
          dispatch(setworking_status(driver.working_status === 1));
        }
        setUserDetails(userDetails);
        dispatch(setlogindriverdetails(userDetails));
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    } finally {
      setIsLoading(false)
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDriverData();
      updateDriverLocation();
    }, []),
  );


  useEffect(() => {
    if (isEnabled !== undefined) {
      const updateStatus = async () => {
        try {
          const driverData = JSON.parse(await AsyncStorage.getItem('user'));
          if (driverData?.payload?.owner_type == 0 || driverData?.payload?.owner_type == 2) {
            const { latitude, longitude } = await GetDriverCurrentLocation();
            const param = {
              driver_id: driverData?.payload?.driver_id,
              current_lat: latitude,
              current_long: longitude,
              working_status: isEnabled ? 1 : 0,
            };

            const response = await hitUpdateDriverStatus(param); // Call the API to update status   
          }
        } catch (error) {
          console.error('Error updating status:', error);
        }
      };

      updateStatus();
    }
  }, [isEnabled]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={{ position: 'absolute', left: responsiveWidth(16) }}>
          <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              {leftimage && (
                <Image
                  source={leftimage}
                  style={[
                    styles.profilePic,
                    { transform: [{ rotate: rotate ? '180deg' : '0deg' }] },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {showSplash && (
          <Image
            source={AppImages.SplashScreenLogo}
            style={{
              height: responsiveHeight(30),
              width: responsiveWidth(75),
              position: 'absolute',
              left: responsiveWidth(16),
            }}
            resizeMode="contain"
          />
        )}

        {check_owner !== 1 && !not_show ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleOnlineStatus} style={{ paddingHorizontal: responsiveWidth(10), paddingVertical: responsiveHeight(8) }}>
              <Switch
                value={!!isEnabled} // Ensure a boolean value is passed
                onValueChange={toggleOnlineStatus}
                disabled={false}
                activeText="ONLINE"
                inActiveText="OFFLINE"
                circleSize={20}
                barHeight={30}
                activeTextStyle={{
                  color: Colors.brandBlue,
                  fontSize: responsiveFontSize(12),
                  fontWeight: '500',
                }}
                inactiveTextStyle={{
                  color: Colors.grey,
                  fontSize: responsiveFontSize(12),
                  fontWeight: '500',
                }}
                circleBorderWidth={3}
                backgroundActive="white"
                backgroundInactive="white"
                renderInsideCircle={() => (
                  <Image
                    source={
                      isEnabled ? AppImages.Online : AppImages.OfflineButton
                    }
                    style={{
                      width: responsiveWidth(15),
                      height: responsiveHeight(15),
                      padding: 10,
                    }}
                    resizeMode="contain"
                  />
                )}
                changeValueImmediately
                innerCircleStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                outerCircleStyle={{
                  borderWidth: 1,
                  borderColor: '#D8D8D8',
                  borderRadius: 30,
                }}
                renderActiveText
                renderInActiveText
                switchLeftPx={90}
                switchRightPx={90}
                switchWidthMultiplier={4.5}
                switchBorderRadius={30}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.screenName}>{screenName}</Text>
          </View>
        )}

        <TouchableOpacity
          style={{ position: 'absolute', right: responsiveWidth(16) }}
          onPress={() => navigation.navigate('Notification')}>
          <Image
            source={AppImages.notificationIcon}
            resizeMode="contain"
            style={{ width: responsiveWidth(22), height: responsiveHeight(22) }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default memo(CustomHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: responsiveHeight(60),
    backgroundColor: Colors.white,
    paddingHorizontal: responsiveWidth(16),
    borderBlockColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    flex: 1,
  },
  profilePic: {
    height: responsiveHeight(28),
    width: responsiveWidth(28),

  },
  screenName: {

    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: '500',
    marginLeft: responsiveWidth(10),
  },
  placeholder: {
    width: responsiveWidth(40),
  },
  hamburgerButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    flexDirection: 'row',
  },
});