// import React, { useEffect, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableHighlight,
//   View,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../common/metrices';
// import Colors from '../../common/Colors';
// import Font from '../../common/Font';
// import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
// import { useNavigation } from '@react-navigation/native';
// import { hitGetTransactionListApi } from '../../config/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AppImages from '../../common/AppImages';
// import { formatDate } from '../../common/CommonFunction';
// import { Fonts } from '../../common/Theme';

// const TransactionHistory = () => {
//   const navigation = useNavigation();
//   const [data, setData] = useState([]); // Original data
//   const [filteredData, setFilteredData] = useState([]); // Data displayed after filtering
//   const [searchText, setSearchText] = useState(''); // Search query
//   const [isLoading, setIsLoading] = useState(true); // Loading state

//   const get_data = async () => {
//     try {
//       setIsLoading(true);
//       const user = await AsyncStorage.getItem('user');
//       const parsedUser = JSON.parse(user);

//       if (!parsedUser?.payload?.driver_id) {
//         console.error('Driver ID not found in user data');
//         setIsLoading(false);
//         return;
//       }

//       const param = { driverId: parsedUser.payload.driver_id };
//       const res = await hitGetTransactionListApi(param);
//       console.log(res, 'res---history');

//       // if (res?.transaction_data) {
//       //   const updatedData = res?.transactions.map((item) => {
//       //     let type = null;
//       //     if (item.remark === 'Fund Deposit' || item.remark === 'Fund Withdraw') {
//       //       type = 'bank';
//       //     } else if (item.remark === 'Day Earning') {
//       //       type = 'ride';
//       //     }
//       //     return { ...item, type: item.type === null ? type : item.type };
//       //   });
//       setData(res?.data);
//       setFilteredData(res?.data);
//       // }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchText(text);

//     if (!text) {
//       setFilteredData(data);
//       return;
//     }

//     const lowercasedText = text.toLowerCase();
//     const filtered = data.filter((item) => {
//       // Map payment_type to readable labels
//       const paymentType =
//         item?.payment_type == "1"
//           ? "Ride Booking"
//           : item.payment_type == "3"
//             ? "Fund Withdraw"
//             : item.payment_type == "2"
//               ? "Fund Deposit"
//               : "Unknown";

//       const amount =
//         item.payment_type == "1"
//           ? parseFloat(item.amount).toFixed(2)
//           : parseFloat(item.amount).toFixed(2);

//       return (
//         paymentType.toLowerCase().includes(lowercasedText) ||
//         amount.includes(lowercasedText)
//       );
//     });

//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     get_data();
//   }, []);



//   return (
//     <>
//       <HeaderBackButton
//         headerText="Transaction History"
//         onPress={() => navigation.goBack()}
//       />
//       <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
//         {isLoading ? (
//           <View style={styles.center}>
//             <ActivityIndicator size="large" color={Colors.brandBlue} />
//           </View>
//         ) : (
//           <>
//             {/* Search Bar */}
//             <View style={styles.searchbarContainer}>
//               <Image
//                 source={AppImages.searchIcon}
//                 style={styles.searchIconStyle}
//                 resizeMode="contain"
//               />
//               <TextInput
//                 placeholder="Search by amount or type..."
//                 placeholderTextColor={Colors.grey}
//                 style={styles.TextInputStyle}
//                 value={searchText}
//                 onChangeText={handleSearch}
//               />
//             </View>
//             {/* <TouchableOpacity style={{ paddingHorizontal: responsiveWidth(9), alignItems: 'center', paddingVertical: responsiveHeight(8), backgroundColor: '#D8D9FF', alignSelf: 'flex-start', borderRadius: responsiveHeight(40), flexDirection: 'row', marginVertical: responsiveHeight(8) }}>
//               <Text style={{ fontSize: responsiveFontSize(12), fontWeight: '500', color: 'black' }}>Download Statement</Text>
//               <Image
//                 source={
//                   AppImages.downloadIcon
//                 }
//                 style={{
//                   width: responsiveWidth(12),
//                   height: responsiveHeight(12),
//                   marginLeft: responsiveWidth(5)
//                 }}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity> */}
//             {/* Transactions List */}
//             <FlatList
//               data={filteredData}
//               renderItem={({ item }) => (
//                 <TouchableHighlight
//                   style={styles.container}
//                   underlayColor="none"
//                   onPress={() => {
//                     if (item?.payment_type === 1) {
//                       navigation.navigate('orderinfo', {
//                         id: item?.order_no,
//                         prod_name: item?.type,
//                       });
//                     } else {
//                       console.log('Navigation not allowed for this type');
//                     }
//                   }}
//                 >
//                   <View style={{ flex: 1, flexDirection: 'row' }}>
//                     <View
//                       style={{
//                         flex: 1,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         marginHorizontal: responsiveWidth(10),
//                       }}
//                     >
//                       <View
//                         style={{
//                           backgroundColor: '#D8D9FF',
//                           borderRadius: responsiveHeight(10),
//                           marginRight: responsiveWidth(8),
//                           padding: 5,
//                         }}
//                       >
//                         <Image
//                           source={
//                             item?.payment_type != 1
//                               ? AppImages.transectionIcon
//                               : AppImages.bike2
//                           }
//                           style={{
//                             width: responsiveWidth(28),
//                             height: responsiveHeight(28),
//                           }}
//                           resizeMode="contain"
//                         />
//                       </View>
//                       <View>
//                         <Text style={styles.title}>
//                           {item?.payment_type == "1"
//                             ? "Ride Booking"
//                             : item?.payment_type == "3"
//                               ? "Fund Withdraw"
//                               : item?.payment_type == "2"
//                                 ? "Fund Deposit"
//                                 : "Unknown"}
//                         </Text>

