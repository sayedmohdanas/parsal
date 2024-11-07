import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OfflineButton  = ({ toggleStatus }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.doneText}>Done for the day?</Text>
      <TouchableOpacity style={styles.offlineButton} onPress={toggleStatus}>
        <Text style={styles.offlineButtonText}>{`Go Offline >>>`}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 100, // Smaller height for the offline container
    justifyContent: 'center',
    width:'100%',
    
  },
  doneText: {
    color: '#000',
    marginBottom: 10,
    fontSize: 16,
  },
  offlineButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF7F7F',
    paddingVertical: 13,
    paddingHorizontal: 60,
    width:'80%',
    alignItems:'center',
    borderRadius: 5,
  },
  offlineButtonText: {
    color: '#FF7F7F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OfflineButton;
