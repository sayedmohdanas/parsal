// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   FlatList,
//   Image,
// } from 'react-native';
// import Colors from '../../../../common/Colors';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../../common/metrices';
// import CustomHeader from '../../components/CustomHeader';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { GetDriverCurrentLocation } from '../../../../common/CommonFunction';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import Loading from '../../../../components/Loading/Loading';
// import LiveTripCustomCard from '../../../DriverEarning/LiveTripCustomCard';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   hitDriverEarning,
//   hitGetLiveDriverofPartner,
//   hitMyVehicle,
// } from '../../../../config/api/api';
// import AppImages from '../../../../common/AppImages';
// import DriverArriveCard from '../../../DriverEarning/DriverArriveCard';

// const LiveTripScreen = () => {
//   const navigation = useNavigation();
//   const [selectedTrip, setSelectedTrip] = useState(1);
//   const [all_flag, setall_flag] = useState(true);

//   const [driverLocation, setDriverLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });
//   const [loading, setLoading] = useState(true);

//   const [login_data, setlogin_data] = useState();
//   const [partner_riders, setpartner_riders] = useState([]);
//   const [all_driver_in_map, setall_driver_in_map] = useState([]);
//   useFocusEffect(
//     useCallback(() => {
//       setall_flag(true);
//       const fetchDriverLocation = async () => {
//         try {
//           const { latitude, longitude } = await GetDriverCurrentLocation();
//           setDriverLocation({ latitude, longitude });
//         } catch (error) {
//           console.error('Error fetching driver location: ', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       const get_data = async () => {
//         try {
//           const user = await AsyncStorage.getItem('user');
//           const parsedUser = JSON.parse(user);

//           const param = {
//             partnerId: parsedUser?.payload?.partner_id,
//           };

//           const res = await hitMyVehicle(param);
//           setall_driver_in_map(res?.vehicles);
//         } catch (error) {
//           console.error('Error fetching data: ', error);
//         }
//       };
//       const get_live_data = async () => {
//         // if (!all_flag)
//         try {
//           const user = await AsyncStorage.getItem('user');
//           const parsedUser = JSON.parse(user);
//           setlogin_data(parsedUser);
//           const param = {
//             partner_id: parsedUser?.payload?.partner_id,
//           };

//           const res = await hitGetLiveDriverofPartner(param);

//           setpartner_riders(res?.data);
//           if (!all_flag) setSelectedTrip(res?.data[0]);
//         } catch (error) {
//           console.error('Error fetching data: ', error);
//         }
//       };
//       // Call both functions when the screen is focused
//       fetchDriverLocation();
//       get_live_data();
//       get_data();

//       // Cleanup logic if necessary
//       return () => {
//         // Optionally add cleanup code here if needed
//       };
//     }, []), // The empty dependency array ensures this runs every time the screen gains focus
//   );

//   const handleCardClick = item => {
//     setSelectedTrip(item);
//     setall_flag(false);
//   };
//   const renderItem = useMemo(() => {
//     return ({ item }) => {
//       return (
//         <TouchableOpacity onPress={() => handleCardClick(item)}>
//           <View
//             style={[
//               styles.tripCard,
//               selectedTrip?.id == item.id && styles.selectedCard, // Use item.id for selection
//             ]}>
//             <Text style={styles.tripTime}>
//               {/* {Math.round(Math.random() * (24 - 10) + 10)}
//               {':00'}  */}
//               <Text style={{ fontSize: responsiveFontSize(12) }}>
//                 {item?.driver?.driver_name
//                   ? item.driver.driver_name.charAt(0).toUpperCase() +
//                   item.driver.driver_name.slice(1).toLowerCase()
//                   : ''}
//               </Text>
//             </Text>
//             <Text style={[styles.tripName, { fontSize: responsiveFontSize(10) }]}>
//               {' ₹ ' + item?.paid_amount}
//             </Text>
//             {/* Assuming you have driver_name in item */}
//           </View>
//         </TouchableOpacity>
//       );
//     };
//   }, [selectedTrip, handleCardClick]);
//   const mapRef = useRef(null);

