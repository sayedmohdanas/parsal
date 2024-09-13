import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ConfirmationButton = ({ onYesPress, onNoPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.noButton} onPress={onNoPress}>
        <Text style={styles.noText}>No</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.yesButton} onPress={onYesPress}>
        <Text style={styles.yesText}>Yes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  noButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3D40D1',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  yesButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#3D40D1',
    borderRadius: 5,
    alignItems: 'center',
  },
  noText: {
    fontSize: 16,
    color: '#000',
  },
  yesText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ConfirmationButton;
