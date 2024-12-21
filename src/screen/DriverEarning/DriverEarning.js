// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ImageBackground,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import AppImages from '../../common/AppImages';
// import Colors from '../../common/Colors';
// import OrderDetail from './OrderDetail';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../common/metrices';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import CustomHeader from '../DashBoard/components/CustomHeader';
// import BottomNav from '../../../navigation/BottomNav';
// import DateRangeSelector from '../DashBoard/components/DataRangeSelectore';
// import {hitDriverEarning} from '../../config/api/api';
// import moment from 'moment';
// import BarChart from './BarChart';
// import DriverDetails from './DriversDetail';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {errorToast} from '../../common/CommonFunction';
// import {mystyles} from '../../common/Mystyle';
// import {useSelector} from 'react-redux';

// const Earning = () => {
//   const [selectedRange, setSelectedRange] = useState('today');
//   const [dateRange, setDateRange] = useState({start: '', end: ''});
//   const [loading, setLoading] = useState(false);
//   const [isEarningLoading, setIsEarningLoading] = useState(false);
//   const selectedDriverRedux = useSelector(
//     state => state?.parsalPartner?.logindriverdetails || {},
//   );
//   // console.log('selectedDriverRedux', selectedDriverRedux?.id);
//   useEffect(() => {
//     getEarningData();
//   }, [selectedRange]);

//   useFocusEffect(
//     useCallback(() => {
//       getEarningData();
//     }, [selectedRange]),
//   );

//   const getEarningData = async () => {
//     setLoading(true);

//     let startDate, endDate;
//     if (selectedRange === 'today') {
//       startDate = new Date();

//       endDate = null;
//     } else if (selectedRange === 'week') {
//       startDate = new Date();
//       endDate = new Date();
//       startDate.setDate(startDate.getDate() - 6);
//     }

//     setDateRange({start: startDate, end: endDate});
//     setLoading(false);
//   };

//   const [driver_todays_earning, setdriver_todays_earning] = useState([]);
//   const [login_user, setlogin_user] = useState();

//   const get_data = async (driver_id, flag, range = null) => {
//     setLoading(true);
//     const user = await AsyncStorage.getItem('user');
//     const parsedUser = JSON.parse(user);
//     setlogin_user(parsedUser?.payload);

//     const param = {
//       driver_id: parsedUser?.payload?.driver_id,
//       filter: selectedRange,
//       customDate: range || dateRange, // Use the custom range if provided
//       flag: flag || 0,
//       user_type: parsedUser?.payload?.owner_type,
//       partner_id: parsedUser?.payload?.partner_id,
//     };
//     hitDriverEarning(param)
//       .then(res => {
//         if (res?.success === false) {
//           setdriver_todays_earning([]);
//           setIsEarningLoading(false);
//           setLoading(false);
//         } else {
//           setdriver_todays_earning(res?.data);
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         setIsEarningLoading(false);
//         setLoading(false);
//       })
//       .finally(() => {
//         setIsEarningLoading(false);
//         setLoading(false);
//       });
//   };

//   const [selectedDriver, setSelectedDriver] = useState({driver_id: 0});

//   // const get_driver_list = async () => {
//   //   setLoading(true);
//   //   const user = await AsyncStorage.getItem('user');
//   //   const parsedUser = JSON.parse(user);
//   //   if (parsedUser?.payload?.owner_type != 0) {
//   //     const param = {
//   //       // partnerId: parsedUser?.payload?.partner_id,
//   //       partner_id: parsedUser?.payload?.partner_id,
//   //     };
//   //     hitGetPartnerDriverApi(param)
//   //       .then(res => {
//   //         setpartner_riders(res?.data);
//   //         setSelectedDriver(res?.data?.[0]);
//   //         get_data(res?.data?.[0]?.driver_id);
//   //       })
//   //       .catch(err => {
//   //         console.error(err);
//   //       })
//   //       .finally(() => {
//   //         setIsDriverListLoading(false); // Set loading to false after driver list is fetched

//   //         setLoading(false);
//   //       });
//   //   }
//   // };

//   useFocusEffect(
//     useCallback(() => {
//       setcurrentIndex(3);
//       // const fetchData = async () => {
//       //   const user = await AsyncStorage.getItem('user');
//       //   const parsedUser = JSON.parse(user);
//       //   if (parsedUser?.payload?.owner_type == 0) {
//       //     await get_data(null, 0);
//       //   }
//       // };
//       // fetchData();
//       get_data(null, 0, null);
//       // get_driver_list();
//       return () => {};
//     }, [selectedRange]),
//   );
//   const renderItem = useMemo(() => {
//     return ({item}) => {
//       return <OrderDetail orderDetails={item} />;
//     };
//   }, []);
//   const renderRieder = useMemo(() => {
//     return ({item}) => {
//       return (
//         <DriverDetails
//           details={item}
//           selectedDriver={selectedDriver}
//           onPress={() => {
//             setSelectedDriver(item);
//             // get_data(item?.driver_id);
//           }}
//         />
//       );
//     };
//   }, [selectedDriver]);
//   const formatDateForDisplay = date => {
//     if (date != null && date) {
//       const options = {day: '2-digit', month: 'short', year: 'numeric'};
//       const formattedDate = date?.toLocaleDateString('en-GB', options);
//       return formattedDate.replace(/ /g, '-');
//     }
//   };

//   const calculateDayRange = (startDate, next = true) => {
//     const start = new Date(startDate);
//     const offset = next ? 1 : -1;
//     start.setDate(start.getDate() + offset);

