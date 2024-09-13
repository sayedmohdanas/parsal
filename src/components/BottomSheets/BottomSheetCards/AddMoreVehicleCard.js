import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../common/Colors';
import ConfirmationButton from '../../ConfirmationButton/ConfirmationButton';

const AddMoreVehicleCard = ({ onYesPress, onNoPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Do you have more vehicles to add?</Text>
      <Text style={styles.subheading}>
        Your vehicle ending with <Text style={styles.vehicleNumber}>*1673*</Text> is already added. Click Yes to add more vehicles.
      </Text>


      <View style={styles.confirmationContainer}>
        <ConfirmationButton onNoPress={''} onYesPress={''} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginVertical: 10,
  },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.black,
    textAlign: 'left',
  },
  subheading: {
    fontSize: 14,
    color: Colors.grey,
    // marginBottom: 16,
    marginTop:10,
    textAlign: 'left',
  },
  vehicleNumber: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  confirmationContainer: {
    marginTop: 5,
    width: '100%',
  },
});

export default AddMoreVehicleCard;
