import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';

const LedgerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ledger Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'

  },
});

export default LedgerScreen;
