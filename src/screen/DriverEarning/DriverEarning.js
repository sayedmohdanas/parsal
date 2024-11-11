import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import OrderDetail from './OrderDetail';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../DashBoard/components/CustomHeader';
import BottomNav from '../../../navigation/BottomNav';
import DateRangeSelector from '../DashBoard/components/DataRangeSelectore';
import {hitDriverEarning, hitMyVehicle} from '../../config/api/api';
import moment from 'moment';
import BarChart from './BarChart';
import DriverDetails from './DriversDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Line from '../../components/Line/Line';
import {errorToast} from '../../common/CommonFunction';
import Loading from '../../components/Loading/Loading';
import {useSelector} from 'react-redux';

const Earning = () => {
  const [selectedRange, setSelectedRange] = useState('today'); // date range
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dateRange, setDateRange] = useState({start: '', end: ''});
  const [loading, setLoading] = useState(false); // State for loading

  const navigation = useNavigation();
  useEffect(() => {
    getEarningData();
  }, [selectedRange]);

  useFocusEffect(
    useCallback(() => {
      getEarningData();
    }, [selectedRange]),
  );

  // Function to get earning data
  const getEarningData = async () => {
    setLoading(true); // Start loading

    let startDate, endDate;
    if (selectedRange === 'today') {
      startDate = new Date(); // Use today's date as JavaScript Date object
      endDate = null; // No end date for 'today'
    } else if (selectedRange === 'week') {
      startDate = new Date(); // Today's date as end of the week
      endDate = new Date(); // Clone today's date for start calculation
      startDate.setDate(startDate.getDate() - 6); // Subtract 6 days to get start of the week
    }

    setDateRange({start: startDate, end: endDate});
    setLoading(false); // Stop loading
  };

  const [driver_todays_earning, setdriver_todays_earning] = useState([]);
  const [login_user, setlogin_user] = useState();
  const get_data = async driver_id => {
    setLoading(true); // Start loading

    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    setlogin_user(parsedUser?.payload);
    if (parsedUser?.payload?.owner_type == 0) {
      const param = {
        driver_id: parsedUser?.payload?.driver_id,
        filter: selectedRange,
        customDate: dateRange,
      };
      hitDriverEarning(param)
        .then(res => {
          if (res?.success == false) {
            setdriver_todays_earning([]);
          } else {
            // console.log('res---->',res?.data);
            setdriver_todays_earning(res?.data);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const param = {
        driver_id: driver_id,
        filter: selectedRange,
        customDate: dateRange,
      };
      hitDriverEarning(param)
        .then(res => {
          if (res?.success == false) {
            setdriver_todays_earning([]);
          } else {
            setdriver_todays_earning(res?.data);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const [partner_riders, setpartner_riders] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState();
  const get_driver_list = async () => {
    setLoading(true); // Start loading
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    if (parsedUser?.payload?.owner_type != 0) {
      const param = {
        partnerId: parsedUser?.payload?.partner_id,
      };
      hitMyVehicle(param)
        .then(res => {
          setpartner_riders(res?.vehicles);
          const drivers = res?.vehicles?.filter(
            item => item?.driver_id != null,
          );
          setSelectedDriver(drivers?.[0]);
          get_data(drivers[0]?.driver_id);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        if (parsedUser?.payload?.owner_type == 0) {
          await get_data(); // Ensure to await if get_data is a promise
        }
      };
      fetchData(); // Call the async function
      get_driver_list(); // Call this function normally
      // Cleanup if needed when the screen is unfocused
      return () => {
        // Cleanup logic here if necessary
      };
    }, [selectedRange, dateRange]), // The dependency array can be adjusted as needed
  );
  const renderItem = useMemo(() => {
    return ({item}) => {
      return <OrderDetail orderDetails={item} />;
    };
  }, []);
  const renderRieder = useMemo(() => {
    return ({item}) => {
      return (
        <DriverDetails
          details={item}
          selectedDriver={selectedDriver}
          onPress={() => {
            setSelectedDriver(item);
            get_data(item?.driver_id);
          }}
        />
      );
    };
  }, [selectedDriver]);
  // const formatDateForDisplay = (date) => {
  // console.log('data',date);
  //   return date ? date.toDateString() : ''; // Format the date when needed
  // };
  const formatDateForDisplay = date => {
    if (date != null && date) {
      const options = {day: '2-digit', month: 'short', year: 'numeric'};
      const formattedDate = date?.toLocaleDateString('en-GB', options);
      // Replace spaces with hyphens
      return formattedDate.replace(/ /g, '-');
    }
  };

  const handlePrevDate = () => {
    const currentStartDate = new Date(dateRange.start);

    if (selectedRange === 'week') {
      // Calculate previous week range
      const prevWeek = calculateWeekRange(currentStartDate, false);
      setDateRange(prevWeek);
    } else if (selectedRange === 'today') {
      // Calculate previous day
      const prevDay = calculateDayRange(currentStartDate, false);
      setDateRange(prevDay);
    }
  };
  const calculateDayRange = (startDate, next = true) => {
    const start = new Date(startDate);
    const offset = next ? 1 : -1; // Forward or backward by 1 day
    start.setDate(start.getDate() + offset);

    return {start: start, end: ''}; // Only start date for 'today'
  };
  const calculateWeekRange = (startDate, next = true) => {
    const start = new Date(startDate);
    const offset = next ? 7 : -7; // Forward or backward by 7 days
    start.setDate(start.getDate() + offset);
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // End of the week

    return {start: start, end: end};
  };
  const handleNextDate = () => {
    const currentStartDate = new Date(dateRange.start);
    const today = new Date(); // Today's date

    if (selectedRange === 'week') {
      // Calculate next week range
      const nextWeek = calculateWeekRange(currentStartDate, true);

      // Check if the next week's end date exceeds today
      if (nextWeek.end > today) {
        // Prevent updating to next week if it exceeds today
        // Alert.alert("Cannot go to the next week; it exceeds today's date.")
        errorToast("Cannot go to the next week; it exceeds today's date.");
        return;
      }

      setDateRange(nextWeek);
    } else if (selectedRange === 'today') {
      // Calculate next day
      const nextDay = calculateDayRange(currentStartDate, true);

      // Check if the next day's start date exceeds today
      if (nextDay.start > today) {
        // Prevent updating to next day if it exceeds today
        errorToast("Cannot go to the next day; it exceeds today's date.");

        return;
      }

      setDateRange(nextDay);
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.homeBackground}}>
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
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <>
              <View
                style={{alignSelf: 'center', marginTop: responsiveHeight(14)}}>
                <DateRangeSelector
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                />
              </View>
              {driver_todays_earning?.individual_paid_amounts && (
                <View
                  style={[styles.earningDisplay, {justifyContent: 'center'}]}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.earningAmount}>
                      ₹
                      {!isNaN(driver_todays_earning?.total_paid_amount)
                        ? Math.round(
                            driver_todays_earning?.total_paid_amount,
                          ).toFixed(2)
                        : '0'}
                    </Text>
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
                  </View>
                </View>
              )}
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
                  style={styles.navButton}
                  onPress={handleNextDate}>
                  <Image
                    source={AppImages.arrowRight}
                    style={styles.arrowImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              {/* Bar Chart */}
              {driver_todays_earning?.total_paid_amount && (
                <BarChart
                  driverEarningData={driver_todays_earning}
                  selectedRange={selectedRange}
                />
              )}
              {/* Order List Section */}
              <View style={[styles.orderListContainer, {flex: 1}]}>
                {/* <Line marginH={0}/> */}
                {/* <BorderLine thickness={0.}/> */}
                {driver_todays_earning?.individual_paid_amounts && (
                  <Text style={styles.orderListHeadign}>{'Order List '}</Text>
                )}
                <FlatList
                  ListHeaderComponent={() => (
                    <>
                      {!driver_todays_earning?.individual_paid_amounts && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            paddingVertical: 30,

                            marginTop: responsiveHeight(110),
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
                      {login_user?.owner_type != 0 &&
                        driver_todays_earning?.individual_paid_amounts && (
                          <View style={{marginLeft: 20}}>
                            {partner_riders?.length > 1 && (
                              <FlatList
                                data={partner_riders}
                                horizontal
                                renderItem={renderRieder}
                                keyExtractor={(item, index) => index.toString()}
                              />
                            )}
                          </View>
                        )}
                    </>
                  )}
                  data={driver_todays_earning?.individual_paid_amounts}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{flexGrow: 1}}
                />
              </View>
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
    height: responsiveHeight(133),
    width: responsiveWidth(277),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyboxStyle: {
    height: responsiveHeight(169),
    width: responsiveWidth(169),
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
    padding: responsiveHeight(10),
    paddingHorizontal: responsiveHeight(30),
    flexDirection: 'row',
  },
  earningChart: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveHeight(10),
    paddingHorizontal: responsiveHeight(50),
    flexDirection: 'row',
    // marginBottom: responsiveHeight(16),
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
    // marginVertical:responsiveHeight(20)
    // paddingHorizontal: responsiveHeight(10),
    // marginBottom:responsiveHeight(60)
  },
  orderListHeadign: {
    fontSize: responsiveFontSize(16),
    fontWeight: '700',
    marginLeft: responsiveHeight(22),
    color: Colors.black,
    marginBottom: 10,
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
});

export default Earning;
