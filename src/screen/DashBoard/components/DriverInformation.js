import React, { useState } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import AppImages from '../../../common/AppImages';
import {useSelector} from 'react-redux';
import {Fonts, FontSizes} from '../../../common/Theme';
const DriverInformation = ({
  selected_driver_data,
  display_name,
  display_phone,
  propStyle = {},
}) => {
  const defaultPropStyle = {
    manStyle: {
      width: responsiveWidth(40),
      height: responsiveWidth(40),
      borderRadius: responsiveWidth(6),
      marginRight: responsiveWidth(3),
    },
    userDetail: {
      paddingHorizontal: responsiveWidth(16),
    },
    name: {
      fontSize: responsiveFontSize(18),
    },
  };
  const appliedPropStyle = {...defaultPropStyle, ...propStyle};
  const makeCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const store_data = useSelector(state => state);
  const trip = {
    name: selected_driver_data?.driver
      ? selected_driver_data?.driver?.driver_name
      : store_data?.parsalPartner?.orderData?.custName ||
        store_data?.parsalPartner?.orderData?.customer?.cust_name,
    phoneNumber: selected_driver_data?.driver?.phone
      ? selected_driver_data?.driver?.phone
      : store_data?.parsalPartner?.orderData?.customer?.mobile,
  };
  return (
    <View style={[styles.userDetail, appliedPropStyle.userDetail]}>
      <View style={styles.profileContainer}>
        <Image
          source={AppImages.profileImage}
          style={appliedPropStyle.manStyle}
        />
        <View style={{marginLeft: responsiveHeight(4)}}>
          <Text style={[styles.name, appliedPropStyle.name]}>
            {display_name || trip?.name}
          </Text>
          <Text style={styles.subtitle}>
          {selected_driver_data?.m_good?.product_category}
           </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.callDetail}
        onPress={() => makeCall(display_phone || trip?.phoneNumber)}>
        <Image
          source={AppImages.callImage}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(5),
    marginTop: responsiveHeight(14),
  },
  profileContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: Fonts.semilarge,
    color: '#000000',
  },
  subtitle: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: '#888888',
  },
  phoneIcon: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(6),
    marginRight: responsiveWidth(-4),
    // marginLeft:responsiveWidth()

  },
  callDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default DriverInformation;
