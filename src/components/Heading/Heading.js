import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const Heading = ({ text, isRequired = false }) => {
  return (
    <View style={styles.headingContainer}>
      <Text style={styles.headinglabel}>
        {text}
      </Text>
      {isRequired && <Text style={styles.redAsterisk}>*</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row', 
    alignItems: 'baseline', 
  },
  headinglabel: {
    fontSize: 14,
    color: 'black',
    marginVertical: 14,
    fontWeight: '600',
  },
  redAsterisk: {
    color: 'red',
    fontSize: 8,
    transform: [{ translateY: -4 }],
    fontWeight: 'bold',
  },
});

export default Heading;
