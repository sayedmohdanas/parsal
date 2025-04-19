// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   Modal,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../common/metrices';
// import Colors from '../../../common/Colors';
// import HeaderBackButton from '../../../components/HeaderBackButton/HeaderBackButton';
// import AppImages from '../../../common/AppImages';
// import {hitGetgetLedger} from '../../../config/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   formatDateOnly,
//   getLast3Months,
//   getLast7Days,
//   getLastMonth,
//   getToday,
// } from '../../../common/CommonFunction';
// import DateRangeModal from '../components/SelectDateModal';
// import {getimage} from '../../../config/url';

// const LedgerScreen = ({navigation}) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [ledgerData, setLedgerData] = useState(null);
//   const [dateRange, setDateRange] = useState(getToday());
//   const [loading, setLoading] = useState(false);
//   const [selectedKey, setSelectedKey] = useState(null); 
//   const [headerText, setHeaderText] = useState(formatDateOnly(new Date()));



//   const handleCalendar = () => {
//     setIsModalVisible(!isModalVisible);
//   };

//   const fetchLedger = async () => {
//     setLoading(true);
//     const user = await AsyncStorage.getItem('user');
//     const parsedUser = JSON.parse(user);
//     const param = {
//       partner_id: parsedUser?.payload?.partner_id,
//       start_date: dateRange?.startDate,
//       end_date: dateRange?.endDate,
//     };

//     try {
//       const response = await hitGetgetLedger(param);
//       console.log('response', response);
//       setLedgerData(response);
//       const updatedDrivers = response?.drivers?.map(driver => ({
//         ...driver,
//         status: Math.floor(Math.random() * 4) + 1,
//       }));

//       setLedgerData({...response, drivers: updatedDrivers});
//       console.log('response', response);
//     } catch (error) {
//       console.log(error, 'error-from-ledger');
//       Alert.alert('Error', 'Failed to fetch ledger data.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSelectDateRange = rangeType => {
//     switch (rangeType) {
//       case 'today':
//         setSelectedKey('today')
//         setDateRange(getToday());
//         setHeaderText(formatDateOnly(new Date()));


//         break;
//       case 'last7Days':
//         setSelectedKey('last7Days')
//         setDateRange(getLast7Days());
//         setHeaderText('last 07 Days');

//         break;
//       case 'lastMonth':
//         setSelectedKey('lastMonth')
//         setDateRange(getLastMonth());
//         setHeaderText('last 30 Days');

//         break;
//       case 'last3Months':
//         setSelectedKey('last3Months')
//         setDateRange(getLast3Months());
//         setHeaderText('last 90 Days');

//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     fetchLedger();
//   }, [dateRange]);

//   const renderItem = ({item}) => {
//     let statusText = '';
//     let statusColor = '';
//     let statusIcon = null;

//     switch (item.status) {
//       case 1:
//         statusText = 'Online';
//         statusColor = 'green';
//         break;
//       case 2:
//         statusText = 'Offline';
//         statusColor = 'red';
//         break;
//       case 3:
//         statusText = 'Suspended';
//         statusColor = 'red';
//         statusIcon = AppImages.suspendedIcon;
//         break;
//       case 4:
//         statusText = 'On Trip';
//         statusColor = 'blue';
//         statusIcon = AppImages.bike2;
//         break;
//       default:
//         statusText = item.status ? 'Unknown' : null;
//         statusColor = item.status ? 'grey' : null;
//     }

//     return (
//       <View style={styles.itemContainer}>
//         <View
//           style={{
//             borderWidth: 0.4,
//             borderColor: Colors.grey,
//             borderRadius: responsiveHeight(20),
//             marginLeft: responsiveWidth(6),
//           }}>
//           <Image
//             source={{
//               uri: getimage(
//                 'partners_img/' +
//                   item?.partner_id +
//                   '/drivers/' +
//                   item?.driver_id +
//                   '_' +
//                   item?.profile_pic,
//               ),
//             }}
//             style={styles.manStyle}
//           />
//         </View>
//         <View style={{flex: 1, marginLeft: 10}}>
//           <Text style={styles.date}>{item?.driver_name}</Text>
//           <View style={{flexDirection: 'row', alignItems: 'center'}}>
//             <Text style={[styles.status, {color: Colors.grey}]}>
//               {item?.phone}
//             </Text>
//           </View>
//         </View>
//         <Text style={styles.amount}>
//           {item.amount != null ? `₹${Number(item.amount).toFixed(2)}` : '₹0.00'}
//         </Text>
//       </View>
//     );
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <HeaderBackButton
//         headerText="Ledger"
//         rightButton={AppImages.calendarIcon}
//         onButtonPress={handleCalendar}
//         onPress={() => navigation.goBack()}
//         middleHeaderText={headerText ? headerText : 'All'}

