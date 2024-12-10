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
import { hitGetPartnerDriverApi, hitGetTransactionListApi } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../common/AppImages';
import { formatDate } from '../../common/CommonFunction';
import { Fonts, FontSizes } from '../../common/Theme';
import Data from '../AccountScreen/Component/Data';
import TransactionMode from './TransactionMode';
import DriverDetails from '../DriverEarning/DriversDetail';

const TransactionHistory = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Original data
  const [filteredData, setFilteredData] = useState([]); // Data displayed after filtering
  const [searchText, setSearchText] = useState(''); // Search query
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false); // Added state for modal visibility
  const [headerText, setHeaderText] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [partner_riders, setpartner_riders] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState();


  const calculateTotalAmount = (filteredData) => {
    let total = 0;
    filteredData?.forEach((item) => {
      if (item.mode == "0" || item.mode == "1" || item.mode == "2") {
        total += parseFloat(item.amount);
      }
    });
    setTotalAmount(total.toFixed(2)); // Update the total amount state
  };


  const [filter, setFilter] = useState("all");
  // const today = new Date();
  // const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // const sevenDaysAgo = new Date();
  // sevenDaysAgo.setDate(today.getDate() - 7);

  // const filteredTransactions =
  //   filter === "today"
  //     ? transactions.filter((txn) => new Date(txn.txn_date) >= startOfToday)
  //     : filter === "last7Days"
  //       ? transactions.filter((txn) => {
  //         const txnDate = new Date(txn.txn_date);
  //         return txnDate >= sevenDaysAgo && txnDate <= today;
  //       })
  //       : transactions;
  // Current date
  // const today = new Date();
  // today.setHours(0, 0, 0, 0); // Reset to start of the day

  // // Start of today
  // const startOfToday = new Date(today);

  // // 7 days ago
  // const sevenDaysAgo = new Date(today);
  // sevenDaysAgo.setDate(today.getDate() - 6); 

  // // Start of the current month
  // const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // // Start of the last month
  // const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  // // End of the last month
  // const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month

  // // Start of three months ago
  // const startOfThreeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);

  // // End of the three-month period (last day of the previous month)
  // const endOfThreeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 0);


  const get_data = async () => {
    try {
      setIsLoading(true);
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      if (!parsedUser?.payload?.driver_id) {
        console.error('Driver ID not found in user data');
        setIsLoading(false);
        return;
      }
      const { owner_type, partner_id, driver_id } = parsedUser.payload || {};

      const id = (owner_type === 1 || owner_type === 2) ? partner_id : driver_id;
      const param = { driverId:id };
      const res = await hitGetTransactionListApi(param);
      console.log(res, 'res---history');

      // if (res?.transaction_data) {
      //   const updatedData = res?.transactions.map((item) => {
      //     let type = null;
      //     if (item.remark === 'Fund Deposit' || item.remark === 'Fund Withdraw') {
      //       type = 'bank';
      //     } else if (item.remark === 'Day Earning') {
      //       type = 'ride';
      //     }
      //     return { ...item, type: item.type === null ? type : item.type };
      //   });
      setData(res?.data);
      setFilteredData(res?.data);
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDriver = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    if (parsedUser?.payload?.owner_type != 0) {
      const param = {
        // partnerId: parsedUser?.payload?.partner_id,
        partner_id: parsedUser?.payload?.partner_id,
      };
      try {
        const response = await hitGetPartnerDriverApi(param)
        setpartner_riders(response?.data)
        console.log(response?.data)
      } catch (error) {

      }
    }
  }
  const handleSearch = (text) => {
    setSearchText(text);

    if (!text) {
      setFilteredData(data);
      return;
    }

    const lowercasedText = text.toLowerCase();
    const filtered = data.filter((item) => {
      // Map payment_type to readable labels
      const paymentType =
        item?.payment_type == "1"
          ? "Ride Booking"
          : item.payment_type == "3"
            ? "Fund Withdraw"
            : item.payment_type == "2"
              ? "Fund Deposit"
              : "Unknown";

      const amount =
        item.payment_type == "1"
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
    // Toggle modal visibility
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    get_data();
    fetchDriver()
  }, []);

  const applyFilter = (filterType) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayFormatted = today.toLocaleDateString();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const startOfThreeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);

    let filtered = data;
    let headerText = '';
    if (filterType === 'today') {
      filtered = data?.filter((txn) => {
        const txnDate = new Date(txn.txn_date);
        return txnDate >= startOfToday && txnDate <= today;
      });
      headerText = todayFormatted;
    } else if (filterType === 'last7Days') {
      filtered = data?.filter((txn) => {
        const txnDate = new Date(txn.txn_date);
        return txnDate >= sevenDaysAgo && txnDate <= today;
      });
      headerText = 'Last 7 Days';
    } else if (filterType === 'lastMonth') {
      filtered = data?.filter((txn) => {
        const txnDate = new Date(txn.txn_date);
        return txnDate >= startOfLastMonth && txnDate <= endOfLastMonth;
      });
      headerText = 'Last Month';
    } else if (filterType === 'last3Months') {
      filtered = data?.filter((txn) => {
        const txnDate = new Date(txn.txn_date);
        return txnDate >= startOfThreeMonthsAgo && txnDate <= today;
      });
      headerText = 'Last 3 Months';
    }

    setHeaderText(headerText);
    setFilteredData(filtered);
    calculateTotalAmount(filtered);

    setFilter(filterType);
    setIsModalVisible(false);
  };

  const handlePaymentModeFilter = (mode) => {

    if (mode == 'default') {

      setFilteredData(data)
    } else if (mode == '0') {
      const filterd = data?.filter(item => item.mode == '0')
      setFilteredData(filterd)
    } else if (mode == '1') {

      const filterd = data?.filter(item => item.mode == '1')
      setFilteredData(filterd)
    } else if (mode == '2') {
      const filterd = data?.filter(item => item.mode == '2')
      setFilteredData(filterd)
    }

  }
  const renderRieder = useMemo(() => {
    return ({ item }) => {
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
  }, []);


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

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white' }}>
              <TouchableHighlight style={{ padding: 5, marginVertical: responsiveHeight(8) }}
                onPress={() => handlePaymentModeFilter('default')}
                underlayColor={'none'}
              >
                <TransactionMode
                  // number={totalAmount}
                  number={filteredData?.filter(item => item.amount).reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2) || ' 0.00'}

                  dataName={'All'}
                />

              </TouchableHighlight>
              <TouchableHighlight style={{ padding: 5, marginVertical: responsiveHeight(8) }}
                onPress={() => handlePaymentModeFilter('0')}
                underlayColor={'none'}
              >
                <TransactionMode
                  number={filteredData?.filter(item => item.mode == "0").reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2) || ' 0.00'}
                  dataName={'Cash'}

                />

              </TouchableHighlight>


              <TouchableHighlight style={{ padding: 5, marginVertical: responsiveHeight(8) }}
                onPress={() => handlePaymentModeFilter('1')}
                underlayColor={'none'}
              >


                <TransactionMode
                  number={
                    filteredData?.filter(item => item.mode == "1").reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2)
                    || ' 0.00'

                  }
                  dataName={'Online'}
                />

              </TouchableHighlight>
              <TouchableHighlight style={{ padding: 5, marginVertical: responsiveHeight(8) }}
                onPress={() => handlePaymentModeFilter('2')}
                underlayColor={'none'}
              >
                <TransactionMode
                  number={

                    filteredData?.filter(item => item.mode == "2").reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2)

                    || ' 0.00'
                  }
                  dataName={'Bank Transfer'}
                />
              </TouchableHighlight>


            </View>
            {/* Search Bar */}
            {/* <View style={styles.searchbarContainer}>
              <Image
                source={AppImages.searchIcon}
                style={styles.searchIconStyle}
                resizeMode="contain"
              />
              <TextInput
                placeholder="Search by amount or type..."
                placeholderTextColor={Colors.grey}
                style={styles.TextInputStyle}
                value={searchText}
                onChangeText={handleSearch}
              />
            </View> */}
            <View style={{ marginLeft: 20, marginTop: responsiveHeight(5) }}>
              {partner_riders?.length > 1 && (
                <FlatList
                  data={partner_riders}
                  horizontal
                  renderItem={renderRieder}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
            {/* <TouchableOpacity style={{ paddingHorizontal: responsiveWidth(9), alignItems: 'center', paddingVertical: responsiveHeight(8), backgroundColor: '#D8D9FF', alignSelf: 'flex-start', borderRadius: responsiveHeight(40), flexDirection: 'row', marginVertical: responsiveHeight(8) }}>
              <Text style={{ fontSize: responsiveFontSize(12), fontWeight: '500', color: 'black' }}>Download Statement</Text>
              <Image
                source={
                  AppImages.downloadIcon
                }
                style={{
                  width: responsiveWidth(12),
                  height: responsiveHeight(12),
                  marginLeft: responsiveWidth(5)
                }}
                resizeMode="contain"
              />
            </TouchableOpacity> */}
            {/* Transactions List */}
            <FlatList
              data={filteredData}
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
                  }}
                >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: responsiveWidth(10),
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#D8D9FF',
                          borderRadius: responsiveHeight(10),
                          marginRight: responsiveWidth(8),
                          padding: 5,
                        }}
                      >
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
                          {item?.payment_type == "1"
                            ? "Ride Booking"
                            : item?.payment_type == "3"
                              ? "Fund Withdraw"
                              : item?.payment_type == "2"
                                ? "Fund Deposit"
                                : "Unknown"}
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
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              item?.payment_type == 3
                                ? Colors.red
                                : '#49B125',
                          },
                        ]}
                      >
                        {item?.payment_type != 'Day Earning'
                          ? ' ₹ ' + parseFloat(item?.amount).toFixed(2)
                          : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          color: Colors.grey,
                          fontSize: responsiveHeight(12),
                        }}
                      >
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

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('today');
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('last7Days');
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter("lastMonth");
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter("last3Months");
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last 3 Months</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>


      </SafeAreaView>
      <View style={styles.bottomNavContainer}>
        <View style={{ flex: 1 }}>

          <Text style={styles.leftText}>Total Earning</Text>
        </View>
        <View style={{}}>

          <View style={styles.separator} />

        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', }}>

          <Text style={styles.rightText}>

          ₹{filteredData?.filter(item => item.amount).reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2)|| ' 0.00'}

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
    backgroundColor: 'white'
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
    color: 'black'
  },
  bottomNavContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'aqua',
    bottom: responsiveHeight(5),
    paddingVertical: 10,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(15),
    backgroundColor: 'white'
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