//     return {start: start, end: ''};
//   };
//   const calculateWeekRange = (startDate, next = true) => {
//     const start = new Date(startDate);
//     const offset = next ? 7 : -7;
//     start.setDate(start.getDate() + offset);
//     const end = new Date(start);
//     end.setDate(end.getDate() + 6);

//     return {start: start, end: end};
//   };
//   const [next_flag, setnext_flag] = useState(0);

//   const handlePrevDate = async () => {
//     const currentStartDate = new Date(dateRange.start);

//     if (currentIndex === 0) {
//       if (selectedDriver) {
//         setnext_flag(0);
//         await get_data(null, 0, null);
//         // get_data(0, 0); // Fetch previous 4 data if at the beginning
//       } else {
//         setnext_flag(0);

//         await get_data(null, 0, null);
//         //get_data(null, 0);
//         // Fetch previous 4 data if at the beginning
//       }
//       setcurrentIndex(3); // Go to last index of the newly fetched data
//     } else {
//       setcurrentIndex(prev => prev - 1); // Move to previous index within current data
//     }

//     if (selectedRange === 'week') {
//       const prevWeek = calculateWeekRange(currentStartDate, false);
//       setDateRange(prevWeek);
//     } else if (selectedRange === 'today') {
//       const prevDay = calculateDayRange(currentStartDate, false);
//       setDateRange(prevDay);
//     }
//   };
//   const handleNextDate = async () => {
//     const currentStartDate = new Date(dateRange.start);
//     const today = new Date();

//     if (selectedRange === 'week') {
//       const nextWeek = calculateWeekRange(currentStartDate, true);
//       setDateRange(nextWeek);

//       if (currentIndex === 3) {
//         setcurrentIndex(0); // Reset to 0 when at the last index
//         setnext_flag(1);

//         if (selectedDriver) {
//           setnext_flag(1);
//           await get_data(null, 1, null);
//           //get_data(0, 1); // Fetch next 4 data
//         } else {
//           setnext_flag(1);
//           await get_data(null, 1, null);
//           // get_data(null, 1); // Fetch next 4 data
//         }
//       } else {
//         setcurrentIndex(prev => prev + 1); // Move to next index within current data
//       }

//       if (nextWeek.end > today) {
//         errorToast("Cannot go to the next week; it exceeds today's date.");
//         setcurrentIndex(0); // Reset index to 0 if next week exceeds today
//         return;
//       }
//     } else if (selectedRange === 'today') {
//       const nextDay = calculateDayRange(currentStartDate, true);
//       setDateRange(nextDay);

//       if (currentIndex === 3) {
//         setcurrentIndex(0); // Reset to 0 when at the last index

//         if (selectedDriver) {
//           setnext_flag(1);
//           await get_data(null, 1, null);
//           // Fetch next 4 data
//         } else {
//           setnext_flag(1);
//           await get_data(null, 1, null);
//           // Fetch next 4 data
//         }
//       } else {
//         setcurrentIndex(prev => prev + 1); // Move to next index within current data
//       }

//       if (nextDay.start > today) {
//         errorToast("Cannot go to the next day; it exceeds today's date.");
//         setcurrentIndex(0); // Reset index to 0 if next day exceeds today
//         return;
//       }
//     }
//   };

//   // console.log('driver_todays_earning', driver_todays_earning);
//   // Function to process and transform the driver data
//   const transformDriverData = data => {
//     // Initialize an array to hold the transformed data
//     const transformedData = [];

//     // Iterate through each object in the input array
//     data.forEach(item => {
//       // Check if the item has the "all_driver_data" key
//       if (item.all_driver_data) {
//         // Replace "all_driver_data" with a user-friendly label
//         transformedData.push({
//           driver_name: 'All', // Tag for all driver data
//           earnings: item.all_driver_data,
//           flag: 1,
//           driver_id: 0,
//         });
//       } else {
//         // Iterate through the keys of each object (which will be driver IDs like "226", "227", etc.)
//         Object.keys(item).forEach(driverId => {
//           const driverData = item[driverId];

//           // Extract the partner_id from the driver data, assuming it exists or can be added
//           const partnerId = driverData.partner_id || null; // Default to null if partner_id is not available
//           // Push a new object with the driver's name, partner_id, and associated data
//           transformedData.push({
//             driver_id: driverId, // Add driver ID
//             partner_id: partnerId, // Add partner ID
//             driver_name: driverData.driver_name, // Replace the driver ID with the driver's name
//             earnings: driverData.earnings,
//             profilePic: driverData.profile_pic,
//             vehicleModel: driverData.vehicle_model,
//             vehicleName: driverData.vehicle_name,
//           });
//         });
//       }
//     });

