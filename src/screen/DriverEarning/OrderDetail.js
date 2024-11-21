import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Line from '../../components/Line/Line';
import AppImages from '../../common/AppImages';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';

const OrderDetail = ({ orderDetails }) => {
  // console.log('anas---orderdetails===>>>>>>',orderDetails);
  
  const navigation = useNavigation()
  const props = {
    parsalNumber: 'ODR-123456',
    parsalStatusTextColor: 'rgba(69, 184, 69, 0.1)',
    parsalStatusText: 'Delivered',
    textColor: '#45B845',
    orderDetails: {
      orderId: 'ODR-123456',
      items: [
        {name: 'Laptop', quantity: 1},
        {name: 'Mobile Phone', quantity: 2},
      ],
      shippingDetails: {
        from: 'New York, NY',
        to: 'Los Angeles, CA',
        driverName: 'Your Name',
        vehicleNo: 'CA-5678-XZ',
        tripCost: '$120',
      },
    },
  };
console.log(orderDetails);
  return (
    <TouchableOpacity
      onPress={()=>navigation.navigate('orderinfo',{
        id:orderDetails?.order_id,
        prod_name:orderDetails?.package_name

      })}
    >
      <View style={[styles.container]}>
        <View style={[styles.section1]}>
          <View>
            <Text style={[styles.parsalNumber]}>
              {'#PAR-' + orderDetails?.order_id}
            </Text>
            <Text style={[styles.parsalName]}>{orderDetails.package_name}</Text>
          </View>
          <View
            style={[
              styles.parsalStatus,
              {
                backgroundColor: props.parsalStatusTextColor,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text style={[styles.parsalStatusText, { color: props.textColor }]}>
              ₹ {parseFloat(orderDetails?.paid_amount).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{}}>
          <Line marginH={0} />
        </View>
        <View style={[styles.section2]}>
          <View style={[styles.LocationMainContainer, {}]}>
            <View style={[styles.fromLocation]}>
              <Text style={[styles.citystart]}>
                {`${orderDetails?.pickup_address?.slice(0, 45)}...`}
              </Text>
            </View>

            <Image
              source={AppImages.rightarrow} 
              resizeMode="contain"
              style={styles.rightArrowStyle}
            />

            <View style={[styles.toLocation]}>
              <Text style={[styles.cityend]}>
                {`${orderDetails?.drop_address?.slice(0, 45)}...`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(16),
    borderRadius: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(12),
    marginVertical: responsiveHeight(5),
    paddingVertical: responsiveHeight(10),
  },
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(16),
    borderRadius: responsiveHeight(10),
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(12),
    marginVertical: responsiveHeight(8),
  },
  section1: {
    flex: 0.5,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  section2: {
    flex: 1,
  },
  parsalNumber: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: Colors.black,
  },
  parsalName: {
    fontSize: responsiveFontSize(10),
    fontWeight: '400',
    color: Colors.grey,
  },
  parsalStatus: {
    borderWidth: 1,
    borderColor: '#45B845',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(3),
    borderRadius: responsiveHeight(6),
  },
  parsalStatusText: {
    fontSize: responsiveFontSize(12),
    color: Colors.black,

    fontWeight: '400',
  },
  LocationMainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  UserDetailMainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(15),
    alignItems: 'center',
  },
  fromLocation: {
    alignItems: 'flex-start',
    flex: 1,
  },
  toLocation: {
    alignItems: 'flex-end',
    flex: 1,
  },
  citystart: {
    fontSize: responsiveFontSize(11),
    fontWeight: '500',
    color: Colors.black,
  },
  statestart: {
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    color: Colors.grey,
    marginTop: responsiveHeight(1),
  },
  rightArrowStyle: { 
    height: responsiveHeight(12),
    width: responsiveWidth(12),
    marginTop: responsiveHeight(5),
  },
  cityend: {
    fontSize: responsiveFontSize(11),
    fontWeight: '500',
    color: Colors.black,
  },
  stateend: {
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    color: Colors.grey,
    marginTop: responsiveHeight(1),
  },
  infoCircleStyle: {
    height: responsiveHeight(28),
    width: responsiveWidth(28),
  },
  manStyle: {
    height: responsiveHeight(35),
    width: responsiveWidth(35),
    borderRadius: 35,
  },
  userNameAddress: {
    marginLeft: responsiveWidth(10),
  },
  name: {
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    color: Colors.black,
  },
  address: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: Colors.grey,
    marginTop: responsiveHeight(2),
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
