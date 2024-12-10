import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
const ProfileScreenOptions = props => {
  return (
    <TouchableHighlight onPress={props.onPress} underlayColor={'none'}
      //  disabled={!props.disabled}
      // accessibilityState={{ disabled: props.noLiveData }} // Communicates the disabled state for accessibility
      style={[ props.noLiveData && { opacity: 0.6 }]} // Visual feedback for disabled state

    >
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: responsiveHeight(27),
              width: responsiveHeight(27),
              borderRadius: responsiveHeight(27),
              backgroundColor: '#F5F5FD',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={props.Icon}
              style={styles.iconStyle}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.optionName}>{props.optionName}</Text>
        </View>
        <View>
          {props.walletBalance ? (
            <Text
              style={{
                fontSize: responsiveFontSize(16),
                color: 'black',
                fontWeight: '600',
                textAlign: 'right',
              }}>
              {'₹' + (props.walletBalance || 0) + ''}
            </Text>
          ) : (
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
          <Text style={[styles.optionName,{color:Colors.red,marginLeft:0,marginRight:responsiveWidth(10)}]}>{props.noLiveData}</Text>
          <Image
              source={AppImages.optionRightArrow}
              style={styles.iconStyle}
              resizeMode="contain"
            />
            </View>
          )}

        </View>
       
      </View>
    </TouchableHighlight>
  );
};
export default ProfileScreenOptions;
const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(52),
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconStyle: {
    height: responsiveHeight(17),
    width: responsiveWidth(17),
    tintColor: '#3D40D1',
  },
  optionName: {
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
    color: Colors.black,
    marginLeft: responsiveWidth(10),
  },
});