//     return transformedData;
//   };
//   const nextDay =
//     selectedRange === 'today'
//       ? calculateDayRange(new Date(dateRange.start), true)
//       : calculateWeekRange(new Date(dateRange.start), true);
//   const [currentIndex, setcurrentIndex] = useState(1);
//   // const current_data = driver_todays_earning[currentIndex];
//   // Function to get the driver data based on driver_id and index
//   // const getDriverDataByIdAndIndex = async (driverId = 0, index) => {
//   //   // Filter the data based on the driver_id
//   //   console.log('====>', transformDriverData(driver_todays_earning));
//   //   const driverData =  transformDriverData(driver_todays_earning).find(
//   //     item => item.driver_id == driverId,
//   //   );
//   //   console.log('driverId', driverId);
//   //   console.log('driverData', driverData);
//   //   if (driverData && driverData.earnings) {
//   //     if (next_flag) {
//   //       const earningsData = await Object.values(driverData.earnings)[index]; // index corresponds to the day data (0 for first, 1 for second, etc.)
//   //       return earningsData;
//   //     }
//   //     const earningsData = await Object.values(driverData.earnings).reverse()[
//   //       index
//   //     ]; // index corresponds to the day data (0 for first, 1 for second, etc.)
//   //     console.log('earningsData', earningsData);
//   //     return earningsData;
//   //   }
//   //   return null; // Return null if no driver found or earnings data is not available
//   // };
//   const getDriverDataByIdAndIndex = (driverId = 0, index) => {
//     return new Promise((resolve, reject) => {
//       try {
//         // Transform the data and find the required driver's data
//         const transformedData = transformDriverData(driver_todays_earning);
//         // console.log('====>', transformedData[0]);
//         const driverData = transformedData.find(
//           item => item.driver_id == driverId,
//         );
//         // console.log('driverData:::', driverData);
//         if (driverData && driverData.earnings) {
//           // Get the earnings data based on the index
//           const earningsData = next_flag
//             ? Object.values(driverData.earnings)[index]
//             : Object.values(driverData.earnings).reverse()[index];

//           // console.log('earningsData:::', earningsData);

//           // Resolve the earnings data
//           resolve(earningsData);
//         } else {
//           // Resolve null if no data is found
//           resolve(null);
//         }
//       } catch (error) {
//         console.error('Error in getDriverDataByIdAndIndex:', error);
//         // Reject with an error in case of an exception
//         reject(error);
//       }
//     });
//   };

//   const driverData = getDriverDataByIdAndIndex(
//     selectedDriver?.driver_id,
//     currentIndex,
//   );
//   const [render_data, setrender_data] = useState();
//   const fetchData = async () => {
//     if (true) {
//       const driverData = getDriverDataByIdAndIndex(
//         selectedDriverRedux?.id,
//         currentIndex,
//       );
//       console.log('driverData', driverData);
//       setrender_data(driverData);
//       return;
//     } else {
//       setrender_data([]);
//       return;
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, selectedRange]);
//   return (
//     <>
//       <SafeAreaView style={{flex: 1, backgroundColor: Colors.homeBackground}}>
//         <View
//           style={{
//             height: responsiveHeight(60),
//             borderBottomWidth: 0.7,
//             borderColor: '#D8D8D8',
//           }}>
//           <CustomHeader
//             screenName="Earning"
//             setSelectedRange={setSelectedRange}
//             showSplash={true}
//             selectedRange={selectedRange}
//           />
//         </View>
//         <View style={styles.container}>
//           {isEarningLoading ? (
//             <View style={mystyles.center}>
//               <ActivityIndicator size="large" color={Colors.brandBlue} />
//             </View>
//           ) : (
//             <>
//               <View
//                 style={{alignSelf: 'center', marginTop: responsiveHeight(14)}}>
//                 <DateRangeSelector
//                   selectedRange={selectedRange}
//                   setSelectedRange={setSelectedRange}
//                   handleChange={() => {
//                     fetchData();
//                   }}
//                 />
//               </View>
//               <View style={[styles.earningDisplay, {justifyContent: 'center'}]}>
//                 <View style={{justifyContent: 'center', alignItems: 'center'}}>
//                   <Text style={styles.earningAmount}>
//                     ₹
//                     {!isNaN(driverData?.totalPaidAmount) ||
//                     !isNaN(render_data?.totalPaidAmount)
//                       ? isNaN(driverData?.totalPaidAmount)
//                         ? Math.round(render_data?.totalPaidAmount).toFixed(2)
//                         : Math.round(driverData?.totalPaidAmount).toFixed(2)
//                       : '0.00'}
//                   </Text>
//                   {render_data &&
//                   render_data?.individualPaidAmounts?.length !== 0 ? (
//                     <View style={styles.percentageContainer}>
//                       <View style={styles.increaseContainer}>
//                         <Image
//                           source={AppImages.arrowUp}
//                           style={styles.arrowUpImage}
//                           resizeMode="contain"
//                         />
//                         <Text style={styles.percentageText}>
//                           {'3 '}
//                           {'% '}
//                         </Text>
//                       </View>
//                       <Text style={styles.heigherText}>
//                         {'higher than last day'}
//                       </Text>
//                     </View>
//                   ) : (
//                     <View style={styles.percentageContainer}>
//                       <View style={styles.increaseContainer}></View>

//                       <Text
//                         style={{
//                           color: 'black',
//                           fontSize: responsiveFontSize(10),
//                           fontWeight: '400',
//                           lineHeight: responsiveHeight(13),
//                           marginLeft: responsiveHeight(3),
//                         }}>
//                         {'No earning '}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>

//               <View style={styles.earningChart}>
//                 <TouchableOpacity
//                   style={styles.navButton}
//                   onPress={handlePrevDate}>
//                   <Image
//                     source={AppImages.arrowLeft}
//                     style={styles.arrowImage}
//                     resizeMode="contain"
//                   />
//                 </TouchableOpacity>
//                 <Text style={styles.dateText}>
//                   {formatDateForDisplay(dateRange.start)}{' '}
//                   {formatDateForDisplay(dateRange.end) && '-'}{' '}
//                   {formatDateForDisplay(dateRange.end)}
//                 </Text>
//                 <TouchableOpacity
//                   style={[
//                     styles.navButton,
//                     nextDay.start > new Date() && styles.disabledButton,

