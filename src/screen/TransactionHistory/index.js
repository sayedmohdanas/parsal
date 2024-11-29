// import React, { useEffect, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   View,
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
//   const [data, setdata] = useState([]);
//   // const get_data = async () => {
//   //   const user = await AsyncStorage.getItem('user');
//   //   const parsedUser = JSON.parse(user);
//   //   const param = {
//   //     driverId: parsedUser?.payload?.driver_id,
//   //   };
//   //   hitGetTransactionListApi(param)
//   //     .then(res => {
//   //       if (res?.transaction_data) {
//   //         console.log('data====>>>>>>>',res?.transaction_data);

//   //         setdata(res?.transaction_data);
//   //       }
//   //     })
//   //     .catch(err => {
//   //       console.error(err);
//   //     });
//   // };





//   const get_data = async () => {
//     try {
//       // Fetch user data from AsyncStorage
//       const user = await AsyncStorage.getItem('user');
//       const parsedUser = JSON.parse(user);

//       if (!parsedUser?.payload?.driver_id) {
//         console.error('Driver ID not found in user data');
//         return;
//       }

//       // Prepare parameters for API call
//       const param = {
//         driverId: parsedUser.payload.driver_id,
//       };

//       // Fetch transaction list
//       const res = await hitGetTransactionListApi(param);

//       if (res?.transaction_data) {
//         console.log('Original data====>>>>>>>', res.transaction_data);

//         // Map data to include 'type'
//         const updatedData = res.transaction_data.map(item => {
//           let type = null;

//           if (item.remark === 'Deposit' || item.remark === 'Withdraw') {
//             type = 'bank';
//           } else if (item.remark === 'Day Earning') {
//             type = 'ride';
//           }

//           return {
//             ...item,
//             type: item.type === null ? type : item.type, // Update only if type is null
//           };
//         });

//         console.log('Updated data====>>>>>>>', updatedData);

//         // Update state with modified data
//         setdata(updatedData);
//       } else {
//         console.log('No transaction data found.');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };




//   useEffect(() => {
//     get_data();
//   }, []);
//   return (
//     <>
//       <HeaderBackButton
//         headerText={'Transaction History'}
//         onPress={() => navigation.goBack('')}
//       />
//       <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
//         <FlatList
//           data={data}
//           renderItem={({ item }) => {
//             return (
//               <>
//                 <TouchableHighlight style={styles.container}
//                 underlayColor={'none'}
//                onPress={() => {
//                 if (item?.type === 'ride') {
//                   navigation.navigate('orderinfo', {
//                     id: 750,
//                     prod_name: item?.type, // Passing the type
//                   });
//                 } else {
//                   // Optionally, show an alert or do nothing
//                   console.log('Navigation not allowed for this type');
//                 }
//               }}
              
//                 >
//                   <View style={{ flex: 1, flexDirection: 'row' }}>
//                     <View
//                       style={{
//                         flex: 1,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         marginHorizontal: responsiveWidth(10),
//                       }}>
//                          <View style={{backgroundColor:'#D8D9FF',borderRadius:responsiveHeight(10),marginRight:responsiveWidth(8),padding:5}}>

//                       <Image
//                         source={item?.type === 'bank' ? AppImages.transectionIcon : AppImages.bike2}
//                         style={{
//                           width: responsiveWidth(28),
//                           height: responsiveHeight(28),
//                         }}
//                         resizeMode="contain"
//                       />
//                          </View>
//                       <View>
//                         <Text style={styles.title}>{item?.type}</Text>
//                         <View style={{ flexDirection: 'row' }}>
//                           <Text style={styles.date}>{formatDate(item?.datetime)}</Text>
//                           <Text style={styles.date}> | </Text>

//                           <Text style={styles.date}>TXN-{item?.id}</Text>

