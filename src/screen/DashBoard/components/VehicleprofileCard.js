import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import AppImages from '../../../common/AppImages';
import PartnerAddressCard from '../screen/Profile/PartnerAddressCard';
import ProfileWithStatus from './ProfileWithStatus';

const VehicleProfileCard = ({ screen = false,isOnline,vehicle_data }) => {
  console.log(vehicle_data);
  
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
    <View style={[
      styles.card,
      { borderBottomColor: isOnline ? 'green' : 'red', borderBottomWidth: 2 } // Set border color based on online status
    ]}>
    {/* <View style={[isOnline?borderBottomColor:,styles.card]}> */}
      <View style={[styles.topSection, screen ? { justifyContent: '' } : {}]}>
        {/* <Image source={AppImages.profileImage} style={styles.profileImage} />+ */}
         <ProfileWithStatus isOnline={isOnline}/>
        <View style={styles.leftSection}>
          <Text style={styles.name}>{vehicle_data?.driver?.driver_name}</Text>

          <View style={styles.contactContainer}>
            <Text style={styles.VType}>2 Wheeler </Text>
            <Text style={styles.VType}>
              {vehicle_data?.vehicle_number}
            </Text>
          </View>
        </View>
      </View>


      <View>
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
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 16,
    marginTop: 12,
    // marginBottom:12,
    width: '100%',
    // paddingHorizontal: 10,
    borderBottomWidth: 3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    // marginVertical:8,
    borderBottomColor: 'green'
  },
  topSection: {
    flexDirection: 'row',


    alignItems: 'center'

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
