import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Colors from '../../../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import CustomHeader from '../../components/CustomHeader';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {
  GetDriverCurrentLocation,
  custommapstyle,
} from '../../../../common/CommonFunction';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Loading from '../../../../components/Loading/Loading';
import LiveTripCustomCard from '../../../DriverEarning/LiveTripCustomCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hitDriverEarning,
  hitGetDriverDetails,
  hitGetLiveDriverofPartner,
  hitGetLiveOrderApi,
  hitGetPartner,
  hitGetWalletBalanceApi,
  hitMyVehicle,
  hitgetDriverTodaysEarningApi,
} from '../../../../config/api/api';
import AppImages from '../../../../common/AppImages';
import BorderLine from '../../../../common/BorderLine.';
import BottomNav from '../../../../../navigation/BottomNav';
import {
  setOrderData,
  setlivetripmenu,
  setloginuserdetails,
  setnextOrderData,
  setupdate_order,
  setwalletBalance,
} from '../../../../redux/HitApis/HitApiSlice';
import {useDispatch} from 'react-redux';

// Call the function with a customer ID and a custom message

const LiveTripScreen = () => {
  const navigation = useNavigation();

  const [selectedTrip, setSelectedTrip] = useState(1);
  const [all_flag, setall_flag] = useState(false);
  const dispatch = useDispatch();

  const [driverLocation, setDriverLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(true);

  const [login_data, setlogin_data] = useState();
  const [partner_riders, setpartner_riders] = useState([]);
  const [all_driver_in_map, setall_driver_in_map] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const get_live_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      setlogin_data(parsedUser);
      const param = {
        partner_id: parsedUser?.payload?.partner_id,
      };
      setrefreshing(true);
      const res = await hitGetLiveDriverofPartner(param);
      setpartner_riders(res?.data);
      setrefreshing(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setall_flag(true);
      const fetchDriverLocation = async () => {
        setLoading(true); // Start loading

        try {
          const {latitude, longitude} = await GetDriverCurrentLocation();
          setDriverLocation({latitude, longitude});
        } catch (error) {
          console.error('Error fetching driver location: ', error);
        } finally {
          setLoading(false);
        }
      };

      const get_data = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          const parsedUser = JSON.parse(user);

          const param = {
            partnerId: parsedUser?.payload?.partner_id,
          };

          const res = await hitMyVehicle(param);

          // Filter vehicles to only include those where driver_id is not null
          const vehiclesWithDriver = res?.vehicles?.filter(
            vehicle => vehicle?.driver_id != null,
          );

          setall_driver_in_map(vehiclesWithDriver);
        } catch (error) {
          console.error('Error fetching data: ', error);
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchDriverLocation();
      get_live_data();
      get_data();

      return () => {};
    }, []),
  );

  const handleCardClick = item => {
    setSelectedTrip(item);
    setall_flag(false);
  };
  const renderItem = useMemo(() => {
    return ({item}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            handleCardClick(item);
          }}>
          <View
            style={[
              styles.tripCard,
              selectedTrip?.id == item.id && styles.selectedCard, // Use item.id for selection
            ]}>
            <Text style={styles.tripTime}>
              <Text style={{fontSize: responsiveFontSize(12)}}>
                {item?.driver?.driver_name
                  ? item.driver.driver_name.charAt(0).toUpperCase() +
                    item.driver.driver_name.slice(1).toLowerCase()
                  : ''}
              </Text>
            </Text>
            <Text style={[styles.tripName, {fontSize: responsiveFontSize(10)}]}>
              {' ₹ ' + item?.paid_amount}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
  }, [selectedTrip, handleCardClick]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && selectedTrip?.driver) {
      let currentLat, currentLong;

      if (all_flag && all_driver_in_map.length > 0) {
        // Calculate the average lat/long for all drivers
        const sumCoords = all_driver_in_map.reduce(
          (acc, driver) => {
            const driverLat = parseFloat(driver.driver?.current_lat) || 0;
            const driverLong = parseFloat(driver.driver?.current_long) || 0;
            acc.lat += driverLat;
            acc.long += driverLong;
            return acc;
          },
          {lat: 0, long: 0},
        );

        currentLat = sumCoords.lat / all_driver_in_map.length;
        currentLong = sumCoords.long / all_driver_in_map.length;
      } else {
        // Fallback to selectedTrip's driver location or driverLocation
        currentLat =
          parseFloat(selectedTrip?.driver_lat) || driverLocation.latitude;
        currentLong =
          parseFloat(selectedTrip?.driver_long) || driverLocation.longitude;
      }

      mapRef.current.animateToRegion(
        {
          latitude: currentLat,
          longitude: currentLong,
          latitudeDelta: 0.0992,
          longitudeDelta: 0.0991,
        },
        1000, // duration of the animation
      );
    }
  }, [selectedTrip, all_driver_in_map]);
  const isOnlyPartnerDriver = (all_driver_in_map, login_data) => {
    // Filter out entries where driver_id is null
    const filteredDrivers = all_driver_in_map.filter(
      item => item?.driver_id != null,
    );
    // Check if there is exactly one driver in the filtered list

    if (filteredDrivers.length === 1) {
      const {driver: driverInfo} = filteredDrivers[0];
      if (driverInfo?.phone === login_data?.payload?.phone) {
        return true;
      }
    }
    return false;
  };

  const onlyPartnerDriver = isOnlyPartnerDriver(all_driver_in_map, login_data);
  const isDriverPartnerInAllData = login_data => {
    // Check if the user's owner_type is 2
    return login_data?.payload?.owner_type == 2;
  };

  // Usage
  const IsPartnerDriver = isDriverPartnerInAllData(login_data);

  const [driver_todays_earning, setdriver_todays_earning] = useState([]);
  // console.log('login_data',login_data);

  const get_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const param = {
        driverId:
          parsedUser?.payload?.owner_type == 0 || parsedUser?.payload?.owner_type == 2
            ? parsedUser?.payload?.driver_id
            : 0,
      };
      const res = await hitgetDriverTodaysEarningApi(param);
      if (res?.success == false) {
        setdriver_todays_earning([]);
      } else {
        setdriver_todays_earning(res);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (onlyPartnerDriver) get_data();
    }, [onlyPartnerDriver]),
  );
  useEffect(() => {
    if (mapRef.current && driverLocation && !selectedTrip?.driver) {
      const {latitude, longitude} = driverLocation;

      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0992,
          longitudeDelta: 0.0991,
        },
        1000, // duration of the animation
      );
    }
  }, [driverLocation]); // Trigger only if driverLocation changes
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);

    if (parsed_user?.payload?.owner_type == 0) {
      hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
        .then(res => {
          dispatch(setloginuserdetails(res?.drivers[0]));
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
              if (res?.ongoingOrder.length == 0) {
                // setshow_live(false);
                dispatch(setlivetripmenu(false));
              } else {
                // setshow_live(true);
                dispatch(setlivetripmenu(true));
                const {order_otp, ...restOrderData} =
                  res?.ongoingOrder[0] || {};
                const modifiedOrderData = {...restOrderData, otp: order_otp};
                dispatch(setOrderData(modifiedOrderData));
                if (res?.ongoingOrder[0]?.is_arrived_pickup) {
                  if (modifiedOrderData?.delivered_at) {
                    dispatch(setupdate_order(modifiedOrderData));
                    navigation.navigate('AmountCollected');
                  } else {
                    dispatch(setupdate_order(modifiedOrderData));
                    navigation.navigate('DriverMap');
                    return;
                  }
                } else {
                  navigation.navigate('DriverMap');
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
                  navigation.navigate('DriverMap');
                }
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
                    if (modifiedOrderData?.delivered_at) {
                      dispatch(setupdate_order(modifiedOrderData));
                      navigation.navigate('AmountCollected');
                    } else {
                      dispatch(setupdate_order(modifiedOrderData));
                      navigation.navigate('DriverMap');
                      return;
                    }
                  } else {
                    navigation.navigate('DriverMap');
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
                    navigation.navigate('DriverMap');
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
  useFocusEffect(
    useCallback(() => {
      get_user_details();
    }, []),
  );
  // useEffect(() => {
  //   // Set an interval to call sendDummyDataToFirebase every 8 seconds
  //   const intervalId = setInterval(() => {
  //     sendDummyDataToFirebase('69', 'Your trip has ended. Please rate your experience.');
  //   }, 8000); // 8000 milliseconds = 8 seconds

  //   // Clear the interval when the component unmounts or you no longer need it
  //   return () => clearInterval(intervalId);
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading loading={loading} /> // my custom loading component
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={get_live_data}
              />
            }>
            <MapView
              ref={mapRef}
              showsUserLocation={!IsPartnerDriver}
              style={StyleSheet.absoluteFillObject}
              customMapStyle={custommapstyle}
              initialRegion={{
                latitude:
                  all_flag && all_driver_in_map.length > 0
                    ? parseFloat(all_driver_in_map[0]?.driver?.current_lat) ||
                      driverLocation.latitude
                    : parseFloat(selectedTrip?.driver_lat) ||
                      driverLocation.latitude,
                longitude:
                  all_flag && all_driver_in_map.length > 0
                    ? parseFloat(all_driver_in_map[0]?.driver?.current_long) ||
                      driverLocation.longitude
                    : parseFloat(selectedTrip?.driver_long) ||
                      driverLocation.longitude,
                latitudeDelta: 0.024, // More zoomed-in for closer latitude view
                longitudeDelta: 0.024, // More zoomed-in for closer longitude view
              }}>
              {login_data?.payload?.owner_type != 0 && !all_flag && (
                <>
                  {selectedTrip?.driver_lat && selectedTrip?.driver_long && (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(selectedTrip.driver_lat),
                        longitude: parseFloat(selectedTrip.driver_long),
                      }}
                      title="Source">
                      <Image
                        source={AppImages.Bike}
                        style={{
                          width: responsiveWidth(37),
                          height: responsiveHeight(37),
                        }}
                        resizeMode="contain"
                      />
                    </Marker>
                  )}
                  {selectedTrip?.drop_lat && selectedTrip?.drop_long && (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(selectedTrip.drop_lat),
                        longitude: parseFloat(selectedTrip.drop_long),
                      }}
                      title="Destination"
                    />
                  )}

                  {selectedTrip?.driver_lat &&
                    selectedTrip?.driver_long &&
                    selectedTrip?.drop_lat &&
                    selectedTrip?.drop_long && (
                      <Polyline
                        coordinates={[
                          {
                            latitude: parseFloat(selectedTrip.driver_lat),
                            longitude: parseFloat(selectedTrip.driver_long),
                          },
                          {
                            latitude: parseFloat(selectedTrip.drop_lat),
                            longitude: parseFloat(selectedTrip.drop_long),
                          },
                        ]}
                        strokeColor={Colors.black} // Line color
                        strokeWidth={4} // Line thickness
                        lineDashPattern={[5, 5]} // Dashed line pattern
                        lineCap="round" // Round end of line
                        lineJoin="round" // Round join between line segments
                      />
                    )}
                </>
              )}

              {all_flag &&
                (onlyPartnerDriver || all_driver_in_map.length > 0) &&
                all_driver_in_map.map((driver, index) => {
                  const {driver: driverInfo} = driver;
                  const driverLat = parseFloat(driverInfo?.current_lat);
                  const driverLong = parseFloat(driverInfo?.current_long);

                  if (driverInfo && driverLat && driverLong) {
                    const image =
                      driverInfo.phone == login_data?.payload?.phone
                        ? AppImages.partnerbike
                        : AppImages.Bike;
                    return (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: driverLat,
                          longitude: driverLong,
                        }}
                        title={driverInfo.driver_name}
                        description={driverInfo.vehicle_number}>
                        <Image
                          source={image}
                          style={{
                            width: responsiveWidth(37),
                            height: responsiveHeight(37),
                          }}
                          resizeMode="contain"
                        />
                      </Marker>
                    );
                  }
                  return null;
                })}
            </MapView>

            <View style={styles.content}>
              <CustomHeader showSplash={true} screenName={'Trips'} />
              {!onlyPartnerDriver && (
                <View style={styles.tripContainer}>
                  {partner_riders?.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTrip(null);
                        setall_flag(true);
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: all_flag ? 4 : 0,
                        borderColor: all_flag ? Colors.brandBlue : 'none',
                        padding: 13,
                      }}>
                      <Image
                        source={AppImages.driversList}
                        style={{
                          height: responsiveHeight(25),
                          width: responsiveWidth(45),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                  {partner_riders?.length > 0 ? (
                    <FlatList
                      data={partner_riders}
                      horizontal
                      renderItem={renderItem}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(12),
                          paddingVertical: responsiveHeight(12),

                          color: Colors.grey,
                          fontWeight: '600',
                          alignSelf: 'center',
                        }}>
                        {'No live trips are currently available'}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {onlyPartnerDriver && (
                <View style={styles.tripContainer}>
                  <View>
                    <View style={[styles.tripCard]}>
                      <Text style={styles.tripTime}>Booking Count</Text>
                      <Text style={styles.tripName}>
                        {driver_todays_earning?.todaysTransactionCount == 0
                          ? '0'
                          : driver_todays_earning?.todaysTransactionCount}
                      </Text>
                    </View>
                  </View>
                  <BorderLine
                    color={'#D8D8D8'}
                    orientation="vertical"
                    length="65%"
                    thickness={0.97}
                  />
                  <View>
                    <View style={[styles.tripCard]}>
                      <Text style={styles.tripTime}>Operator Bill</Text>
                      <Text style={styles.tripName}>
                        ₹
                        {!isNaN(driver_todays_earning?.todaysTotalAmount)
                          ? Math.round(
                              driver_todays_earning?.todaysTotalAmount,
                            ).toFixed(2)
                          : '0'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {login_data?.payload?.owner_type != 0 &&
              !all_flag &&
              selectedTrip && (
                <View style={styles.cardContainer}>
                  <LiveTripCustomCard trip={selectedTrip} />
                </View>
              )}
          </ScrollView>
        </>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNav Trip={true} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  selectedCard: {
    borderBottomWidth: 4,
    borderBottomColor: Colors.brandBlue,
  },

  tripContainer: {
    borderTopWidth: 1,
    borderColor: '#D8D8D8',
    paddingHorizontal: 5,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 1.3,
  },
  tripCard: {
    marginHorizontal: 3,
    padding: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  tripTime: {
    fontSize: responsiveFontSize(12),
    color: Colors.grey,
    marginTop: responsiveHeight(8),
    fontWeight: '700',
  },
  tripName: {
    fontSize: 14,
    fontWeight: '600',

    // lineHeight: 10.36,
    color: '#000000',
    marginTop: 4,
    marginBottom: 4,
  },
  cardContainer: {
    position: 'absolute',
    bottom: responsiveHeight(90),
    width: '100%',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 13,
    left: 0,
    right: 0,
  },
});

export default LiveTripScreen;
