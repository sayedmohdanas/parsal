import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Colors from '../../common/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { hitAddBankAccount } from '../../config/api/api';
import Loading from '../../components/Loading/Loading';
import { errorToast, successToast } from '../../common/CommonFunction';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import ImagePickerComponent from '../../components/ImagePickerComponent/ImagePicker';
import { responsiveFontSize, responsiveHeight } from '../../common/metrices';
// import { successToast Assuming you have a utility function for showing toasts

const UpdateBankDetailsScreen = ({ navigation }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const [loading, setLoading] = useState(false);
  const [bankDocument, setBankDocument] = useState(null)


  const handleAddAccount = async () => {
    try {
      setLoading(true);
      const payload = {
        partner_id: partnerId,
        ifsc_code: ifscCode,
        account_no: accountNumber,
      };
      const response = await hitAddBankAccount(payload);
      if (response.success) {
        successToast('successfully!', 'Bank details added successfully!');
        setAccountNumber('');
        setIfscCode('');
        setBankDocument(null);
        navigation.navigate('Trip'); 
      } else {
        console.log(response);
        errorToast(response.message || response.error, 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      errorToast(
        error.error,
        'An error occurred while adding bank details!',
      );
    } finally {
      setLoading(false);
    }
  };
  
  const disabled = accountNumber.length < 10 || ifscCode.length < 8 || !bankDocument;
  console.log(disabled)

  return (
    <>
      <HeaderBackButton
        headerText={'Manage Bank Account'}
        onPress={() => {
          navigation.goBack('');
        }}
      />
      <View style={styles.container}>
        <Loading loading={loading} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <CustomTextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Account Number"
              label="Bank Account No"
              isRequired={true}
            />
            <CustomTextInput
              value={ifscCode}
              onChangeText={setIfscCode}
              placeholder="IFSC Code"
              label="IFSC Code"
              isRequired={true}
            />

          </View>
          <View style={{
            marginTop: responsiveHeight(12), borderRadius: responsiveHeight(8),
          }}>
            <ImagePickerComponent
              labelText="Passbook / Checkbook"
              uploaded={bankDocument}
              onImagePick={setBankDocument}
              useCamera={false}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[
            styles.button,
            disabled && { backgroundColor: Colors.grey },
          ]}

            onPress={handleAddAccount}
            disabled={disabled}

          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginTop: 10 }}>

          </View>
        </View>
      </View>
    </>
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
    borderRadius: responsiveHeight(8),
    padding: 15,
  },
  cardTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    // marginBottom: 20,
    color: Colors.black,
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
    borderRadius: responsiveHeight(5),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateBankDetailsScreen;
