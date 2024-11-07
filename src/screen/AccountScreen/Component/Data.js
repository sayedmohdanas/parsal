import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveFontSize} from '../../../common/metrices';
import Colors from '../../../common/Colors';

const Data = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{props.number}</Text>
      <Text style={styles.dataName}>{props.dataName}</Text>
    </View>
  );
};

export default Data;

const styles = StyleSheet.create({
  number: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  dataName: {
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
    color: Colors.grey,
    textAlign: 'center',

    // marginTop:1
  },
});