//   // Effect to zoom into the driver's location whenever it updates
//   // useEffect(() => {
//   //   if (mapRef.current && selectedTrip?.driver) {
//   //     const currentLat =
//   //       parseFloat(selectedTrip?.driver_lat) || driverLocation.latitude; // Fallback values
//   //     const currentLong =
//   //       parseFloat(selectedTrip?.driver_long) || driverLocation.longitude;
//   //     if (!all_flag)
//   //       mapRef.current.animateToRegion(
//   //         {
//   //           latitude: currentLat,
//   //           longitude: currentLong,
//   //           latitudeDelta: 0.0992,
//   //           longitudeDelta: 0.0991,
//   //         },
//   //         1000, // duration of the animation in milliseconds
//   //       );
//   //   }
//   // }, [selectedTrip]);
//   useEffect(() => {
//     if (mapRef.current && selectedTrip?.driver) {
//       let currentLat, currentLong;

//       if (all_flag && all_driver_in_map.length > 0) {
//         // Calculate the average lat/long for all drivers
//         const sumCoords = all_driver_in_map.reduce(
//           (acc, driver) => {
//             const driverLat = parseFloat(driver.driver?.current_lat) || 0;
//             const driverLong = parseFloat(driver.driver?.current_long) || 0;
//             acc.lat += driverLat;
//             acc.long += driverLong;
//             return acc;
//           },
//           { lat: 0, long: 0 },
//         );

//         currentLat = sumCoords.lat / all_driver_in_map.length;
//         currentLong = sumCoords.long / all_driver_in_map.length;
//       } else {
//         // Fallback to selectedTrip's driver location or driverLocation
//         currentLat =
//           parseFloat(selectedTrip?.driver_lat) || driverLocation.latitude;
//         currentLong =
//           parseFloat(selectedTrip?.driver_long) || driverLocation.longitude;
//       }

//       mapRef.current.animateToRegion(
//         {
//           latitude: currentLat,
//           longitude: currentLong,
//           latitudeDelta: 0.0992,
//           longitudeDelta: 0.0991,
//         },
//         1000, // duration of the animation
//       );
//     }
//   }, [selectedTrip, all_driver_in_map]);
//   const isOnlyPartnerDriver = (all_driver_in_map, login_data) => {
//     // Check if there is exactly one driver
//     if (all_driver_in_map.length === 1) {
//       const { driver: driverInfo } = all_driver_in_map[0];
//       // Check if the driver's phone matches the logged-in user's phone
//       if (driverInfo?.phone === login_data?.payload?.phone) {
//         return true;
//       }
//     }
//     return false;
//   };
//   const onlyPartnerDriver = isOnlyPartnerDriver(all_driver_in_map, login_data);
//   const [driver_todays_earning, setdriver_todays_earning] = useState([]);

//   const get_data = async () => {
//     try {
//       const user = await AsyncStorage.getItem('user');
//       const parsedUser = JSON.parse(user);
//       const param = {
//         driver_id: parsedUser?.payload?.driver_id,
//         filter: 'today',
//       };

//       const res = await hitDriverEarning(param);
//       if (res?.success == false) {
//         setdriver_todays_earning([]);
//       } else {
//         setdriver_todays_earning(res?.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       if (onlyPartnerDriver) get_data();
//     }, []),
//   );
//   return (
//     <SafeAreaView style={styles.container}>
//       {loading ? (
//         <Loading loading={loading} /> // my custom loading component
//       ) : (
//         <>
//           <MapView
//             ref={mapRef}
//             style={StyleSheet.absoluteFillObject}
//             initialRegion={{
//               latitude:
//                 all_flag && all_driver_in_map.length > 0
//                   ? parseFloat(all_driver_in_map[0]?.driver?.current_lat) ||
//                   driverLocation.latitude
//                   : parseFloat(selectedTrip?.driver_lat) ||
//                   driverLocation.latitude,
//               longitude:
//                 all_flag && all_driver_in_map.length > 0
//                   ? parseFloat(all_driver_in_map[0]?.driver?.current_long) ||
//                   driverLocation.longitude
//                   : parseFloat(selectedTrip?.driver_long) ||
//                   driverLocation.longitude,
//               latitudeDelta: 0.0992,
//               longitudeDelta: 0.0991,
//             }}>
//             {driverLocation.latitude &&
//               driverLocation.longitude &&
//               // login_data?.payload?.owner_type !== 1 &&
//               login_data?.payload?.owner_type !== 2 && (
//                 <Marker
//                   coordinate={{
//                     latitude:
//                       parseFloat(selectedTrip?.driver?.current_lat) ||
//                       driverLocation.latitude, // Fallback values
//                     longitude:
//                       parseFloat(selectedTrip?.driver?.current_long) ||
//                       driverLocation.longitude,
//                   }}
//                   title={'Driver Location'}
//                 />
//               )}