//                     // Apply disabled styling
//                   ]}
//                   onPress={handleNextDate}
//                   disabled={nextDay.start > new Date()} // Disable the button based on the condition
//                 >
//                   <Image
//                     source={AppImages.arrowRight}
//                     style={styles.arrowImage}
//                     resizeMode="contain"
//                     tintColor={
//                       nextDay.start > new Date() ? '#A9A9A9' : Colors.black
//                     } // Change tint color dynamically
//                   />
//                 </TouchableOpacity>
//               </View>
//               {loading ? (
//                 <View
//                   style={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     alignSelf: 'center',
//                     backgroundColor: 'white',
//                     paddingVertical: responsiveHeight(30),
//                     marginTop: responsiveHeight(110),
//                   }}>
//                   <ActivityIndicator size="large" color={Colors.brandBlue} />
//                 </View>
//               ) : (
//                 // <ScrollView>
//                 <>
//                   {/* {current_data?.individualPaidAmounts.length !== 0 && ( */}

//                   <FlatList
//                     ListHeaderComponent={() => (
//                       <>
//                         {/* {current_data &&
//                             current_data?.individualPaidAmounts.length == 0 ? ( */}
//                         {/* // If no data is available, show an empty state */}

//                         {/* ) : ( */}
//                         {/* // If data is available, show the partner rider list
//                               login_user?.owner_type !== 0  */}

//                         {/* &&
//                               // current_data?.individualPaidAmounts.length ==
//                               //   0 &&  */}
//                         {/* ( */}
//                         <BarChart
//                           week_start_date={new Date(dateRange.start)}
//                           driverEarningData={
//                             render_data?.length != 0 ? render_data : driverData
//                           }
//                           selectedRange={selectedRange}
//                         />
//                         {/* )} */}
//                         <View style={[styles.orderListContainer, {flex: 1}]}>
//                           {(render_data?.individualPaidAmounts?.length == 0 ||
//                             driverData?.individualPaidAmounts?.length == 0) && (
//                             <Text style={styles.orderListHeadign}>
//                               {'Order List '}
//                             </Text>
//                           )}
//                         </View>
//                         <View
//                           style={{
//                             marginLeft: responsiveWidth(15),
//                             marginHorizontal: responsiveWidth(6),
//                             marginTop:
//                               driverData &&
//                               driverData?.individualPaidAmounts?.length == 0 &&
//                               10,
//                           }}>
//                           {transformDriverData(driver_todays_earning)?.length >
//                             1 && (
//                             <FlatList
//                               data={transformDriverData(driver_todays_earning)}
//                               horizontal
//                               renderItem={renderRieder}
//                               keyExtractor={(item, index) => index.toString()}
//                             />
//                           )}
//                         </View>
//                         {(render_data?.individualPaidAmounts?.length === 0 ||
//                           driverData?.individualPaidAmounts?.length === 0) && (
//                           <View
//                             style={{
//                               flex: 1,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                               alignSelf: 'center',
//                               paddingVertical: responsiveHeight(30),
//                               // marginTop: responsiveHeight(150),
//                             }}>
//                             <ImageBackground
//                               source={AppImages.boxbackgound}
//                               style={styles.boxBackstyle}>
//                               <Image
//                                 source={AppImages.emptyImage}
//                                 style={styles.emptyboxStyle}
//                                 resizeMode="contain"
//                               />
//                             </ImageBackground>
//                             <Text style={styles.emptyTextStyle}>
//                               {
//                                 'No Order history Available, contact our support team.'
//                               }
//                             </Text>
//                           </View>
//                         )}

