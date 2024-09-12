import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../../common/Colors';
import { useNavigation } from '@react-navigation/native';

const VehicleProfileCard = ({screen=false}) => {
  const navigation = useNavigation();

  const formatVehicleNumber = (number) => {
    return number
      .toUpperCase()
      .replace(/([A-Z\d]{2})([A-Z\d]{2})([A-Z\d]{2})(\d{4})$/, '$1-$2-$3-$4');
  };

  const vehicle = {
    vehicle_number: 'UP32HK3432',
    driver: { driver_name: 'John Doe', phone: '1234567890' },
  };

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Image source={AppImages.dhoniImage} style={styles.profileImage} />
        
        <View style={styles.leftSection}>
        <Text style={styles.name}>{vehicle.driver.driver_name}</Text>

          <View style={styles.contactContainer}>
            <Text style={styles.VType}>2 Wheeler</Text>
            <Text style={styles.VType}>
            {formatVehicleNumber(vehicle.vehicle_number)}
          </Text>
          </View>
        </View>
        {screen && (
  <View style={styles.rightSection}>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Text style={styles.status}>View Profile</Text>
    </TouchableOpacity>
  </View>
)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // marginTop: 100,
    borderWidth: 1,
    borderColor:Colors.grey,
    shadowColor: '#000',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  leftSection: {
    flexDirection: 'column',
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',    

  },
  name: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 4,
  },
  VType: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  contact: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brandBlue,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
});

export default VehicleProfileCard;