//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={{
//                         // flexDirection: 'row',
//                         marginRight: responsiveWidth(10),
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                         // marginBottom: responsiveHeight(10),
//                       }}>
//                       <Text
//                         style={[
//                           styles.text,
//                           {
//                             color:
//                               item?.remark == 'Withdraw'
//                                 ? Colors.red
//                                 : '#49B125',
//                           },
//                         ]}>
//                         {item?.remark != 'Day Earning'
//                           ? ' ₹ ' + parseFloat(item?.online).toFixed(2)
//                           : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
//                       </Text>
//                       {/* <Text
//                         style={[
//                           styles.text,
//                           {
//                             color:
//                               item?.remark == 'Withdraw'
//                                 ? Colors.grey
//                                 : '#49B125',
//                           },
//                         ]}>
//                         {item?.remark != 'Day Earning'
//                           ? 'Success'
//                           : 'failed'}
//                       </Text> */}
//                       <Text style={{color:Colors.grey,fontSize:responsiveHeight(12)}}>Success</Text>
//                     </View>
//                   </View>
//                 </TouchableHighlight>
//               </>
//             );
//           }}
//           ListEmptyComponent={() => (
//             <View style={styles.emptyContainer}>
//               <Image
//                 source={AppImages.empty}
//                 style={{
//                   height: responsiveHeight(120),
//                   width: responsiveWidth(120),
//                 }}
//                 resizeMode="contain"
//               />
//               <Text style={styles.emptyText}>No transaction record found</Text>
//             </View>
//           )}
//         />
//       </SafeAreaView>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     height: responsiveHeight(65),
//     // borderRadius: 10,
//     backgroundColor: Colors.white,
//     // elevation: 2,
//     // marginVertical: responsiveHeight(10),
//     marginHorizontal: responsiveWidth(6),
//     borderBottomWidth: 0.4,
//     borderBlockColor: Colors.grey
//   },
//   title: {
//     fontSize: responsiveFontSize(18),
//     color: '#3D465A',
//     fontWeight:Fonts.medium,
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
//     color: Colors.grey
//   }
// });
// export default TransactionHistory;

























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
//   const [data, setdata] = useState([]); // Original data
//   const [filteredData, setFilteredData] = useState([]); // Data displayed after filtering
//   const [searchText, setSearchText] = useState(''); // Search query

//   const get_data = async () => {
//     try {
//       const user = await AsyncStorage.getItem('user');
//       const parsedUser = JSON.parse(user);

//       if (!parsedUser?.payload?.driver_id) {
//         console.error('Driver ID not found in user data');
//         return;
//       }

//       const param = {
//         driverId: parsedUser.payload.driver_id,
//       };

//       const res = await hitGetTransactionListApi(param);

//       if (res?.transaction_data) {
//         const updatedData = res.transaction_data.map(item => {
//           let type = null;
//           if (item.remark === 'Deposit' || item.remark === 'Withdraw') {
//             type = 'bank';
//           } else if (item.remark === 'Day Earning') {
//             type = 'ride';
//           }
//           return {
//             ...item,
//             type: item.type === null ? type : item.type,
//           };
//         });
//         setdata(updatedData);
//         setFilteredData(updatedData); 
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchText(text);

//     if (!text) {
//       setFilteredData(data); 
//       return;
//     }

//     const lowercasedText = text.toLowerCase();
//     const filtered = data.filter(item => {
//       const amount =
//         item.remark === 'Day Earning'
//           ? parseFloat(item.day_earning).toFixed(2)
//           : parseFloat(item.online).toFixed(2);
//       return (
//         item.type?.toLowerCase().includes(lowercasedText) || 
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
//         headerText={'Transaction History'}
//         onPress={() => navigation.goBack('')}
//       />
//       <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>


//         <View style={styles.searchbarContainer}>
//             <Image
//               source={AppImages.searchIcon}
//               style={styles.searchIconStyle}
//               resizeMode="contain"
//             />
//             <TextInput
//             placeholder="Search by amount or type..."
//             placeholderTextColor={Colors.grey}
//               style={styles.TextInputStyle}
//               value={searchText}
//               onChangeText={handleSearch}

//             />
//           </View>


