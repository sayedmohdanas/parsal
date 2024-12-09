import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Colors from '../../common/Colors';
import CustomHeader from './components/CustomHeader';
import Loading from '../../components/Loading/Loading';
import {GetDriverCurrentLocation, custommapstyle} from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hitDriverEarning, hitGetDriverDetails, hitGetLiveOrderApi, hitGetWalletBalanceApi} from '../../config/api/api';
import BorderLine from '../../common/BorderLine.';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import AppImages from '../../common/AppImages';
import BottomNav from '../../../navigation/BottomNav';
import { setOrderData, setlivetripmenu, setloginuserdetails, setnextOrderData, setupdate_order, setwalletBalance } from '../../redux/HitApis/HitApiSlice';

const DriverDashboard = () => {
  const navigation = useNavigation();
  const [driverLocation, setDriverLocation] = useState({
    latitude: null,
    longitude: null,
    heading: null,
  });
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // This will remove the header from this screen
    });
  }, [navigation]);

  useEffect(() => {
    const fetchDriverLocations = async () => {
      try {
        const {latitude, longitude, heading} = await GetDriverCurrentLocation();
        setDriverLocation({latitude, longitude, heading});
      } catch (error) {
        console.error('Error fetching driver location: ', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch driver location initially
    fetchDriverLocations();

    // Set up an interval to fetch the location every 5 seconds
    const intervalId = setInterval(fetchDriverLocations, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const [driver_todays_earning, setdriver_todays_earning] = useState([]);

  const get_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const param = {
        driver_id: parsedUser?.payload?.driver_id,
        filter: 'today',
        customDate: {start: new Date(), end: ''},
      };
      const res = await hitDriverEarning(param);
      if (res?.success == false) {
        setdriver_todays_earning([]);
      } else {
        setdriver_todays_earning(res?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      get_data();
    }, []),
  );
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);
    // setparsed_data(parsed_user);
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

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading loading={loading} /> // my custom loading component
      ) : (
        <>
          <MapView
            style={StyleSheet.absoluteFillObject}
            customMapStyle={custommapstyle}
            initialRegion={{
              latitudeDelta: 0.1, // Adjusted to show the whole country
              longitudeDelta: 0.1,
              latitude: driverLocation?.latitude || 37.78825, // Fallback values
              longitude: driverLocation?.longitude || -122.4324,
            }}>
            {/* Marker for the driver's current location */}
            {driverLocation?.latitude && driverLocation?.longitude && (
              <Marker
                coordinate={{
                  latitude: driverLocation?.latitude,
                  longitude: driverLocation?.longitude,
                }}
                // rotation={driverLocation?.heading} // Apply heading to rotate the marker
                // anchor={{x: 0.5, y: 0.5}} // Center the marker
              >
                <Image
                  source={AppImages.Bike}
                  style={{
                    width: responsiveWidth(37),
                    height: responsiveHeight(37),
                    // transform: [{rotate: `${driverLocation?.heading}deg`}], // Rotate the bike image
                  }}
                  resizeMode="contain"
                />
              </Marker>
            )}
          </MapView>

          {/* Header and Trip details */}
          <View style={styles.content}>
            <CustomHeader showSplash={true} screenName={'Live Trips'} />
            <View style={styles.tripContainer}>
              <View>
                <View style={[styles.tripCard]}>
                  <Text style={styles.tripTime}>Booking Count</Text>
                  <Text style={styles.tripName}>
                    {driver_todays_earning?.length == 0
                      ? '0'
                      : driver_todays_earning[3]?.individualPaidAmounts?.length}
                  </Text>
                </View>
              </View>
              <BorderLine
                color={'#D8D8D8'}
                orientation="vertical"
                length="65%"
                thickness={0.4}
              />
              <View>
                <View style={[styles.tripCard]}>
                  <Text style={styles.tripTime}>Operator Bill</Text>
                  <Text style={styles.tripName}>
                    ₹
                    {!isNaN(driver_todays_earning[3]?.totalPaidAmount)
                      ? Math.round(
                        driver_todays_earning[3]?.totalPaidAmount,
                        ).toFixed(2)
                      : '0'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card positioned just above bottom navigation */}
          {/* {selectedTrip && (
                        <View style={styles.cardContainer}>
                            {tripData
                                .filter(trip => trip.id === selectedTrip)
                                .map(trip => (
                                    // <LiveTripCustomCard key={trip.id} trip={trip} />
                                    <DriverArriveCard key={trip.id} trip={trip} />
                                    // <DestinationSection/>
                                ))}
                        </View>
                    )} */}
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
  },
  tripCard: {
    marginHorizontal: 3,
    padding: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  selectedCard: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.brandBlue,
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
    bottom: 96,
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

export default DriverDashboard;
