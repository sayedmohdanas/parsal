import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import Font from '../../common/Font';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { useNavigation } from '@react-navigation/native';
import {
  hitGetPartnerDriverApi,
  hitGetTransactionListApi,
} from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../common/AppImages';
import {
  formatDate,
  formatDateOnly,
  getLast3Months,
  getLast7Days,
  getLastMonth,
  getToday,
} from '../../common/CommonFunction';
import { Fonts, FontSizes, Spacing } from '../../common/Theme';
import Data from '../AccountScreen/Component/Data';
import TransactionMode from './TransactionMode';
import DriverDetails from '../DriverEarning/DriversDetail';
import DateRangeModal from '../DashBoard/components/SelectDateModal';

const TransactionHistory = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Original data
  const [filteredData, setFilteredData] = useState([]); // Data displayed after filtering
  const [searchText, setSearchText] = useState(''); // Search query
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false); // Added state for modal visibility
  const [headerText, setHeaderText] = useState(formatDateOnly(new Date()));
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState();
  const [dateRange, setDateRange] = useState(getToday());
  // const [dateRange, setDateRange] = useState(getToday());
  const [mode, setMode] = useState('default')

  const [selectedKey, setSelectedKey] = useState(null); // State for selected driver

  const [login_user, setlogin_user] = useState();
  const updateData = data => {
    return data.map(item => {
      if (item.payment_type === 2 || item.payment_type === 3) {
        return {
          ...item,
          mode: 2, // Update mode to 2
        };
      }
      return item; // Return unchanged item if condition is not met
    });
  };
  const get_data = async () => {
    try {
      setIsLoading(true);
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      setlogin_user(parsedUser);
      if (!parsedUser?.payload?.driver_id) {
        console.error('Driver ID not found in user data');
        setIsLoading(false);
        return;
      }
      const {owner_type, partner_id, driver_id} = parsedUser.payload || {};

      const id = owner_type === 1 || owner_type === 2 ? partner_id : driver_id;
      const param = {
        [owner_type === 1 || owner_type === 2 ? 'partner_id' : 'driverId']: id,
        start_date: dateRange?.startDate,
        end_date: dateRange?.endDate,
      };
      const res = await hitGetTransactionListApi(param);
      setData(updateData(res?.data)); // Update state with the modified array
      setSelectedDriver({driver_id: res?.data[0]?.driver_id});
      setFilteredData(res?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };








  const handleSearch = text => {
    setSearchText(text);

    if (!text) {
      setFilteredData(data);
      return;
    }

    const lowercasedText = text.toLowerCase();
    const filtered = data.filter(item => {
      // Map payment_type to readable labels
      const paymentType =
        item?.payment_type == '1'
          ? 'Ride Booking'
          : item.payment_type == '3'
            ? 'Fund Withdraw'
            : item.payment_type == '2'
              ? 'Fund Deposit'
              : 'Unknown';

      const amount =
        item.payment_type == '1'
          ? parseFloat(item.amount).toFixed(2)
          : parseFloat(item.amount).toFixed(2);

      return (
        paymentType.toLowerCase().includes(lowercasedText) ||
        amount.includes(lowercasedText)
      );
    });

    setFilteredData(filtered);
  };
  const handleCalendar = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    get_data();
  }, [dateRange]);


  const handlePaymentModeFilter = (mode) => {
    if (mode === 'default') {
      setMode('default')

      setFilteredData(data);

    } else if (mode === '0') {
      setMode('0')

      const filtered = data?.filter(item => item.mode === 0);

      setFilteredData(filtered);

    } else if (mode === '1') {
      setMode('1')

      const filtered = data?.filter(item => item.mode === 1);
      setFilteredData(filtered);

    } else if (mode === '2') {
      setMode('2')

      const filtered = data?.filter(item => item.mode === 2);
      setFilteredData(filtered);

    }
    else if (mode === '3') {
      setMode('3')

      const filtered = data.filter(item => item.payment_type == 3);
      
      setFilteredData(filtered);

    }
  };


  const renderRieder = useMemo(() => {
    return ({ item }) => {
      return (
        <DriverDetails
          details={item}
          selectedDriver={selectedDriver}
          onPress={() => {
            handlePaymentModeFilter('default')
            setSelectedDriver(item);

          }}
        />
      );
    };
  }, [selectedDriver]);


  const uniqueDrivers = Array.from(
    new Map(data?.map(txn => [txn.driver_id, txn])).values(),
  );
  const filterData = (arr, id) => {
    return arr.filter(item => {
      return item?.driver_id == id;
    });
  };

  const driverList = uniqueDrivers.map(txn => ({
    driver_id: txn.driver_id,
    driver_name: txn.driver_name,
    profilePic: txn.profile_pic,
    vehicleName: txn?.vehicle_number,
    partner_id: txn?.partner_id,
  }));
  const handleSelectDateRange = rangeType => {
    switch (rangeType) {
      case 'today':
        setSelectedKey('today')
        setDateRange(getToday());


        setHeaderText(formatDateOnly(new Date()));

        break;
      case 'last7Days':

        setSelectedKey('last7Days')
        setHeaderText('last 07 Days');


        setDateRange(getLast7Days());
        break;
      case 'lastMonth':
        setSelectedKey('lastMonth')
        setHeaderText('last 30 Days');

        setDateRange(getLastMonth());
        break;
      case 'last3Months':
        setSelectedKey('last3Months')
        setHeaderText('last 90 Days');

        setDateRange(getLast3Months());
        break;
      default:
        break;
    }
  };
  console.log(filteredData,selectedDriver?.driver_id);
  
  
  return (
    <>
      <HeaderBackButton
        headerText="Transaction History"
        onPress={() => navigation.goBack()}
        rightButton={AppImages.calendarIcon}
        onButtonPress={handleCalendar}
        middleHeaderText={headerText ? headerText : 'All'}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.brandBlue} />
          </View>
        ) : (
          <>
            <View style={{ marginLeft: 20, marginTop: responsiveHeight(5) }}>
              {driverList?.length > 0 &&
                login_user?.payload?.owner_type !== 0 && (
                  <FlatList
                    data={driverList}
                    horizontal
                    renderItem={renderRieder}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
            </View>


            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: 'white',
                borderBottomWidth: 0.4,
                borderBottomColor: Colors.grey,
                // marginBottom:Spacing.small
              }}>
              <TouchableHighlight
                style={{
                  padding: 5,
                  marginVertical: responsiveHeight(1),
                  borderBottomColor: mode === 'default' ? Colors.brandBlue : 'transparent',
                  borderBottomWidth: mode === 'default' ? 1 : 0,
                }}
                onPress={() => handlePaymentModeFilter('default')}
                underlayColor={'none'}>
                <TransactionMode
                  // number={totalAmount}
                  number={
                    filterData(data, selectedDriver?.driver_id)
                      ?.filter(item => item.amount)
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                      .toFixed(2) || ' 0.00'
                  }
                  dataName={'All'}
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  padding: 5,
                  marginVertical: responsiveHeight(1),
                  borderBottomColor: mode === '0' ? Colors.brandBlue : 'transparent',
                  borderBottomWidth: mode === '0' ? 1 : 0,
                }} onPress={() => handlePaymentModeFilter('0')}
                underlayColor={'none'}>
                <TransactionMode
                  number={
                    filterData(data, selectedDriver?.driver_id)
                      ?.filter(item => item.mode == '0')
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                      .toFixed(2) || ' 0.00'
                  }
                  dataName={'Cash'}
                />
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  padding: 5,
                  marginVertical: responsiveHeight(1),
                  borderBottomColor: mode === '1' ? Colors.brandBlue : 'transparent',
                  borderBottomWidth: mode === '1' ? 1 : 0,
                }} onPress={() => handlePaymentModeFilter('1')}
                underlayColor={'none'}>
                <TransactionMode
                  number={
                    filterData(data, selectedDriver?.driver_id)
                      ?.filter(item => item.mode == '1')
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                      .toFixed(2) || ' 0.00'
                  }
                  dataName={'Online'}
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  padding: 5,
                  marginVertical: responsiveHeight(1),
                  borderBottomColor: mode === '2' ? Colors.brandBlue : 'transparent',
                  borderBottomWidth: mode === '2' ? 1 : 0,
                }}
                onPress={() => handlePaymentModeFilter('2')}
                underlayColor={'none'}>
                <TransactionMode
                  number={
                    filterData(data, selectedDriver?.driver_id)
                      ?.filter(item => item.mode == '2')
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                      .toFixed(2) || ' 0.00'
                  }
                  dataName={'Bank Transfer'}
                />
              </TouchableHighlight>
            </View>

            <FlatList
              data={filterData(filteredData, selectedDriver?.driver_id)}
              contentContainerStyle={{paddingBottom:responsiveHeight(40)}}

              renderItem={({ item }) => (
                <TouchableHighlight
                  style={styles.container}
                  underlayColor="none"
                  onPress={() => {
                    if (item?.payment_type === 1) {
                      navigation.navigate('orderinfo', {
                        id: item?.order_no,
                        prod_name: item?.type,
                      });
                    } else {
                      console.log('Navigation not allowed for this type');
                    }
                  }}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: responsiveWidth(10),
                      }}>
                      <View
                        style={{
                          backgroundColor: '#D8D9FF',
                          borderRadius: responsiveHeight(10),
                          marginRight: responsiveWidth(8),
                          padding: 5,
                        }}>
                        <Image
                          source={
                            item?.payment_type != 1
                              ? AppImages.transectionIcon
                              : AppImages.bike2
                          }
                          style={{
                            width: responsiveWidth(28),
                            height: responsiveHeight(28),
                          }}
                          resizeMode="contain"
                        />
                      </View>
                      <View>
                        <Text style={styles.title}>
                          {item?.payment_type == '1'
                            ? 'Ride Booking'
                            : item?.payment_type == '3'
                              ? 'Fund Withdraw'
                              : item?.payment_type == '2'
                                ? 'Fund Deposit'
                                : 'Unknown'}
                        </Text>

                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.date}>
                            {formatDate(item?.txn_date)}
                          </Text>
                          <Text style={styles.date}> | </Text>
                          <Text style={styles.date}>TXN-{item?.txn_no}</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        marginRight: responsiveWidth(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              item?.payment_type == 3 ? Colors.red : '#49B125',
                          },
                        ]}>
                        {item?.payment_type != 'Day Earning'
                          ? ' ₹ ' + parseFloat(item?.amount).toFixed(2)
                          : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          color: Colors.grey,
                          fontSize: responsiveHeight(12),
                        }}>
                        Success
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Image
                    source={AppImages.empty}
                    style={{
                      height: responsiveHeight(120),
                      width: responsiveWidth(120),
                    }}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>
                    No transaction record found
                  </Text>
                </View>
              )}
            />
          </>
        )}

        {/* <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('today');
                    setIsModalVisible(false);
                  }}>
                  <Image
                    source={AppImages.calendarIcon}
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('last7Days');
                    setIsModalVisible(false);
                  }}>
                  <Image
                    source={AppImages.calendarIcon}
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('lastMonth');
                    setIsModalVisible(false);
                  }}>
                  <Image
                    source={AppImages.calendarIcon}
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Last Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('last3Months');
                    setIsModalVisible(false);
                  }}>
                  <Image
                    source={AppImages.calendarIcon}
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalText}>Last 3 Months</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal> */}
        <DateRangeModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectDateRange={handleSelectDateRange}
          selectedKey={selectedKey} // Pass selectedKey if needed
        />
      </SafeAreaView>
      <View style={styles.bottomNavContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.leftText}>Total Earning</Text>
        </View>
        <View style={{}}>
          <View style={styles.separator} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.rightText}>
            {mode == "default" ? (
              <>
                ₹
                {(
                  filterData(data, selectedDriver?.driver_id)
                    ?.filter(item => item.amount)
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                    .toFixed(2) || '0.00'
                )}
              </>
            ) : (
              <>
                ₹
                {(
                  filterData(data, selectedDriver?.driver_id)
                    ?.filter(item => item.mode == mode)
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                    .toFixed(2) || '0.00'
                )}
              </>
            )}
          </Text>


        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    // margin: responsiveWidth(10),
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(10),
    backgroundColor: 'white',
  },
  searchInput: {
    height: responsiveHeight(40),
    fontSize: responsiveFontSize(14),
    color: Colors.black,
  },
  container: {
    height: responsiveHeight(65),
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(10),
    borderBottomWidth: 0.4,
    borderColor: Colors.grey,
  },
  title: {
    fontSize: responsiveFontSize(18),
    color: '#3D465A',
    fontWeight: Fonts.medium,
    fontFamily: Font.medium_txt,
  },
  text: {
    fontSize: responsiveFontSize(12),
    color: '#49B125',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: '50%',
  },
  emptyText: {
    fontSize: responsiveFontSize(16),
    color: Colors.grey,
    textAlign: 'center',
    paddingTop: 10,
  },
  date: {
    fontSize: responsiveFontSize(11),
    color: Colors.grey,
  },
  searchbarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    // height: responsiveHeight(42),
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(10),
    marginVertical: responsiveHeight(5),

    borderRadius: responsiveHeight(10),
    borderWidth: 1,
    borderColor: Colors.textInputBorderColor,
  },
  searchIconStyle: {
    height: responsiveHeight(20),
    width: responsiveWidth(20),
    marginLeft: 12,
  },
  TextInputStyle: {
    flex: 1,
    marginLeft: 12,
    color: Colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: responsiveHeight(10),
    padding: responsiveWidth(5),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  modalIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    marginRight: responsiveWidth(10),
  },
  modalText: {
    fontSize: responsiveFontSize(14),
    fontFamily: Fonts.medium,
    color: 'black',
  },
  bottomNavContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'aqua',
    bottom: responsiveHeight(0),
    paddingVertical: 10,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(15),
    backgroundColor: 'white',
  },
  leftText: {
    color: 'black',
    fontSize: responsiveFontSize(18),
  },
  rightText: {
    color: 'black',
    fontSize: responsiveFontSize(16),
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: 'grey',
    marginHorizontal: 10,
  },
});

export default TransactionHistory;