//         <FlatList
//           data={filteredData}
//           renderItem={({ item }) => (
//             <TouchableHighlight
//               style={styles.container}
//               underlayColor="none"
//               onPress={() => {
//                 if (item?.type === 'ride') {
//                   navigation.navigate('orderinfo', {
//                     id: 750,
//                     prod_name: item?.type,
//                   });
//                 } else {
//                   console.log('Navigation not allowed for this type');
//                 }
//               }}
//             >
//               <View style={{ flex: 1, flexDirection: 'row' }}>
//                 <View
//                   style={{
//                     flex: 1,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     marginHorizontal: responsiveWidth(10),
//                   }}
//                 >
//                   <View
//                     style={{
//                       backgroundColor: '#D8D9FF',
//                       borderRadius: responsiveHeight(10),
//                       marginRight: responsiveWidth(8),
//                       padding: 5,
//                     }}
//                   >
//                     <Image
//                       source={
//                         item?.type === 'bank'
//                           ? AppImages.transectionIcon
//                           : AppImages.bike2
//                       }
//                       style={{
//                         width: responsiveWidth(28),
//                         height: responsiveHeight(28),
//                       }}
//                       resizeMode="contain"
//                     />
//                   </View>
//                   <View>
//                     <Text style={styles.title}>{item?.type}</Text>
//                     <View style={{ flexDirection: 'row' }}>
//                       <Text style={styles.date}>
//                         {formatDate(item?.datetime)}
//                       </Text>
//                       <Text style={styles.date}> | </Text>
//                       <Text style={styles.date}>TXN-{item?.id}</Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     marginRight: responsiveWidth(10),
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <Text
//                     style={[
//                       styles.text,
//                       {
//                         color:
//                           item?.remark == 'Withdraw'
//                             ? Colors.red
//                             : '#49B125',
//                       },
//                     ]}
//                   >
//                     {item?.remark != 'Day Earning'
//                       ? ' ₹ ' + parseFloat(item?.online).toFixed(2)
//                       : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
//                   </Text>
//                   <Text
//                     style={{
//                       color: Colors.grey,
//                       fontSize: responsiveHeight(12),
//                     }}
//                   >
//                     Success
//                   </Text>
//                 </View>
//               </View>
//             </TouchableHighlight>
//           )}
//           ListEmptyComponent={() => (
//             <View style={styles.emptyContainer}>
//               <Image
//                 source={AppImages.empty}
//                 style={{
//                   height: responsiveHeight(120),
//                   width: responsiveWidth(120),
//                 }}
//                 resizeMode="contain"
//               />
//               <Text style={styles.emptyText}>
//                 No transaction record found
//               </Text>
//             </View>
//           )}
//         />
//       </SafeAreaView>
//     </>
//   );
// };






















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

      if (res?.transaction_data) {
        const updatedData = res.transaction_data.map((item) => {
          let type = null;
          if (item.remark === 'Deposit' || item.remark === 'Withdraw') {
            type = 'bank';
          } else if (item.remark === 'Day Earning') {
            type = 'ride';
          }
          return { ...item, type: item.type === null ? type : item.type };
        });
        setData(updatedData);
        setFilteredData(updatedData);
      }
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
      const amount =
        item.remark === 'Day Earning'
          ? parseFloat(item.day_earning).toFixed(2)
          : parseFloat(item.online).toFixed(2);
      return (
        item.type?.toLowerCase().includes(lowercasedText) || 
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

            {/* Transactions List */}
            <FlatList
              data={filteredData}
              renderItem={({ item }) => (
                <TouchableHighlight
                  style={styles.container}
                  underlayColor="none"
                  onPress={() => {
                    if (item?.type === 'ride') {
                      navigation.navigate('orderinfo', {
                        id: 750,
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
                            item?.type === 'bank'
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
                        <Text style={styles.title}>{item?.type}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.date}>
                            {formatDate(item?.datetime)}
                          </Text>
                          <Text style={styles.date}> | </Text>
                          <Text style={styles.date}>TXN-{item?.id}</Text>
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
                              item?.remark == 'Withdraw'
                                ? Colors.red
                                : '#49B125',
                          },
                        ]}
                      >
                        {item?.remark != 'Day Earning'
                          ? ' ₹ ' + parseFloat(item?.online).toFixed(2)
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
    backgroundColor:'white'
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
    marginBottom:responsiveHeight(5),

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








// import React, { useEffect, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableHighlight,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import RNHTMLtoPDF from 'react-native-html-to-pdf'; // For PDF generation
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
//       setIsLoading(true); // Start loading
//       const user = await AsyncStorage.getItem('user');
//       const parsedUser = JSON.parse(user);

//       if (!parsedUser?.payload?.driver_id) {
//         console.error('Driver ID not found in user data');
//         setIsLoading(false); // Stop loading
//         return;
//       }

//       const param = { driverId: parsedUser.payload.driver_id };
//       const res = await hitGetTransactionListApi(param);

//       if (res?.transaction_data) {
//         const updatedData = res.transaction_data.map((item) => {
//           let type = null;
//           if (item.remark === 'Deposit' || item.remark === 'Withdraw') {
//             type = 'bank';
//           } else if (item.remark === 'Day Earning') {
//             type = 'ride';
//           }
//           return { ...item, type: item.type === null ? type : item.type };
//         });
//         setData(updatedData);
//         setFilteredData(updatedData);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false); // Stop loading
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
//       const amount =
//         item.remark === 'Day Earning'
//           ? parseFloat(item.day_earning).toFixed(2)
//           : parseFloat(item.online).toFixed(2);
//       return (
//         item.type?.toLowerCase().includes(lowercasedText) ||
//         amount.includes(lowercasedText)
//       );
//     });

//     setFilteredData(filtered);
//   };

//   const generatePDF = async () => {
//     try {
//       const htmlContent = `
//         <html>
//           <head>
//             <style>
//               body { font-size: 14px; color: #000; }
//               table { width: 100%; border-collapse: collapse; }
//               th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//               th { background-color: #f4f4f4; }
//             </style>
//           </head>
//           <body>
//             <h2>Transaction History</h2>
//             <table>
//               <tr>
//                 <th>Type</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>ID</th>
//               </tr>
//               ${filteredData
//                 .map(
//                   (item) => `
//                   <tr>
//                     <td>${item.type}</td>
//                     <td>${item.remark === 'Day Earning' ? parseFloat(item.day_earning).toFixed(2) : parseFloat(item.online).toFixed(2)}</td>
//                     <td>${formatDate(item.datetime)}</td>
//                     <td>TXN-${item.id}</td>
//                   </tr>
//                 `
//                 )
//                 .join('')}
//             </table>
//           </body>
//         </html>
//       `;

//       const options = {
//         html: htmlContent,
//         fileName: 'TransactionHistory',
//         directory: 'Documents',
//       };

//       const file = await RNHTMLtoPDF.convert(options);
//       Alert.alert('Success', `PDF has been saved at: ${file.filePath}`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       Alert.alert('Error', 'Failed to generate PDF');
//     }
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

//             {/* Download PDF Button */}
//             <TouchableOpacity
//               style={styles.downloadButton}
//               onPress={generatePDF}
//             >
//               <Text style={styles.downloadButtonText}>Download PDF</Text>
//             </TouchableOpacity>

//             {/* Transactions List */}
//             <FlatList
//               data={filteredData}
//               renderItem={({ item }) => (
//                 <TouchableHighlight
//                   style={styles.container}
//                   underlayColor="none"
//                   onPress={() => {
//                     if (item?.type === 'ride') {
//                       navigation.navigate('orderinfo', {
//                         id: 750,
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
//                             item?.type === 'bank'
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
//                         <Text style={styles.title}>{item?.type}</Text>
//                         <View style={{ flexDirection: 'row' }}>
//                           <Text style={styles.date}>
//                             {formatDate(item?.datetime)}
//                           </Text>
//                           <Text style={styles.date}> | </Text>
//                           <Text style={styles.date}>TXN-{item?.id}</Text>
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
//                               item?.remark == 'Withdraw'
//                                 ? Colors.red
//                                 : '#49B125',
//                           },
//                         ]}
//                       >
//                         {item?.remark != 'Day Earning'
//                           ? ' ₹ ' + parseFloat(item?.online).toFixed(2)
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
//   // ... (existing styles)
//   downloadButton: {
//     marginHorizontal: responsiveWidth(5),
//     marginVertical: responsiveHeight(8),
//     backgroundColor: Colors.brandBlue,
//     padding: 12,
//     borderRadius: responsiveHeight(8),
//     alignItems: 'center',
//   },
//   downloadButtonText: {
//     color: Colors.white,
//     fontSize: responsiveFontSize(14),
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     // margin: responsiveWidth(10),
//     borderWidth: 1,
//     borderColor: Colors.grey,
//     borderRadius: responsiveHeight(10),
//     paddingHorizontal: responsiveWidth(10),
//     backgroundColor:'white'
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
//     marginBottom:responsiveHeight(5),

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