//       />

//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color={Colors.primary} />
//         </View>
//       ) : (
//         <>
//           <View style={styles.summaryContainer}>
//             <View style={{flex: 1}}>
//               <Text style={styles.leftText}>Total Earning</Text>
//             </View>
//             <View style={styles.separator} />
//             <View style={{flex: 1, alignItems: 'flex-end'}}>
//               <Text style={styles.rightText}>
//                 {ledgerData?.total?.total_amount != null
//                   ? `₹${Number(ledgerData.total.total_amount).toFixed(2)}`
//                   : '₹0.00'}
//               </Text>
//             </View>
//           </View>
//           <FlatList
//             data={ledgerData?.drivers}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderItem}
//             contentContainerStyle={styles.listContainer}
//           />
//         </>
//       )}

//       <DateRangeModal
//         isVisible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSelectDateRange={handleSelectDateRange}
//         selectedKey={selectedKey} // Pass selectedKey if needed
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.homeBackground,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   summaryContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: responsiveWidth(16),
//     backgroundColor: 'white',
//     paddingVertical: 15,
//     borderBottomWidth: responsiveWidth(0.2),
//     borderColor: Colors.grey,
//   },
//   listContainer: {
//     // paddingHorizontal: responsiveWidth(8),
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: responsiveWidth(10),
//     paddingVertical: responsiveHeight(20),
//     borderBottomWidth: 0.4,
//     borderColor: Colors.grey,
//   },
//   date: {
//     fontSize: responsiveFontSize(16),
//     color: Colors.black,
//   },
//   status: {
//     fontSize: responsiveFontSize(10),
//   },
//   statusIcon: {
//     width: responsiveWidth(12),
//     height: responsiveHeight(12),
//     resizeMode: 'contain',
//   },
//   amount: {
//     fontSize: responsiveFontSize(15),
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   leftText: {
//     color: Colors.black,
//     fontSize: responsiveFontSize(20),

//   },
//   rightText: {
//     color: Colors.black,
//     fontSize: responsiveFontSize(20),
//     fontWeight: '600',

//   },
//   separator: {
//     borderWidth: responsiveWidth(0.4),
//     borderColor: Colors.grey,
//     marginHorizontal: responsiveWidth(10),
//   },

//   greenCircle: {
//     height: responsiveHeight(10),
//     width: responsiveHeight(10),
//     backgroundColor: Colors.brandBlue,
//     borderRadius: responsiveHeight(20),
//   },

//   manStyle: {
//     height: responsiveHeight(40),
//     width: responsiveHeight(40),
//     borderWidth: 0.4,
//     borderColor: Colors.grey,
//     borderRadius: responsiveHeight(40),
//     // marginLeft: responsiveWidth(8),
//     resizeMode: 'contain',
//   },
// });

// export default LedgerScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import HeaderBackButton from '../../../components/HeaderBackButton/HeaderBackButton';
import AppImages from '../../../common/AppImages';
import { hitGetgetLedger } from '../../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatDateOnly,
  getLast3Months,
  getLast7Days,
  getLastMonth,
  getToday,
} from '../../../common/CommonFunction';
import DateRangeModal from '../components/SelectDateModal';
import { getimage } from '../../../config/url';
const LedgerScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [dateRange, setDateRange] = useState(getToday());
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [headerText, setHeaderText] = useState(formatDateOnly(new Date()));
  const handleCalendar = () => {
    setIsModalVisible(!isModalVisible);
  };
  const fetchLedger = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const param = {
      partner_id: parsedUser?.payload?.partner_id,
      start_date: dateRange?.startDate,
      end_date: dateRange?.endDate,
    };
    try {
      const response = await hitGetgetLedger(param);
      console.log('response', response);
      setLedgerData(response);
      const updatedDrivers = response?.drivers?.map(driver => ({
        ...driver,
        status: Math.floor(Math.random() * 4) + 1,
      }));
      setLedgerData({ ...response, drivers: updatedDrivers });
      console.log('response', response);
    } catch (error) {
      console.log(error, 'error-from-ledger');
      Alert.alert('Error', 'Failed to fetch ledger data.');
    } finally {
      setLoading(false);
    }
  };
  const handleSelectDateRange = rangeType => {
    switch (rangeType) {
      case 'today':
        setSelectedKey('today')
        setDateRange(getToday());
        setHeaderText(formatDateOnly(new Date()));
        break;
      case 'last7Days':
        setSelectedKey('last7Days')
        setDateRange(getLast7Days());
        setHeaderText('last 07 Days');
        break;
      case 'lastMonth':
        setSelectedKey('lastMonth')
        setDateRange(getLastMonth());
        setHeaderText('last 30 Days');
        break;
      case 'last3Months':
        setSelectedKey('last3Months')
        setDateRange(getLast3Months());
        setHeaderText('last 90 Days');
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    fetchLedger();
  }, [dateRange]);
  const renderItem = ({ item }) => {
    let statusText = '';
    let statusColor = '';
    let statusIcon = null;
    switch (item.status) {
      case 1:
        statusText = 'Online';
        statusColor = 'green';
        break;
      case 2:
        statusText = 'Offline';
        statusColor = 'red';
        break;
      case 3:
        statusText = 'Suspended';
        statusColor = 'red';
        statusIcon = AppImages.suspendedIcon;
        break;
      case 4:
        statusText = 'On Trip';
        statusColor = 'blue';
        statusIcon = AppImages.bike2;
        break;
      default:
        statusText = item.status ? 'Unknown' : null;
        statusColor = item.status ? 'grey' : null;
    }
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('LedgerDetail', {
        driver_id: item?.driver_id,
        driver_name: item?.driver_name,
        date:dateRange
      })}>
        <View
          style={{
            borderWidth: 0.4,
            borderColor: Colors.grey,
            borderRadius: responsiveHeight(20),
            marginLeft: responsiveWidth(6),
          }}>
          <Image
            source={{
              uri: getimage(
                'partners_img/' +
                item?.partner_id +
                '/drivers/' +
                item?.driver_id +
                '_' +
                item?.profile_pic,
              ),
            }}
            style={styles.manStyle}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.date}>{item?.driver_name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.status, { color: Colors.grey }]}>
              {item?.phone}
            </Text>
          </View>
        </View>
        <Text style={styles.amount}>
          {item.amount != null ? `₹${Number(item.amount).toFixed(2)}` : '₹0.00'}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackButton
        headerText="Ledger"
        rightButton={AppImages.calendarIcon}
        onButtonPress={handleCalendar}
        onPress={() => navigation.goBack()}
        middleHeaderText={headerText ? headerText : 'All'}
      />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.leftText}>Total Earning</Text>
            </View>
            <View style={styles.separator} />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.rightText}>
                {ledgerData?.total?.total_amount != null
                  ? `₹${Number(ledgerData.total.total_amount).toFixed(2)}`
                  : '₹0.00'}
              </Text>
            </View>
          </View>
          <FlatList
            data={ledgerData?.drivers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
      <DateRangeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectDateRange={handleSelectDateRange}
        selectedKey={selectedKey} // Pass selectedKey if needed
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(16),
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: responsiveWidth(0.2),
    borderColor: Colors.grey,
  },
  listContainer: {
    // paddingHorizontal: responsiveWidth(8),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(20),
    borderBottomWidth: 0.4,
    borderColor: Colors.grey,
  },
  date: {
    fontSize: responsiveFontSize(16),
    color: Colors.black,
  },
  status: {
    fontSize: responsiveFontSize(10),
  },
  statusIcon: {
    width: responsiveWidth(12),
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  amount: {
    fontSize: responsiveFontSize(15),
    fontWeight: '600',
    color: Colors.black,
  },
  leftText: {
    color: Colors.black,
    fontSize: responsiveFontSize(20),
  },
  rightText: {
    color: Colors.black,
    fontSize: responsiveFontSize(20),
    fontWeight: '600',
  },
  separator: {
    borderWidth: responsiveWidth(0.4),
    borderColor: Colors.grey,
    marginHorizontal: responsiveWidth(10),
  },
  greenCircle: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    backgroundColor: Colors.brandBlue,
    borderRadius: responsiveHeight(20),
  },
  manStyle: {
    height: responsiveHeight(40),
    width: responsiveHeight(40),
    borderWidth: 0.4,
    borderColor: Colors.grey,
    borderRadius: responsiveHeight(40),
    // marginLeft: responsiveWidth(8),
    resizeMode: 'contain',
  },
});
export default LedgerScreen;