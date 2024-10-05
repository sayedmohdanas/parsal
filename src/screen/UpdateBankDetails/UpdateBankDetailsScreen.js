import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Colors from '../../common/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { hitAddBankAccount } from '../../config/api/api';
import Loading from '../../components/Loading/Loading'; 
import { errorToast, successToast } from '../../common/CommonFunction';
// import { successToast Assuming you have a utility function for showing toasts

const UpdateBankDetailsScreen = ({ navigation }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const [loading, setLoading] = useState(false);

  console.log(partnerId, 'partnerId=====>>>>>');

  // Function to pick an image or use the camera
  const pickImage = async (useCamera = false) => {
    try {
      const response = useCamera
        ? await ImagePicker.openCamera({ cropping: true })
        : await ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            includeBase64: true,
          });

      if (response) {
        const base64Data = `data:${response.mime};base64,${response.data}`;
        const imagePath = response.path;

        // Handle the image data, pass it wherever needed
        console.log('Image URI:', imagePath);
        console.log('Base64 Data:', base64Data);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const handleAddAccount = async () => {
    try {
      setLoading(true);
      const payload = {
        partner_id: partnerId,
        ifsc_code: ifscCode,
        account_no: accountNumber,
      };
      console.log('addbankaccoun-payload====>>>', payload);
      const response = await hitAddBankAccount(payload);
      console.log('addbankaccountresponse===>>', response);

      if (response.success) {
        successToast("successfully!","Bank details added successfully!")
        navigation.goBack(); // Navigate back on success
      } else {
        errorToast(response.message,'Something went wrong!')
      }
    } catch (error) {
      console.error(error);
      errorToast(response.message,'An error occurred while adding bank details!')

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Loading loading={loading} /> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            placeholder="IFSC Code"
            label="IFSC Code"
            isRequired={false}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddAccount}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity onPress={() => pickImage(false)}>
            <Text style={{ color: Colors.brandBlue }}>Don't have the details? Upload Document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.homeBackground,
  },
  button: {
    backgroundColor: Colors.brandBlue,
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