//             {/* {login_data?.payload?.owner_type != 0 && !all_flag && (
//               <>
//                 <Marker
//                   coordinate={{
//                     latitude: parseFloat(selectedTrip?.driver_lat),
//                     longitude: parseFloat(selectedTrip?.driver_long),
//                   }}
//                   title="Source"
//                   image={AppImages.Bike}
//                 />
//                 <Marker
//                   coordinate={{
//                     latitude: parseFloat(selectedTrip?.drop_lat),
//                     longitude: parseFloat(selectedTrip?.drop_long),
//                   }}
//                   title="Destination"
//                 />
//                 <Polyline
//                   coordinates={[source, destination]} // Coordinates array
//                   strokeColor={Colors.black} // Red color
//                   strokeWidth={4} // Line thickness
//                   lineDashPattern={[5, 5]} // Dashed line pattern: 10 units dash, 5 units space
//                   lineCap="round" // Round end of line
//                   lineJoin="round" // Round join between line segments
//                 />
//               </>
//             )} */}
//             {login_data?.payload?.owner_type != 0 && !all_flag && (
//               <>
//                 {/* Check if the source coordinates are valid */}
//                 {selectedTrip?.driver_lat && selectedTrip?.driver_long && (
//                   <Marker
//                     coordinate={{
//                       latitude: parseFloat(selectedTrip.driver_lat),
//                       longitude: parseFloat(selectedTrip.driver_long),
//                     }}
//                     title="Source"
//                     image={AppImages.Bike}
//                   />
//                 )}

//                 {/* Check if the destination coordinates are valid */}
//                 {selectedTrip?.drop_lat && selectedTrip?.drop_long && (
//                   <Marker
//                     coordinate={{
//                       latitude: parseFloat(selectedTrip.drop_lat),
//                       longitude: parseFloat(selectedTrip.drop_long),
//                     }}
//                     title="Destination"
//                   />
//                 )}

//                 {/* Check if both source and destination coordinates are valid before rendering Polyline */}
//                 {selectedTrip?.driver_lat &&
//                   selectedTrip?.driver_long &&
//                   selectedTrip?.drop_lat &&
//                   selectedTrip?.drop_long && (
//                     <Polyline
//                       coordinates={[
//                         {
//                           latitude: parseFloat(selectedTrip.driver_lat),
//                           longitude: parseFloat(selectedTrip.driver_long),
//                         },
//                         {
//                           latitude: parseFloat(selectedTrip.drop_lat),
//                           longitude: parseFloat(selectedTrip.drop_long),
//                         },
//                       ]}
//                       strokeColor={Colors.black} // Line color
//                       strokeWidth={4} // Line thickness
//                       lineDashPattern={[5, 5]} // Dashed line pattern
//                       lineCap="round" // Round end of line
//                       lineJoin="round" // Round join between line segments
//                     />
//                   )}
//               </>
//             )}

//             {/* {all_flag &&
//               all_driver_in_map.map((driver, index) => {
//                 const { driver: driverInfo } = driver;
//                 const driverLat = parseFloat(driverInfo?.current_lat);
//                 const driverLong = parseFloat(driverInfo?.current_long);

//                 if (driverInfo && driverLat && driverLong) {
//                   const image =
//                     driverInfo.phone == login_data?.payload?.phone
//                       ? AppImages.Bike
//                       : AppImages.partnerbike;
//                   return (
//                     <Marker
//                       key={index}
//                       coordinate={{ latitude: driverLat, longitude: driverLong }}
//                       image={image}
//                       title={driverInfo.driver_name}
//                       description={driverInfo.vehicle_number}
//                       style={{
//                         width: responsiveWidth(30),
//                         height: responsiveHeight(30),
//                       }}
//                     />
//                   );
//                 }
//                 return null;
//               })} */}
//               {all_flag &&
//               all_driver_in_map.map((driver, index) => {
//                 const {driver: driverInfo} = driver;
//                 const driverLat = parseFloat(driverInfo?.current_lat);
//                 const driverLong = parseFloat(driverInfo?.current_long);