//                         <View style={{ flexDirection: 'row' }}>
//                           <Text style={styles.date}>
//                             {formatDate(item?.txn_date)}
//                           </Text>
//                           <Text style={styles.date}> | </Text>
//                           <Text style={styles.date}>TXN-{item?.txn_no}</Text>
//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={{
//                         marginRight: responsiveWidth(10),
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <Text
//                         style={[
//                           styles.text,
//                           {
//                             color:
//                               item?.payment_type == 3
//                                 ? Colors.red
//                                 : '#49B125',
//                           },
//                         ]}
//                       >
//                         {item?.payment_type != 'Day Earning'
//                           ? ' ₹ ' + parseFloat(item?.amount).toFixed(2)
//                           : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
//                       </Text>
//                       <Text
//                         style={{
//                           color: Colors.grey,
//                           fontSize: responsiveHeight(12),
//                         }}
//                       >
//                         Success
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableHighlight>
//               )}
//               ListEmptyComponent={() => (
//                 <View style={styles.emptyContainer}>
//                   <Image
//                     source={AppImages.empty}
//                     style={{
//                       height: responsiveHeight(120),
//                       width: responsiveWidth(120),
//                     }}
//                     resizeMode="contain"
//                   />
//                   <Text style={styles.emptyText}>
//                     No transaction record found
//                   </Text>
//                 </View>
//               )}
//             />
//           </>
//         )}
//       </SafeAreaView>
//     </>
//   );
// };


// const styles = StyleSheet.create({
//   searchContainer: {
//     // margin: responsiveWidth(10),
//     borderWidth: 1,
//     borderColor: Colors.grey,
//     borderRadius: responsiveHeight(10),
//     paddingHorizontal: responsiveWidth(10),
//     backgroundColor: 'white'
//   },
//   searchInput: {
//     height: responsiveHeight(40),
//     fontSize: responsiveFontSize(14),
//     color: Colors.black,
//   },
//   container: {
//     height: responsiveHeight(65),
//     backgroundColor: Colors.white,
//     marginHorizontal: responsiveWidth(6),
//     borderBottomWidth: 0.4,
//     borderColor: Colors.grey,
//   },
//   title: {
//     fontSize: responsiveFontSize(18),
//     color: '#3D465A',
//     fontWeight: Fonts.medium,
//     fontFamily: Font.medium_txt,
//   },
//   text: {
//     fontSize: responsiveFontSize(12),
//     color: '#49B125',
//     fontWeight: '700',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: '50%',
//   },
//   emptyText: {
//     fontSize: responsiveFontSize(16),
//     color: Colors.grey,
//     textAlign: 'center',
//     paddingTop: 10,
//   },
//   date: {
//     fontSize: responsiveFontSize(11),
//     color: Colors.grey,
//   },
//   searchbarContainer: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     // height: responsiveHeight(42),
//     backgroundColor: Colors.white,
//     marginHorizontal: responsiveWidth(5),
//     marginBottom: responsiveHeight(5),

//     borderRadius: responsiveHeight(10),
//     borderWidth: 1,
//     borderColor: Colors.textInputBorderColor,
//   },
//   searchIconStyle: {
//     height: responsiveHeight(20),
//     width: responsiveWidth(20),
//     marginLeft: 12,
//   },
//   TextInputStyle: {
//     flex: 1,
//     marginLeft: 12,
//     color: Colors.black,
//   },
// });

// export default TransactionHistory;




























































import React, { useEffect, useState } from 'react';
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
import { hitGetTransactionListApi } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../common/AppImages';
import { formatDate } from '../../common/CommonFunction';
import { Fonts } from '../../common/Theme';

const TransactionHistory = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Original data
  const [filteredData, setFilteredData] = useState([]); // Data displayed after filtering
  const [searchText, setSearchText] = useState(''); // Search query
  const [isLoading, setIsLoading] = useState(true); // Loading state

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

      const param = { driverId: parsedUser.payload.driver_id };
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

  useEffect(() => {
    get_data();
  }, []);



  return (
    <>
      <HeaderBackButton
        headerText="Transaction History"
        onPress={() => navigation.goBack()}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.brandBlue} />
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchbarContainer}>
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
      </SafeAreaView>
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
    marginHorizontal: responsiveWidth(6),
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
    marginHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(5),

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
});

export default TransactionHistory;