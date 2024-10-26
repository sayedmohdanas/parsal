import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import Font from '../../common/Font';
const TransactionHistory = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        {/* <TouchableHighlight style={styles.container}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: responsiveWidth(10),
              }}>
              <Text style={styles.title}>{'Education Dono for children'}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: responsiveWidth(10),
                alignItems: 'flex-end',
                marginBottom: responsiveHeight(10),
              }}>
              <Text style={styles.text}>{'$1000.00'}</Text>
            </View>
          </View>
        </TouchableHighlight> */}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(73),
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    marginVertical: responsiveHeight(10),
    marginHorizontal: responsiveWidth(10),
  },
  title: {
    fontSize: responsiveFontSize(16),
    color: '#3D465A',
    fontFamily: Font.medium_txt,
  },
  text: {
    fontSize: responsiveFontSize(12),
    color: '#49B125',
    fontWeight:"700"
  },
});
export default TransactionHistory;