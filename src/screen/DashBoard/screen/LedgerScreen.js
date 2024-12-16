import React, {useEffect, useState} from 'react';
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
import {hitGetgetLedger} from '../../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getLast3Months,
  getLast7Days,
  getLastMonth,
  getToday,
} from '../../../common/CommonFunction';
import DateRangeModal from '../components/SelectDateModal';

const LedgerScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [dateRange, setDateRange] = useState(getToday());
  const [loading, setLoading] = useState(false);

  const handleCalendar = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchLedger = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const param = {
      partner_id: parsedUser?.payload?.partner_id,
      // partner_id:86,
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

      setLedgerData({...response, drivers: updatedDrivers});
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
        setDateRange(getToday());
        break;
      case 'last7Days':
        setDateRange(getLast7Days());
        break;
      case 'lastMonth':
        setDateRange(getLastMonth());
        break;
      case 'last3Months':
        setDateRange(getLast3Months());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [dateRange]);

  const renderItem = ({item}) => {
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
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.date}>{item?.driver_name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {statusIcon ? (
              <Image source={statusIcon} style={styles.statusIcon} />
            ) : (
              <View
                style={[styles.greenCircle, {backgroundColor: statusColor}]}
              />
            )}
            <Text style={[styles.status, {color: statusColor, marginLeft: 8}]}>
              {statusText}
            </Text>
          </View>
        </View>
        <Text style={styles.amount}>
          {item.amount != null ? `₹${Number(item.amount).toFixed(2)}` : '₹0.00'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackButton
        headerText="Ledger"
        rightButton={AppImages.calendarIcon}
        onButtonPress={handleCalendar}
        onPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.leftText}>Total Earning</Text>
            </View>
            <View style={styles.separator} />
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.rightText}>
                {ledgerData?.total?.total_transactions != null
                  ? `₹${Number(ledgerData.total.total_transactions).toFixed(2)}`
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
    paddingHorizontal: responsiveWidth(10),
    backgroundColor: 'white',
    paddingVertical: 15,
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(8),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(10),
    borderBottomWidth: 0.4,
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: responsiveFontSize(14),
  },
  statusIcon: {
    width: responsiveWidth(12),
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  amount: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: 'black',
  },
  leftText: {
    color: 'black',
    fontSize: responsiveFontSize(22),
  },
  rightText: {
    color: 'black',
    fontSize: responsiveFontSize(22),
  },
  separator: {
    width: 1,
    backgroundColor: 'grey',
    marginHorizontal: responsiveWidth(10),
  },

  greenCircle: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    backgroundColor: Colors.bandBlue,
    borderRadius: responsiveHeight(20),
  },
});

export default LedgerScreen;
