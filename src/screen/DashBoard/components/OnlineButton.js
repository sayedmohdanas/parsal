import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OnlineButton = ({ toggleStatus }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.onlineButton} onPress={toggleStatus}>
        <Text style={styles.onlineButtonText}>{`GO ONLINE >>>`}</Text>
      </TouchableOpacity>
      <Text style={styles.readyText}>Ready to start earning</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 150, // Increase the height for the online container
    justifyContent: 'center',
    width:'100%',

  },
  readyText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  onlineButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 60,
    width:'80%',
    alignItems:'center',
    borderRadius: 5,
  },
  onlineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform:'capitalize'

  },
});

export default OnlineButton;
