import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Colors from '../../common/Colors';
import CustomHeader from './components/CustomHeader';
import Loading from '../../components/Loading/Loading';
import {
  GetDriverCurrentLocation,
  fetchDriverLocation,
} from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch} from 'react-redux';
import {hitDriverEarning} from '../../config/api/api';

const DriverDashboard = () => {
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState(1);
  const [driverLocation, setDriverLocation] = useState({
    latitude: null,
    longitude: null,
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
        // const { latitude, longitude } = await GetDriverCurrentLocation();
        const {latitude, longitude} = await GetDriverCurrentLocation();
        setDriverLocation({latitude, longitude});
      } catch (error) {
        console.error('Error fetching driver location: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverLocations();
  }, []);

  const handleCardClick = tripId => {
    setSelectedTrip(tripId);
  };
  const dispatch = useDispatch();
  const [driver_todays_earning, setdriver_todays_earning] = useState([]);

  const get_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const param = {
        driver_id: parsedUser?.payload?.driver_id,
        filter: 'today',
      };

      const res = await hitDriverEarning(param);
      if (res?.success == false) {
        setdriver_todays_earning([]);
      } else {
        setdriver_todays_earning(res?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      get_data();
    }, []),
  );

  // console.log(driver_todays_earning?.total_paid_amount);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading loading={loading} /> // my custom loading component
      ) : (
        <>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitudeDelta: 0.1, // Adjusted to show the whole country
              longitudeDelta: 0.1,
              latitude: driverLocation?.latitude || 37.78825, // Fallback values
              longitude: driverLocation?.longitude || -122.4324,
            }}>
            {/* Marker for the driver's current location */}
            {driverLocation.latitude && driverLocation.longitude && (
              <Marker
                coordinate={{
                  latitude: driverLocation.latitude,
                  longitude: driverLocation.longitude,
                }}
                title={'Driver Location'}
              />
            )}
          </MapView>

          {/* Header and Trip details */}
          <View style={styles.content}>
            <CustomHeader screenName={'Live Trips'} />
            <View style={styles.tripContainer}>
              <View>
                <View style={[styles.tripCard]}>
                  <Text style={styles.tripTime}>Booking Count</Text>
                  <Text style={styles.tripName}>
                    {driver_todays_earning?.length == 0
                      ? '0'
                      : driver_todays_earning?.individual_paid_amounts?.length}
                  </Text>
                </View>
              </View>

              <View>
                <View style={[styles.tripCard]}>
                  <Text style={styles.tripTime}>Operator Bill</Text>
                  <Text style={styles.tripName}>
                    ₹
                    {!isNaN(driver_todays_earning?.total_paid_amount)
                      ? Math.round(
                          driver_todays_earning?.total_paid_amount,
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
      {/* <View style={styles.bottomNavContainer}>
        <BottomNav Trip={true} />
      </View> */}
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
    fontSize: 12,
    color: Colors.grey,
    marginTop: 10,
    fontWeight: '400',
  },
  tripName: {
    fontSize: 16,
    fontWeight: '600',

    // lineHeight: 10.36,
    color: '#000000',
    marginTop: 6,
    marginBottom: 8,
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
