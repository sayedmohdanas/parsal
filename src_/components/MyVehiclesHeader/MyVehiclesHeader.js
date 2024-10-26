import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../common/Colors';

const MyVehiclesHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Vehicles</Text>
      
      <TouchableOpacity onPress={() => console.log('Notification Pressed')} style={styles.iconContainer}>
        <Image
          source={require('../../assets/images/notification.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    borderBottomWidth:0.5,
    borderBottomColor:Colors.grey
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  iconContainer: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default MyVehiclesHeader;
