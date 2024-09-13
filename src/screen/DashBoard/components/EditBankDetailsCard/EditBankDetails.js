import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';
import ConfirmationButton from '../../../../components/ConfirmationButton/ConfirmationButton';
import BorderLine from '../../../../common/BorderLine.';

const EditBankDetail = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Current Bank Details</Text>
      <View style={{ width: '85%' }}>
        <View style={styles.detailContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detail}>Account Number</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.number}>:637467373637836</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detail}>IFSC Code</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.number}>:UBin7486</Text>
          </View>
        </View>
      </View>


      <BorderLine color="gray" thickness={2} length="100%" orientation="horizontal" />

      <View style={{
        width: '80%', marginBottom: 10
      }}>
        <Text style={styles.confirmationText}>Are you sure you want to edit the details?</Text>


      </View>
      <ConfirmationButton onNoPress={''} onYesPress={''} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    paddingHorizontal: 20,

  },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
    color: Colors.black,
  },
  detail: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '600'
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
    alignSelf: 'flex-start',
    textAlign: 'right'
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 10
  },

  confirmationText: {
    fontSize: 12,
    color: Colors.black
  },

});

export default EditBankDetail;
