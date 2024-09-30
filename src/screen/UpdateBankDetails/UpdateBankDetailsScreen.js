import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Colors from '../../common/Colors';

const UpdateBankDetailsScreen = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Account Number:', accountNumber);
    console.log('Additional Details:', additionalDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Bank Details</Text>
        <CustomTextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Account Number"
            label="Bank Account No"
            isRequired={false}
          />
        
        <CustomTextInput
            value={ifscCode}
            onChangeText={setIfscCode}
            placeholder="Ifsc Code"
            label="IFSC Code"
            isRequired={false}
          />
        
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
    padding: 16,
    backgroundColor:Colors.homeBackground
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateBankDetailsScreen;
