import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import { setlogindriverdetails } from '../../../redux/HitApis/HitApiSlice';

const CustomHeader = ({ screenName, selectedRange, setSelectedRange }) => {
  const owner = useSelector(state => state?.parsalPartner?.owner);
  const [check_owner, setcheck_owner] = useState();
  const navigation = useNavigation();
  const toggleOnlineStatus = async () => {
    try {
      const unparse_driver_data = await AsyncStorage.getItem('user');
      const parse_data = JSON.parse(unparse_driver_data);
      setIsEnabled(prevStatus => !prevStatus);
      if (!isEnabled) {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          driver_id: parse_data?.payload?.driver_id,
          current_lat: latitude,
          current_long: longitude,
          working_status: 1,
        };
        console.log('param', param);
        const res = await hitUpdateDriverStatus(param);
      } else {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          driver_id: parse_data?.payload?.driver_id,
          current_lat: latitude,
          current_long: longitude,
          working_status: 0,
        };
        const res = await hitUpdateDriverStatus(param);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   // Define the async function inside the useEffect
  //   const fetchDriverData = async () => {
  //     try {
  //       const unparse_driver_data = await AsyncStorage.getItem('user');
  //       const parse_data = JSON.parse(unparse_driver_data);

  //       setcheck_owner(parse_data?.payload?.owner_type);
  //     } catch (error) {
  //       console.error('Error fetching driver data:', error);
  //     }
  //   };
  //   // Call the async function
  //   fetchDriverData();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchDriverData = async () => {
        try {
          const unparse_driver_data = await AsyncStorage.getItem('user');
          const parse_data = JSON.parse(unparse_driver_data);
          console.log('parse_data', parse_data);
          setcheck_owner(parse_data?.payload?.owner_type);
        } catch (error) {
          console.error('Error fetching driver data:', error);
        }
      };

      // Call the async function
      fetchDriverData();

      // Optional cleanup (if needed when screen is unfocused)
      return () => {
        // Cleanup logic here if required
      };
    }, []), // Empty dependency array means this runs on every focus
  );
  const [user_details, setuser_details] = useState([]);
  const dispatch = useDispatch();
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);

    if (parsed_user?.payload?.owner_type == 0) {
      hitGetDriverDetails({ ids: [parsed_user?.payload?.driver_id] })
        .then(res => {
          setuser_details(res?.drivers[0]);
          dispatch(setlogindriverdetails(res?.drivers[0]));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      hitGetPartner({
        partner_id: parsed_user?.payload?.partner_id,
      })
        .then(res => {
          let userDetails = res?.partner;

          if (parsed_user?.payload?.owner_type == 2) {
            hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
              .then(driverRes => {
                const driverDetails = driverRes?.drivers[0];

                if (driverDetails) {
                  // Add the working_status object to the user details
                  userDetails = {
                    ...userDetails,
                    working_status: driverDetails.working_status,
                    vehicle_type_id: driverDetails?.vehicle_type_id,
                  };
                }
                // Update user details with the new object
                dispatch(setlogindriverdetails(userDetails));

                setuser_details(userDetails);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            // If owner_type is not 2, just set the partner details
            setuser_details(userDetails);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
  useEffect(() => {
    get_user_details();
  }, [isEnabled]);
  const [isEnabled, setIsEnabled] = useState(
    user_details?.working_status == 0 ? false : true,
  );
  // Update isEnabled whenever user_details changes
  useEffect(() => {
    setIsEnabled(user_details?.working_status == 0 ? false : true);
  }, [user_details]);
  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.profilePic}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Image
              source={AppImages.hamburgerImage} // Replace with your profile pic URL
              style={styles.profilePic}
            />
          </View>
        </TouchableOpacity>

        {/* Center: Screen Name or Switch */}
        {check_owner != 1 ? (
          <>
            <Switch
              value={isEnabled}
              onValueChange={val => {
                //   setIsEnabled(val);
                toggleOnlineStatus();
              }}
              disabled={false}
              activeText={'ONLINE'}
              inActiveText={'OFFLINE'}
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
              backgroundActive={'white'}
              backgroundInactive={'white'}
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
              changeValueImmediately={true}
              innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              outerCircleStyle={{
                borderWidth: 1,
                borderColor: '#D8D8D8',
                borderRadius: 30,
              }}
              renderActiveText={true}
              renderInActiveText={true}
              switchLeftPx={90}
              switchRightPx={90}
              switchWidthMultiplier={4.5}
              switchBorderRadius={30}
            />
          </>
        ) : (
          <Text style={styles.screenName}>{screenName}</Text>
        )}
        {/* <View style={styles.placeholder} /> */}
        {/* {screenName === 'Earning' ? (
        <DateRangeSelector
          setSelectedRange={setSelectedRange}
          selectedRange={selectedRange}
        />
      ) : null} */}
          
      <TouchableOpacity onPress={()=>navigation.navigate('Notification')}>

        <Image source={AppImages.notificationIcon} resizeMode='contain' style={{ width: responsiveWidth(20), height: responsiveHeight(20) }} />

      </TouchableOpacity>

    </View>
    </>
  )
}

export default CustomHeader;

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
  },
  profilePic: {
    height: responsiveHeight(25),
    width: responsiveHeight(25),
    tintColor: 'black',
    // flex:1
    // borderRadius: responsiveHeight(20),
  },
  screenName: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    // marginLeft:responsiveWidth(35)
    // flex: 1,
    // backgroundColor:'yellow'
  },
  placeholder: {
    // flex:1,
    width: responsiveWidth(40),
    // backgroundColor:'green' // Matches the profile pic width for balance
  },
  hamburgerButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    flexDirection: 'row',
  },
})
