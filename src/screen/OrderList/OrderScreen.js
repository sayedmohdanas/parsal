import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import {OrderButton} from '../../common/Constant';
import OrderDetail from './Component/OrderDetail';
import {useDispatch} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {mystyles} from '../../common/Mystyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../../navigation/BottomNav';
import {hitOrderListApi} from '../../config/api/api';
import {formatDate} from '../../common/CommonFunction';
import CustomHeader from '../DashBoard/components/CustomHeader';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const OrderScreen = () => {
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setorders] = useState([]);
  const [loader, setloader] = useState(false);
  const fetchData = async () => {
    setloader(true);
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);
    const request = {
      id:
        parsed_user?.payload?.owner_type != 1
          ? parsed_user?.payload?.driver_id
          : '0',
      type: 1,
    };
    hitOrderListApi(request)
      .then(res => {
        setorders(res?.data);
        setloader(false);
      })
      .catch(err => {
        setloader(false);
      })
      .finally(() => {
        setloader(false);
      });
  };

  useEffect(() => {
    if (focus) {
      fetchData();
    }
  }, [focus, dispatch, navigation]);

  const filter_data = data => {
    let filtered = data;

    // Filter by order status based on the active button
    if (activeButton === 'Pending') {
      filtered = filtered.filter(order => order.order_status === 0);
    } else if (activeButton === 'Delivered') {
      filtered = filtered.filter(order => order.order_status === 3);
    } else if (activeButton === 'Cancelled') {
      filtered = filtered.filter(order => order.order_status === 5);
    }

    // Filter based on search query (matches parcel number, parcel name, pickup address, or drop address)
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        order =>
          order.id.toString().includes(searchQuery) ||
          (order.m_good?.product_category || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (order.pickup_address || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (order.drop_address || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const handleButtonPress = item => {
    setActiveButton(item);
  };
  // Render each order item
  const renderOrderItem = useMemo(
    () =>
      ({item}) => {
        const orderStatusText =
          item.order_status === 0
            ? 'Pending'
            : item.order_status === 5
            ? 'Cancelled'
            : 'Delivered';

        const orderStatusTextColor =
          item.order_status === 0
            ? '#E5E8F6'
            : item.order_status === 5
            ? '#F6E5E5'
            : '#E5F6E6';

        const textColor =
          item.order_status === 0
            ? '#40437D'
            : item.order_status === 5
            ? '#7D4040'
            : '#567D40';

        return (
          <OrderDetail
            key={item.id}
            parsalNumber={`#${item.id}`}
            parsalName={item.m_good?.product_category}
            parsalStatusText={orderStatusText}
            parsalStatusTextColor={orderStatusTextColor}
            textColor={textColor}
            citystart={item.pickup_address}
            statestart={'State Name'}
            cityend={item.drop_address}
            stateend={'State Name'}
            name={item.driver?.driver_name}
            address={'Driver Address'} 
            tripCost={parseFloat(item?.paid_amount || 0).toFixed(2)}
            partnerId={item.driver?.partner_id}
            driverId={item.driver_id}
            profilePic={item.driver?.profile_pic}
            vNo={item.driver?.m_vehicle?.vehicle_number}
            orderDate={formatDate(item?.order_date)}
            orderDetails={item}
          />
        );
      },
    [filteredOrders, activeButton, searchQuery], // Dependencies could include `items` or relevant props passed to `renderOrderItem`
  );

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.homeBackground}}>
        <View
          style={{
            height: responsiveHeight(60),
            marginBottom: responsiveHeight(10),
          }}>
          <CustomHeader  screenName={"Orders"} showSplash={true} />
        </View>
        <View style={{flex: 1, backgroundColor: Colors.homeBackground}}>
          {/* <View style={{margin: 17}}>
            <Text style={styles.orderTextStyle}>{'Orders'}</Text>
          </View> */}

          {/* Search bar */}
          <View style={styles.searchbarContainer}>
            <Image
              source={AppImages.searchIcon}
              style={styles.searchIconStyle}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Enter your Parcel tracker number"
              placeholderTextColor={Colors.buttonGrey}
              style={styles.TextInputStyle}
              value={searchQuery}
              onChangeText={que => {
                setSearchQuery(que);
              }}
            />
          </View>

          {/* Order buttons */}
          <View
            style={{
              margin: 20,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {OrderButton.map((item, index) => (
                <TouchableHighlight
                  key={index}
                  style={[
                    styles.buttonStyle,
                    activeButton === item && styles.activeButtonStyle,
                  ]}
                  onPress={() => handleButtonPress(item)}
                  underlayColor={'none'}>
                  <Text
                    style={[
                      styles.buttonText,
                      activeButton === item && styles.activeText,
                    ]}>
                    {item}
                  </Text>
                </TouchableHighlight>
              ))}
            </ScrollView>
          </View>

          {/* Display loading, error, or filtered orders */}
          {loader ? (
            <View style={mystyles.center}>
              <ActivityIndicator size="large" color={Colors.brandBlue} />
            </View>
          ) : (
            <FlatList
              data={filter_data(orders)}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={renderOrderItem}
              ListEmptyComponent={() => (
                <SafeAreaView
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30%',
                  }}>
                  <View
                    style={{flex: 1, backgroundColor: Colors.homeBackground}}>
                    <View style={[{flex: 1}, mystyles.center]}>
                      <ImageBackground
                        source={AppImages.boxbackgound}
                        style={styles.boxBackstyle}>
                        <Image
                          source={AppImages.emptyImage}
                          style={styles.emptyboxStyle}
                          resizeMode="contain"
                        />
                      </ImageBackground>
                      <Text style={[styles.emptyTextStyle, {marginTop: 10}]}>
                        {'Order history limited to last 2 years'}
                      </Text>
                      <Text style={styles.emptyTextStyle}>
                        {'For older orders, contact our support team.'}
                      </Text>
                    </View>
                  </View>
                </SafeAreaView>
              )}
            />
          )}
        </View>

        {/* Bottom Navigation */}
        <View
          style={{
            marginBottom: 29,
            backgroundColor: 'transparent',
            backfaceVisibility: 'hidden',
            marginTop: 10,
          }}>
          <BottomNav order={true} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  orderTextStyle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: Colors.black,
  },
  searchIconStyle: {
    height: responsiveHeight(20),
    width: responsiveWidth(20),
    marginLeft: 12,
  },
  searchbarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: responsiveHeight(42),
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(16),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textInputBorderColor,
  },
  TextInputStyle: {
    flex: 1,
    marginLeft: 12,
    color: Colors.black,
  },
  buttonStyle: {
    height: responsiveHeight(36),
    borderWidth: 1,
    borderRadius: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(16),
    marginRight: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.textInputBorderColor,
    backgroundColor: Colors.white,
  },
  activeButtonStyle: {
    backgroundColor: Colors.brandBlue,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.grey,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.white,
  },
  orderTextStyle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: Colors.black,
  },
  emptyboxStyle: {
    height: responsiveHeight(169),
    width: responsiveWidth(169),
  },
  boxBackstyle: {
    height: responsiveHeight(133),
    width: responsiveWidth(277),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    fontSize: responsiveFontSize(13),
    fontWeight: '400',
    color: Colors.grey,
  },
});
