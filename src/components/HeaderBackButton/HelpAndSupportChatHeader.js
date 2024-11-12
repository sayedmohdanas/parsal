import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';

const HelpAndSupportChatHeader = props => {
  return (
    <View
      style={{
        height: responsiveHeight(80), // Increase height to fit both texts
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 0.5,
      }}>
      
      {/* Back Button (Always aligned left) */}
      <TouchableOpacity onPress={props.onPress} style={{flexDirection: 'row', alignItems: 'center'}}>
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

      {/* Header Text (Fixed as "Help and Support" with Ticket ID below it) */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center', // Center vertically to accommodate both lines
          paddingHorizontal: responsiveWidth(10),
          marginLeft: responsiveWidth(10),
        }}>
        <Text
          style={{
            color: Colors.black,
            fontSize: responsiveFontSize(18),
            fontWeight: '500',
            textAlign: 'left',
          }}>
          Help and Support
        </Text>
        <Text
          style={{
            color: Colors.gray,
            fontSize: responsiveFontSize(14),
            textAlign: 'left',
            marginTop: responsiveHeight(2), // Small space between header and Ticket ID
          }}>
          Ticket ID: {props.ticketId}
        </Text>
      </View>

      {/* Right Button (optional) */}
      {props.rightButton && (
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
      )}
    </View>
  );
};

export default HelpAndSupportChatHeader;
