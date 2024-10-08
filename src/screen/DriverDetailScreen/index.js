import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import CheckBox from 'react-native-check-box';
import Heading from '../../components/Heading/Heading';
import PageButtons from '../../components/TempBtn/TempBtn';
import { useDispatch, useSelector } from 'react-redux';
import { addDriverDetails } from '../../redux/HitApis/HitApiSlice';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../common/Colors';

const DriverDetailScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const { v_id, onUpdate } = route.params;     
  const partnerId = useSelector(state => state?.parsalPartner?.parentId);
  const navigation = useNavigation();
  const [driverNumber, setDriverNumber] = useState('');
  const [driverProfilePic, setDriverProfilePic] = useState('');
  const [licenseUploaded, setLicenseUploaded] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      partner_id: partnerId,
      vehicle_id: v_id,
      driver_name: name,
      phone: driverNumber,
      profile_pic: {
        img_name: driverProfilePic ? 'profile.png' : '',
        img_src: driverProfilePic?.base64 || '',
      },
      driving_licenese_pic: {
        img_name: licenseUploaded ? 'license.png' : '',
        img_src: licenseUploaded?.base64 || '',
      },
      driving_licenese_number: driverNumber,
      current_lat: 40.712776,
      current_long: -74.005974,
      address: "789 Broadway, New York",
      fcm_id: "example_fcm_id_token",
      status: isChecked ? 1 : 0,
      working_status: isChecked ? 1 : 0
    };
    try {
      const resultAction = await dispatch(addDriverDetails(payload));
      if (addDriverDetails.fulfilled.match(resultAction)) {
        Alert.alert('Submitted', 'Your details have been submitted.');

        if (onUpdate) onUpdate(); 
        navigation.goBack();
      } else {
        Alert.alert('Error', resultAction.payload?.message || 'An error occurred while submitting.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }
  };

  const isEnabled = name && driverNumber && licenseUploaded && isChecked;


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Heading
            text="Driver Details"
            isRequired={true}
          />
          <View style={styles.card}>
            <CheckBox
              style={{ padding: 10 }}
              onClick={() => setIsChecked(!isChecked)}
              isChecked={isChecked}
              checkBoxColor={Colors.brandBlue} // Set the checkbox color to blue
              />
            <Text style={styles.confirmationText}>I will be driving this vehicle</Text>
          </View>

        
          <CustomTextInput
            value={name}
            onChangeText={setName}
            placeholder="Driver Name"
            label="Driver Name"
            isRequired={true}
          />

         
          <CustomTextInput
            value={driverNumber}
            onChangeText={setDriverNumber}
            placeholder="Driver Phone Number"
            label="Driver Phone Number"
            isRequired={true}
            type="number" 
            maxLength={10} 
          />



          <Heading
            text=" Upload The Following"
            isRequired={true}
          />

          <ImagePicker
            labelText="Driver Profile Pic"
            uploaded={driverProfilePic}
            onImagePick={setDriverProfilePic}
            useCamera={false}
          />

          <ImagePicker
            labelText="Driver License"
            uploaded={licenseUploaded}
            onImagePick={setLicenseUploaded}
            useCamera={false}
          />

        </View>
      </ScrollView>

      {/* Submit Button Card */}
      <SubmitCard onPress={handleSubmit} isEnabled={isEnabled} />
      <PageButtons nextScreenName={'Login'} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 5,
    borderWidth: 0.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  confirmationText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  headinglabel: {
    fontSize: 16,
    color: 'black',
    marginVertical: 20,
    fontWeight: '600',
  },
  redAsterisk: {
    color: 'red',
  },
});

export default DriverDetailScreen;
