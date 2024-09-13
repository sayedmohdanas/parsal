import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../common/Colors';

const SubmitCard = ({ onPress, isEnabled }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isEnabled ? Colors.brandBlue : '#d3d3d3' }]}
        onPress={onPress}
        disabled={!isEnabled}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    right: 1,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
     borderTopColor: Colors.textInputBorderColor,
     borderTopWidth:2,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SubmitCard;