//                 if (driverInfo && driverLat && driverLong) {
//                   const image =
//                     driverInfo.phone == login_data?.payload?.phone
//                       ? AppImages.Bike
//                       : AppImages.partnerbike;
//                   return (
//                     <Marker
//                       key={index}
//                       coordinate={{latitude: driverLat, longitude: driverLong}}
//                       title={driverInfo.driver_name}
//                       description={driverInfo.vehicle_number}
//                      >
//                       <Image
//                         source={image}
//                         style={{
//                           width: responsiveWidth(37),
//                           height: responsiveHeight(37),
//                         }}
//                         resizeMode="contain"
//                       />
//                     </Marker>
//                   );
//                 }
//                 return null;
//               })}

//           </MapView>

//           {/* Header and Trip details */}
//           <View style={styles.content}>
//             <CustomHeader screenName={'Live Trips'} />
//             {!onlyPartnerDriver && (
//               <View style={styles.tripContainer}>
//                 {partner_riders?.length > 0 && (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setSelectedTrip(null);
//                       setall_flag(true);
//                     }}
//                     style={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderBottomWidth: all_flag ? 4 : 0,
//                       borderColor: all_flag ? Colors.brandBlue : 'none',
//                       padding: 8,
//                     }}>
//                     <Image
//                       source={AppImages.driversList}
//                       style={{
//                         height: responsiveHeight(25),
//                         width: responsiveWidth(45),
//                       }}
//                       resizeMode="contain"
//                     />
//                   </TouchableOpacity>
//                 )}
//                 {partner_riders?.length > 0 ? (
//                   <FlatList
//                     data={partner_riders}
//                     horizontal
//                     renderItem={renderItem}
//                   />
//                 ) : (
//                   <View
//                     style={{
//                       flex: 1,
//                       justifyContent: 'center',
//                       alignContent: 'center',
//                     }}>
//                     <Text
//                       style={{
//                         fontSize: responsiveFontSize(12),
//                         paddingVertical: responsiveHeight(12),
//                         color: Colors.grey,
//                         fontWeight: '600',
//                         // marginLeft: responsiveWidth(45),
//                         alignSelf: 'center',
//                       }}>
//                       {'No live trips are currently available'}
//                     </Text>
//                   </View>
//                 )}
//                 {/* <TouchableOpacity onPress={() => handleCardClick(2)}>
//                 <View
//                   style={[
//                     styles.tripCard,
//                     selectedTrip === 2 && styles.selectedCard,
//                   ]}>
//                   <Text style={styles.tripTime}>
//                     01:15{' '}
//                     <Text style={{fontSize: responsiveFontSize(10)}}>AM</Text>
//                   </Text>
//                   <Text style={styles.tripName}>John</Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => handleCardClick(3)}>
//                 <View
//                   style={[
//                     styles.tripCard,
//                     selectedTrip === 3 && styles.selectedCard,
//                   ]}>
//                   <Text style={styles.tripTime}>
//                     02:30{' '}
//                     <Text style={{fontSize: responsiveFontSize(10)}}>AM</Text>
//                   </Text>
//                   <Text style={styles.tripName}>Maria</Text>
//                 </View>
//               </TouchableOpacity> */}
//               </View>
//             )}
//             {onlyPartnerDriver && (
//               <View style={styles.tripContainer}>
//                 <View>
//                   <View style={[styles.tripCard]}>
//                     <Text style={styles.tripTime}>Booking Count</Text>
//                     <Text style={styles.tripName}>
//                       {driver_todays_earning?.length == 0
//                         ? '0'
//                         : driver_todays_earning?.individual_paid_amounts
//                           ?.length}
//                     </Text>
//                   </View>
//                 </View>

//                 <View>
//                   <View style={[styles.tripCard]}>
//                     <Text style={styles.tripTime}>Operator Bill</Text>
//                     <Text style={styles.tripName}>
//                       ₹
//                       {!isNaN(driver_todays_earning?.total_paid_amount)
//                         ? Math.round(
//                           driver_todays_earning?.total_paid_amount,
//                         ).toFixed(2)
//                         : '0'}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </View>
//           <View style={styles.cardContainer}>

//          {/* <DriverArriveCard  /> */}
//           </View>

//           {/* Card positioned just above bottom navigation */}
//           {/* {!selectedTrip && (
//                         <View style={styles.cardContainer}>
//                             {tripData
//                                 .filter(trip => trip.id === selectedTrip)
//                                 .map(trip => (
//                                     <LiveTripCustomCard key={trip.id} trip={trip} />
//                                     // <DriverArriveCard key={trip.id} trip={trip} />
//                                     // <DestinationSection/>
//                                 ))}
//                         </View>
//                     )} */}
//           {/* {login_data?.payload?.owner_type != 0 &&
//             all_flag &&
//             selectedTrip && (
//               <View style={styles.cardContainer}>
//                 <LiveTripCustomCard trip={selectedTrip} />
//               </View>
//             )} */}
//         </>
//       )}

