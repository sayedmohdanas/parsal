import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';
import BottomNav from '../../../../../navigation/BottomNav';

const LoansScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Loans Screen</Text> */}
      <BottomNav  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.white
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'

  },
});

export default LoansScreen;