//                         {/* ) */}
//                         {/* )} */}
//                       </>
//                     )}
//                     data={
//                       render_data?.length != 0
//                         ? render_data?.individualPaidAmounts
//                         : driverData?.individualPaidAmounts
//                     }
//                     renderItem={renderItem}
//                     keyExtractor={(item, index) => index.toString()}
//                     contentContainerStyle={{
//                       paddingBottom: responsiveHeight(80),
//                     }}
//                   />
//                   {/* </View> */}
//                 </>
//                 // </ScrollView>
//               )}
//             </>
//           )}
//         </View>
//       </SafeAreaView>
//       <View style={styles.bottomNavContainer}>
//         <BottomNav Earning={true} />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   sliderContainer: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: responsiveHeight(18),
//   },
//   boxBackstyle: {
//     height: responsiveHeight(120),
//     width: responsiveWidth(260),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyboxStyle: {
//     height: responsiveHeight(169),
//     width: responsiveWidth(169),
//   },
//   dateText: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '600',
//     lineHeight: responsiveHeight(14.52),
//     color: Colors.black,
//   },
//   dayText: {
//     fontSize: responsiveFontSize(12),
//     fontWeight: '400',
//     marginTop: responsiveHeight(3),
//     lineHeight: responsiveHeight(14.52),
//     color: '#777777',
//   },
//   emptyTextStyle: {
//     fontSize: responsiveFontSize(10),
//     fontWeight: '400',
//     color: Colors.grey,
//     textAlign: 'center',
//     marginHorizontal: responsiveWidth(40),
//     paddingTop: responsiveHeight(10),
//   },
//   earningDisplay: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: responsiveHeight(18),
//     paddingHorizontal: responsiveHeight(30),
//     flexDirection: 'row',
//   },
//   earningChart: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: responsiveHeight(10),
//     paddingBottom: responsiveHeight(10),
//     paddingHorizontal: responsiveHeight(50),
//     flexDirection: 'row',
//   },
//   navButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: responsiveHeight(10),
//     paddingHorizontal: responsiveWidth(15),
//     // backgroundColor:'pink'
//   },
//   arrowImage: {
//     width: responsiveHeight(18),
//     height: responsiveHeight(18),
//     tintColor: Colors.black,
//   },
//   totalEarningText: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '400',
//     color: Colors.grey,
//   },
//   earningAmount: {
//     fontSize: responsiveFontSize(26),
//     fontWeight: '700',
//     color: Colors.black,
//   },
//   percentageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 4,
//   },
//   increaseContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(69, 184, 69, 0.1)',
//     borderRadius: 4,
//   },
//   arrowUpImage: {
//     width: responsiveFontSize(10),
//     height: responsiveFontSize(10),
//   },
//   percentageText: {
//     color: '#45B845',
//     fontSize: responsiveFontSize(10),
//   },
//   heigherText: {
//     fontSize: responsiveFontSize(10),
//     fontWeight: '400',
//     color: '#777777',
//     lineHeight: responsiveHeight(13),
//     marginLeft: responsiveHeight(3),
//   },
//   orderListContainer: {
//     backgroundColor: Colors.homeBackground,
//   },
//   orderListHeadign: {
//     fontSize: responsiveFontSize(16),
//     fontWeight: '700',
//     marginLeft: responsiveHeight(22),
//     color: Colors.black,
//     marginBottom: responsiveHeight(10),
//     marginTop: responsiveHeight(16),
//   },
//   scrollView: {
//     paddingBottom: responsiveHeight(40),
//   },
//   profileCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: responsiveHeight(10),
//     backgroundColor: 'white',
//     margin: responsiveHeight(5),
//     borderRadius: 10,
//     marginBottom: responsiveHeight(3),
//   },
//   profileInfo: {
//     flexDirection: 'row',
//     flex: 0.8,
//   },
//   profileImage: {
//     width: responsiveHeight(90),
//     height: responsiveHeight(50),
//     borderRadius: responsiveHeight(25),
//     marginRight: responsiveHeight(20),
//   },
//   name: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '500',
//     color: Colors.black,
//   },
//   profileText: {
//     justifyContent: 'center',
//     marginLeft: responsiveHeight(10),
//   },
//   place: {
//     fontSize: responsiveFontSize(12),
//     color: Colors.gray,
//   },
//   earningContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     flex: 0.2,
//   },
//   earningText: {
//     fontSize: responsiveFontSize(12),
//     color: Colors.black,
//   },
//   graphStyle: {
//     width: '100%',
//     height: 200,
//     backgroundColor: 'lightgray',
//   },
//   bottomNavContainer: {
//     position: 'absolute',
//     bottom: 13,
//     left: 0,
//     right: 0,
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   disabledButton: {
//     // backgroundColor: '#A9A9A9', // Grey color to indicate disabled state
//   },
// });

// export default Earning;
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import OrderDetail from './OrderDetail';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../DashBoard/components/CustomHeader';
import BottomNav from '../../../navigation/BottomNav';
import DateRangeSelector from '../DashBoard/components/DataRangeSelectore';
import {
  hitDriverEarning,
  hitGetPartnerDriverApi,
  hitMyVehicle,
} from '../../config/api/api';
import moment from 'moment';
import BarChart from './BarChart';
import DriverDetails from './DriversDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { errorToast } from '../../common/CommonFunction';
import { mystyles } from '../../common/Mystyle';
import { useSelector } from 'react-redux';

const Earning = () => {
  const [selectedRange, setSelectedRange] = useState('today');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [isEarningLoading, setIsEarningLoading] = useState(false);
  const [isDriverListLoading, setIsDriverListLoading] = useState(false);
  const [logndetail, setlogindetail] = useState();
  const logindriverdetails = useSelector(
    state => state?.parsalPartner?.logindriverdetails || {},
  );
  const owner = useSelector(state => state?.parsalPartner?.owner || {});
  useEffect(() => {
    getEarningData();
  }, [selectedRange]);

  useFocusEffect(
    useCallback(() => {
      getEarningData();
    }, [selectedRange]),
  );

  const getEarningData = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    setlogindetail(parsedUser);
    let startDate, endDate;
    if (selectedRange === 'today') {
      startDate = new Date();

      endDate = null;
    } else if (selectedRange === 'week') {
      startDate = new Date();
      endDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
    }

    setDateRange({ start: startDate, end: endDate });
    setLoading(false);
  };
  const [driver_todays_earning, setdriver_todays_earning] = useState([]);
  const get_data = async (driver_id, flag, range = null) => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const param = {
      driver_id:
        parsedUser?.payload?.owner_type == 0
          ? parsedUser?.payload?.driver_id
          : 0,
      filter: selectedRange,
      customDate: range || dateRange,
      flag: flag || 0,
      user_type: parsedUser?.payload?.owner_type,
      partner_id: parsedUser?.payload?.partner_id,
    };
    
    console.log('param', JSON.stringify(param));
    hitDriverEarning(param)
      .then(res => {
        // console.log('res', res?.data);
        if (res?.success === false) {
          setdriver_todays_earning([]);
          setIsEarningLoading(false);
          setLoading(false);
        } else {
          setdriver_todays_earning(res?.data);
        }
      })
      .catch(err => {
        console.error(err);
        setIsEarningLoading(false);
        setLoading(false);
      })
      .finally(() => {
        setIsEarningLoading(false);
        setLoading(false);
      });
  };

  const [selectedDriver, setSelectedDriver] = useState({ driver_id: 0 });

  useFocusEffect(
    useCallback(() => {
      setcurrentIndex(3);
      get_data(null, 0, null);
      return () => { };
    }, [selectedRange]),
  );
  const renderItem = useMemo(() => {
    return ({ item }) => {
      return <OrderDetail orderDetails={item} />;
    };
  }, []);
  const renderRieder = useMemo(() => {
    return ({ item }) => {
      return (
        <DriverDetails
          details={item}
          selectedDriver={selectedDriver}
          onPress={() => {
            setSelectedDriver(item);
          }}
        />
      );
    };
  }, [selectedDriver]);
  const formatDateForDisplay = date => {
    if (date != null && date) {
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = date?.toLocaleDateString('en-GB', options);
      return formattedDate.replace(/ /g, '-');
    }
  };

  const calculateDayRange = (startDate, next = true) => {
    const start = new Date(startDate);
    const offset = next ? 1 : -1;
    start.setDate(start.getDate() + offset);

    return { start: start, end: '' };
  };
  const calculateWeekRange = (startDate, next = true) => {
    const start = new Date(startDate);
    const offset = next ? 7 : -7;
    start.setDate(start.getDate() + offset);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return { start: start, end: end };
  };
  const [next_flag, setnext_flag] = useState(0);

  const handlePrevDate = async () => {
    const currentStartDate = new Date(dateRange.start);

    if (currentIndex === 0) {
      if (selectedDriver) {
        setnext_flag(0);
        await get_data(null, 0, null);
      } else {
        setnext_flag(0);
        await get_data(null, 0, null);
      }
      setcurrentIndex(3); // Go to last index of the newly fetched data
    } else {
      setcurrentIndex(prev => prev - 1); // Move to previous index within current data
    }

    if (selectedRange === 'week') {
      const prevWeek = calculateWeekRange(currentStartDate, false);
      setDateRange(prevWeek);
    } else if (selectedRange === 'today') {
      const prevDay = calculateDayRange(currentStartDate, false);
      setDateRange(prevDay);
    }
  };
  const handleNextDate = async () => {
    const currentStartDate = new Date(dateRange.start);
    const today = new Date();

    if (selectedRange === 'week') {
      const nextWeek = calculateWeekRange(currentStartDate, true);
      setDateRange(nextWeek);
      console.log(nextWeek);
      if (currentIndex === 3) {
        setcurrentIndex(0); // Reset to 0 when at the last index
        setnext_flag(1);

        if (selectedDriver) {
          setnext_flag(1);
          await get_data(null, 1, nextWeek);
          //get_data(0, 1); // Fetch next 4 data
        } else {
          setnext_flag(1);
          await get_data(null, 1, nextWeek);
          // get_data(null, 1); // Fetch next 4 data
        }
      } else {
        setcurrentIndex(prev => prev + 1); // Move to next index within current data
      }
      if (nextWeek.end > today) {
        errorToast("Cannot go to the next week; it exceeds today's date.");
        setcurrentIndex(0); // Reset index to 0 if next week exceeds today
        return;
      }
    } else if (selectedRange === 'today') {
      const nextDay = calculateDayRange(currentStartDate, true);
      setDateRange(nextDay);

      if (currentIndex === 3) {
        setcurrentIndex(0); // Reset to 0 when at the last index

        if (selectedDriver) {
          setnext_flag(1);
          await get_data(null, 1, null);
          // Fetch next 4 data
        } else {
          setnext_flag(1);
          await get_data(null, 1, null);
          // Fetch next 4 data
        }
      } else {
        setcurrentIndex(prev => prev + 1); // Move to next index within current data
      }

      if (nextDay.start > today) {
        errorToast("Cannot go to the next day; it exceeds today's date.");
        setcurrentIndex(0); // Reset index to 0 if next day exceeds today
        return;
      }
    }
  };

  // console.log('driver_todays_earning', driver_todays_earning);
  // Function to process and transform the driver data
  const transformDriverData = data => {
    // Initialize an array to hold the transformed data
    const transformedData = [];
    // Iterate through each object in the input array
    data.forEach(item => {
      // Check if the item has the "all_driver_data" key
      if (item.all_driver_data) {
        // Replace "all_driver_data" with a user-friendly label
        transformedData.push({
          driver_name: 'All', // Tag for all driver data
          earnings: item.all_driver_data,
          flag: 1,
          driver_id: 0,
        });
      } else {
        // Iterate through the keys of each object (which will be driver IDs like "226", "227", etc.)
        Object.keys(item).forEach(driverId => {
          const driverData = item[driverId];
          // Extract the partner_id from the driver data, assuming it exists or can be added
          const partnerId = driverData.partner_id || null; // Default to null if partner_id is not available
          // Push a new object with the driver's name, partner_id, and associated data
          transformedData.push({
            driver_id: driverId, // Add driver ID
            partner_id: partnerId, // Add partner ID
            driver_name: driverData.driver_name, // Replace the driver ID with the driver's name
            earnings: driverData.earnings,
            profilePic: driverData.profile_pic,
            vehicleModel: driverData.vehicle_model,
            vehicleName: driverData.vehicle_name,
          });
        });
      }
    });
    return transformedData;
  };
  const nextDay =
    selectedRange === 'today'
      ? calculateDayRange(new Date(dateRange.start), true)
      : calculateWeekRange(new Date(dateRange.start), true);
  const [currentIndex, setcurrentIndex] = useState(1);
  const getDriverDataByIdAndIndex = (driverId = 0, index) => {
    const driverData = transformDriverData(driver_todays_earning).find(
      item => item.driver_id == driverId,
    );
    if (driverData && driverData.earnings) {
      if (next_flag) {
        const earningsData = Object.values(driverData.earnings)[index]; 
        return earningsData;
      }
      const earningsData = Object.values(driverData.earnings).reverse()[index]; 
      return earningsData;
    }
    return null; 
  };
  const driverData = getDriverDataByIdAndIndex(
    logndetail?.payload?.owner_type == 0
      ? logindriverdetails?.id
      : selectedDriver?.driver_id,
    currentIndex,
  );
  const transformedData = useMemo(() => {
    return transformDriverData(driver_todays_earning);
  }, [driver_todays_earning, selectedRange]);
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
        <View
          style={{
            height: responsiveHeight(60),
            borderBottomWidth: 0.7,
            borderColor: '#D8D8D8',
          }}>
          <CustomHeader
            screenName="Earning"
            setSelectedRange={setSelectedRange}
            showSplash={true}
            selectedRange={selectedRange}
          />
        </View>
        <View style={styles.container}>
          {isEarningLoading ? (
            <View style={mystyles.center}>
              <ActivityIndicator size="large" color={Colors.brandBlue} />
            </View>
          ) : (
            <>
              <View
                style={{ alignSelf: 'center', marginTop: responsiveHeight(14) }}>
                <DateRangeSelector
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  handleChange={() => {
                    setcurrentIndex(3);
                    setnext_flag(0);
                    getEarningData();
                  }}
                />
              </View>
              <View style={[styles.earningDisplay, { justifyContent: 'center' }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.earningAmount}>
                    ₹
                    {!isNaN(driverData?.totalPaidAmount)
                      ? Math.round(driverData?.totalPaidAmount).toFixed(2)
                      : '0.00'}
                  </Text>
                  {driverData &&
                    driverData?.individualPaidAmounts?.length !== 0 ? (
                    <View style={styles.percentageContainer}>
                      <View style={styles.increaseContainer}>
                        <Image
                          source={AppImages.arrowUp}
                          style={styles.arrowUpImage}
                          resizeMode="contain"
                        />
                        <Text style={styles.percentageText}>
                          {'3 '}
                          {'% '}
                        </Text>
                      </View>
                      <Text style={styles.heigherText}>
                        {'higher than last day'}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.percentageContainer}>
                      <View style={styles.increaseContainer}></View>

                      <Text
                        style={{
                          color: 'black',
                          fontSize: responsiveFontSize(10),
                          fontWeight: '400',
                          lineHeight: responsiveHeight(13),
                          marginLeft: responsiveHeight(3),
                        }}>
                        {'No earning '}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <ScrollView>
                <View style={styles.earningChart}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handlePrevDate}>
                    <Image
                      source={AppImages.arrowLeft}
                      style={styles.arrowImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text style={styles.dateText}>
                    {formatDateForDisplay(dateRange.start)}{' '}
                    {formatDateForDisplay(dateRange.end) && '-'}{' '}
                    {formatDateForDisplay(dateRange.end)}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      nextDay.start > new Date() && styles.disabledButton,

                      // Apply disabled styling
                    ]}
                    onPress={handleNextDate}
                    disabled={nextDay.start > new Date()} // Disable the button based on the condition
                  >
                    <Image
                      source={AppImages.arrowRight}
                      style={styles.arrowImage}
                      resizeMode="contain"
                      tintColor={
                        nextDay.start > new Date() ? '#A9A9A9' : Colors.black
                      } // Change tint color dynamically
                    />
                  </TouchableOpacity>
                </View>
                {loading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      backgroundColor: 'white',
                      paddingVertical: responsiveHeight(30),
                      marginTop: responsiveHeight(110),
                    }}>
                    <ActivityIndicator size="large" color={Colors.brandBlue} />
                  </View>
                ) : (
                  <>
                    {/* {current_data?.individualPaidAmounts.length !== 0 && ( */}
                    {driverData?.individualPaidAmounts?.length != 0 ? (
                      <BarChart
                      week_start_date={new Date(dateRange.start)}
                      driverEarningData={driverData}
                      selectedRange={selectedRange}
                    />
                    ):
                    null}
                    {/* {driverData?.individualPaidAmounts?.length !== 0 && (
                      <BarChart
                        week_start_date={new Date(dateRange.start)}
                        driverEarningData={driverData}
                        selectedRange={selectedRange}
                      />
                    )} */}
                    {/* )} */}
                    <View style={[styles.orderListContainer, { flex: 1 }]}>
                      {/* {driverData?.individualPaidAmounts?.length !=0 && ( */}
                        {/* {driverData?.individualPaidAmounts?.length != 0 ? ( */}
                        {driverData?.individualPaidAmounts?.length != 0 ? (

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // marginBottom: 10,
                          }}>
                          <Text style={styles.orderListHeadign}>Order List</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedDriver({ driver_id: 0 });
                            }}>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(12),
                                fontWeight: '600',
                                marginRight: responsiveHeight(22),
                                color: Colors.brandBlue,
                                textDecorationLine:
                                  selectedDriver?.driver_id == 0
                                    ? 'underline'
                                    : 'none',
                              }}>
                              Show All
                            </Text>
                          </TouchableOpacity>
                        </View>
                       ):null} 

                      <FlatList
                        ListHeaderComponent={() => (
                          <>
                            {/* {current_data &&
                            current_data?.individualPaidAmounts.length == 0 ? ( */}
                            {/* // If no data is available, show an empty state */}

                            {/* ) : ( */}
                            {/* // If data is available, show the partner rider list
                              login_user?.owner_type !== 0  */}

                            {/* &&
                              // current_data?.individualPaidAmounts.length ==
                              //   0 &&  */}
                            {/* ( */}
                            <View
                              style={{
                                marginLeft: responsiveWidth(15),
                                marginHorizontal: responsiveWidth(6),
                                marginTop:
                                  driverData &&
                                  driverData?.individualPaidAmounts?.length ==
                                  0 &&
                                  10,
                              }}>
                              {driverData?.totalPaidAmount > 0 && (
                                <FlatList
                                  data={transformedData.slice(1)}
                                  horizontal
                                  renderItem={renderRieder}
                                  keyExtractor={(item, index) => index.toString()}
                                />
                              )}
                            </View>
                            {/* {driverData?.individualPaidAmounts?.length != 0 && (
                      <Text style={styles.orderListHeadign}>
                        {'Order List '}
                      </Text>
                    )} */}
                            {driverData?.individualPaidAmounts?.length === 0 && (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                  marginVertical:100,
                                  paddingVertical: responsiveHeight(0),
                                  marginTop: responsiveHeight(150),
                                }}>
                                <ImageBackground
                                  source={AppImages.boxbackgound}
                                  style={styles.boxBackstyle}>
                                  <Image
                                    source={AppImages.emptyImage}
                                    style={styles.emptyboxStyle}
                                    resizeMode="contain"
                                  />
                                </ImageBackground>
                                <Text style={styles.emptyTextStyle}>
                                  {
                                    'No Order history Available, contact our support team.'
                                  }
                                </Text>
                              </View>
                            )}

                            {/* ) */}
                            {/* )} */}
                          </>
                        )}
                        data={driverData?.individualPaidAmounts}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                          paddingBottom: responsiveHeight(80),
                        }}
                      />
                    </View>
                  </>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </SafeAreaView>
      <View style={styles.bottomNavContainer}>
        <BottomNav Earning={true} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sliderContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveHeight(18),
  },
  boxBackstyle: {
    height: responsiveHeight(110),
    width: responsiveWidth(230),
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain'
  },
  emptyboxStyle: {
    height: responsiveHeight(150),
    width: responsiveWidth(150),
  },
  dateText: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    lineHeight: responsiveHeight(14.52),
    color: Colors.black,
  },
  dayText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    marginTop: responsiveHeight(3),
    lineHeight: responsiveHeight(14.52),
    color: '#777777',
  },
  emptyTextStyle: {
    fontSize: responsiveFontSize(10),
    fontWeight: '400',
    color: Colors.grey,
    textAlign: 'center',
    marginHorizontal: responsiveWidth(40),
    paddingTop: responsiveHeight(10),
  },
  earningDisplay: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveHeight(18),
    paddingHorizontal: responsiveHeight(30),
    flexDirection: 'row',
    
  },
  earningChart: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveHeight(10),
    paddingBottom: responsiveHeight(10),
    paddingHorizontal: responsiveHeight(50),
    flexDirection: 'row',
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(15),
    // backgroundColor:'pink'
  },
  arrowImage: {
    width: responsiveHeight(18),
    height: responsiveHeight(18),
    tintColor: Colors.black,
  },
  totalEarningText: {
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
    color: Colors.grey,
  },
  earningAmount: {
    fontSize: responsiveFontSize(26),
    fontWeight: '700',
    color: Colors.black,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  increaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69, 184, 69, 0.1)',
    borderRadius: 4,
  },
  arrowUpImage: {
    width: responsiveFontSize(10),
    height: responsiveFontSize(10),
  },
  percentageText: {
    color: '#45B845',
    fontSize: responsiveFontSize(10),
  },
  heigherText: {
    fontSize: responsiveFontSize(10),
    fontWeight: '400',
    color: '#777777',
    lineHeight: responsiveHeight(13),
    marginLeft: responsiveHeight(3),
  },
  orderListContainer: {
    backgroundColor: Colors.homeBackground,
  },
  orderListHeadign: {
    fontSize: responsiveFontSize(16),
    fontWeight: '700',
    marginLeft: responsiveHeight(22),
    color: Colors.black,
    marginBottom: responsiveHeight(10),
    marginTop: responsiveHeight(10),
  },
  scrollView: {
    paddingBottom: responsiveHeight(40),
  },
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: responsiveHeight(10),
    backgroundColor: 'white',
    margin: responsiveHeight(5),
    borderRadius: 10,
    marginBottom: responsiveHeight(3),
  },
  profileInfo: {
    flexDirection: 'row',
    flex: 0.8,
  },
  profileImage: {
    width: responsiveHeight(90),
    height: responsiveHeight(50),
    borderRadius: responsiveHeight(25),
    marginRight: responsiveHeight(20),
  },
  name: {
    fontSize: responsiveFontSize(14),
    fontWeight: '500',
    color: Colors.black,
  },
  profileText: {
    justifyContent: 'center',
    marginLeft: responsiveHeight(10),
  },
  place: {
    fontSize: responsiveFontSize(12),
    color: Colors.gray,
  },
  earningContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.2,
  },
  earningText: {
    fontSize: responsiveFontSize(12),
    color: Colors.black,
  },
  graphStyle: {
    width: '100%',
    height: 200,
    backgroundColor: 'lightgray',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 13,
    left: 0,
    right: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    // backgroundColor: '#A9A9A9', // Grey color to indicate disabled state
  },
});

export default Earning;