//       {/* Bottom Navigation */}
//       {/* <View style={styles.bottomNavContainer}>
//                 <BottomNav Trip={true} />
//             </View> */}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     position: 'absolute',
//     top: 0,
//     width: '100%',
//   },
//   tripContainer: {
//     borderTopWidth: 1,
//     paddingHorizontal: responsiveWidth(5),
//     borderTopColor: '#D8D8D8',
//     width: '100%',
//     alignSelf: 'center',
//     backgroundColor: Colors.white,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   tripCard: {
//     marginHorizontal: responsiveWidth(16),
//     padding: responsiveHeight(4),
//     // borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.lightGray,
//   },
//   selectedCard: {
//     borderBottomWidth: 4,
//     borderBottomColor: Colors.brandBlue,
//   },
//   tripTime: {
//     fontSize: responsiveFontSize(16),
//     color: Colors.black,
//     fontWeight: '600',
//     marginTop: responsiveHeight(2),
//   },
//   tripName: {
//     fontSize: responsiveFontSize(12),
//     color: Colors.grey,
//     marginTop: responsiveHeight(1),
//     marginBottom: responsiveHeight(2),
//     paddingHorizontal: responsiveWidth(8),
//   },
//   cardContainer: {
//     position: 'absolute',
//     bottom: responsiveHeight(26), // Adjust this value as needed to sit above the BottomNav
//     width: '100%',
//     paddingHorizontal: responsiveWidth(15),
//     zIndex: 10, // Ensure it's above the map
//   },
//   bottomNavContainer: {
//     position: 'absolute',
//     bottom: 13,
//     left: 0,
//     right: 0,
//   },
// });

// export default LiveTripScreen;

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
  hitGetLiveDriverofPartner,
  hitMyVehicle,
} from '../../../../config/api/api';
import AppImages from '../../../../common/AppImages';
import BorderLine from '../../../../common/BorderLine.';

