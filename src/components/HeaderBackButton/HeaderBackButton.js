import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';

const HeaderBackButton = props => {
  return (
    <View
      style={{
        height: responsiveHeight(60),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBlockColor: '#D8D8D8',
        borderBottomWidth: 0.5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={{position:"absolute"}} onPress={props.onPress}>
          <Image
            source={AppImages.previous}
            resizeMode="contain"
            style={{
              height: responsiveHeight(28),
              width: responsiveWidth(28),
              marginLeft: responsiveWidth(10),
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors.black,
              fontSize: responsiveFontSize(18),
              fontWeight: '500',
              marginLeft: responsiveWidth(10),
            }}>
            {props.headerText}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={props.onButtonPress}>
        <Text
          style={{
            color: Colors.black,
            fontSize: responsiveFontSize(16),
            fontWeight: '500',
            marginRight: responsiveWidth(14),
          }}>
          {props.rightButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBackButton;

const styles = StyleSheet.create({});