const LiveTripScreen = () => {
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState(1);
  const [all_flag, setall_flag] = useState(false);

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
    // if (!all_flag)
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
      // if (!all_flag) {

      //   setSelectedTrip(res?.data[0]);
      // }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setall_flag(true);
      const fetchDriverLocation = async () => {
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
        }
      };

      // Call both functions when the screen is focused
      fetchDriverLocation();
      get_live_data();
      get_data();

      // Cleanup logic if necessary
      return () => {
        // Optionally add cleanup code here if needed
      };
    }, []), // The empty dependency array ensures this runs every time the screen gains focus
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
              {/* {Math.round(Math.random() * (24 - 10) + 10)}
              {':00'}  */}
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
            {/* Assuming you have driver_name in item */}
          </View>
        </TouchableOpacity>
      );
    };
  }, [selectedTrip, handleCardClick]);
  const mapRef = useRef(null);

  // Effect to zoom into the driver's location whenever it updates
  // useEffect(() => {
  //   if (mapRef.current && selectedTrip?.driver) {
  //     const currentLat =
  //       parseFloat(selectedTrip?.driver_lat) || driverLocation.latitude; // Fallback values
  //     const currentLong =
  //       parseFloat(selectedTrip?.driver_long) || driverLocation.longitude;
  //     if (!all_flag)
  //       mapRef.current.animateToRegion(
  //         {
  //           latitude: currentLat,
  //           longitude: currentLong,
  //           latitudeDelta: 0.0992,
  //           longitudeDelta: 0.0991,
  //         },
  //         1000, // duration of the animation in milliseconds
  //       );
  //   }
  // }, [selectedTrip]);
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

  const [driver_todays_earning, setdriver_todays_earning] = useState([]);
  // console.log('login_data',login_data);

  const get_data = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const param = {
        driver_id: parsedUser?.payload?.driver_id,
        filter: 'today',
        customDate: {start: new Date(), end: null},
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
      if (onlyPartnerDriver) get_data();
    }, [onlyPartnerDriver]),
  );
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
              {driverLocation.latitude &&
                driverLocation.longitude &&
                // login_data?.payload?.owner_type !== 1 &&
                login_data?.payload?.owner_type !== 2 && (
                  <Marker
                    coordinate={{
                      latitude:
                        parseFloat(selectedTrip?.driver?.current_lat) ||
                        driverLocation.latitude, // Fallback values
                      longitude:
                        parseFloat(selectedTrip?.driver?.current_long) ||
                        driverLocation.longitude,
                    }}
                    title={'Driver Location'}
                  />
                )}

              {/* {login_data?.payload?.owner_type != 0 && !all_flag && (
              <>
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedTrip?.driver_lat),
                    longitude: parseFloat(selectedTrip?.driver_long),
                  }}
                  title="Source"
                  image={AppImages.Bike}
                />
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedTrip?.drop_lat),
                    longitude: parseFloat(selectedTrip?.drop_long),
                  }}
                  title="Destination"
                />
                <Polyline
                  coordinates={[source, destination]} // Coordinates array
                  strokeColor={Colors.black} // Red color
                  strokeWidth={4} // Line thickness
                  lineDashPattern={[5, 5]} // Dashed line pattern: 10 units dash, 5 units space
                  lineCap="round" // Round end of line
                  lineJoin="round" // Round join between line segments
                />
              </>
            )} */}
              {login_data?.payload?.owner_type != 0 && !all_flag && (
                <>
                  {/* Check if the source coordinates are valid */}
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

                  {/* Check if the destination coordinates are valid */}
                  {selectedTrip?.drop_lat && selectedTrip?.drop_long && (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(selectedTrip.drop_lat),
                        longitude: parseFloat(selectedTrip.drop_long),
                      }}
                      title="Destination"
                    />
                  )}

                  {/* Check if both source and destination coordinates are valid before rendering Polyline */}
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
                all_driver_in_map.map((driver, index) => {
                  const {driver: driverInfo} = driver;
                  const driverLat = parseFloat(driverInfo?.current_lat);
                  const driverLong = parseFloat(driverInfo?.current_long);

                  if (driverInfo && driverLat && driverLong) {
                    const image =
                      driverInfo.phone == login_data?.payload?.phone
                        ? AppImages.Bike
                        : AppImages.partnerbike;
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

            {/* Header and Trip details */}
            <View style={styles.content}>
              <CustomHeader screenName={'Live Trips'} />
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
                          // marginLeft: responsiveWidth(45),
                          alignSelf: 'center',
                        }}>
                        {'No live trips are currently available'}
                      </Text>
                    </View>
                  )}
                  {/* <TouchableOpacity onPress={() => handleCardClick(2)}>
                <View
                  style={[
                    styles.tripCard,
                    selectedTrip === 2 && styles.selectedCard,
                  ]}>
                  <Text style={styles.tripTime}>
                    01:15{' '}
                    <Text style={{fontSize: responsiveFontSize(10)}}>AM</Text>
                  </Text>
                  <Text style={styles.tripName}>John</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCardClick(3)}>
                <View
                  style={[
                    styles.tripCard,
                    selectedTrip === 3 && styles.selectedCard,
                  ]}>
                  <Text style={styles.tripTime}>
                    02:30{' '}
                    <Text style={{fontSize: responsiveFontSize(10)}}>AM</Text>
                  </Text>
                  <Text style={styles.tripName}>Maria</Text>
                </View>
              </TouchableOpacity> */}
                </View>
              )}
              {onlyPartnerDriver && (
                <View style={styles.tripContainer}>
                  <View>
                    <View style={[styles.tripCard]}>
                      <Text style={styles.tripTime}>Booking Count</Text>
                      <Text style={styles.tripName}>
                        {driver_todays_earning?.length == 0
                          ? '0'
                          : driver_todays_earning?.individual_paid_amounts
                              ?.length}
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
                        {!isNaN(driver_todays_earning?.total_paid_amount)
                          ? Math.round(
                              driver_todays_earning?.total_paid_amount,
                            ).toFixed(2)
                          : '0'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Card positioned just above bottom navigation */}
            {/* {selectedTrip && (
                        <View style={styles.cardContainer}>
                            {tripData
                                .filter(trip => trip.id === selectedTrip)
                                .map(trip => (
                                    // <LiveTripCustomCard key={trip.id} trip={trip} />
                                    // <DriverArriveCard key={trip.id} trip={trip} />
                                    // <DestinationSection/>
                                ))}
                        </View>
                    )} */}
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
    bottom: 10,
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
