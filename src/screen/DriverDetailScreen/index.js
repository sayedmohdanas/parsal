import React, { useEffect, useState } from 'react';
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
import { GetDriverCurrentLocation, successToast } from '../../common/CommonFunction';
import { getMessaging } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPartner } from '../../config/url';
import { hitGetPartner } from '../../config/api/api';

const DriverDetailScreen = ({ route }) => {
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
//  console.log('partnerId===>',partnerId);
 

  
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const { v_id, onUpdate } = route.params;
  // const partneData = useSelector(state => state?.parsalPartner?.PartnerDetails?.partner);
  const registerSuccess = useSelector(state => state?.parsalPartner?.statuss);
  const navigation = useNavigation();
  const [driverNumber, setDriverNumber] = useState('');
  const [driverProfilePic, setDriverProfilePic] = useState('');
  const [licenseUploaded, setLicenseUploaded] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [partneData,setPartnerData]=useState([])
console.log('partnerdata===>',partneData);

useEffect(() => {
  const fetchPartnerDetails = async () => {
    try {
      const response = await hitGetPartner({ partner_id: partnerId });
      setPartnerData(response?.partner)
      console.log('anas==>res==>', response);
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  fetchPartnerDetails();
}, [navigation]);



  const handleSubmit = async () => {
    const partnerId = await AsyncStorage.getItem('partner_id');
    const { latitude, longitude } = await GetDriverCurrentLocation();
    const payload = {
      partner_id: partnerId,
      vehicle_id: v_id,
      driver_name: name,
      phone: driverNumber,
      profile_pic: {
        img_name: driverProfilePic ? 'profile.png' : '',
        img_src: driverProfilePic?.base64 || '',
      },
      driving_license_pic: {
        img_name: licenseUploaded ? 'license.png' : '',
        img_src: licenseUploaded?.base64 || '',
      },
      driving_license_number: driverNumber,
      current_lat: latitude,
      current_long: longitude,
      address: '789 Broadway, New York',
      fcm_id: await getMessaging().getToken(),
      // fcm_id: 'fcm token',
      status: isChecked ? 1 : 0,
      working_status: isChecked ? 1 : 0,
    };

    console.log('payload', payload)

    try {
      console.log(payload.fcm_id, 'payload');

      const resultAction = await dispatch(addDriverDetails(payload));
      if (addDriverDetails.fulfilled.match(resultAction)) {
        successToast(`Driver ${name} successfully added.`);
        navigation.navigate('MyVehicles');
      } else {
        Alert.alert(
          'Error',
          resultAction.payload?.message ||
          'An error occurred while submitting.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }
  };

  const isEnabled = name && driverNumber && licenseUploaded

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Heading text="Driver Details" isRequired={true} />
          <View style={styles.card}>
            <CheckBox
              style={{ padding: 10 }}
              onClick={() => {
                setIsChecked(!isChecked);
                if (!isChecked) {
                  setName(partneData?.partner_name);
                  setDriverNumber(partneData?.phone);
                } else {
                  setName('');
                  setDriverNumber('');
                }
              }}
              isChecked={isChecked}
              checkBoxColor={Colors.brandBlue}
            />

            <Text style={styles.confirmationText}>
              I will be driving this vehicle
            </Text>
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

          <Heading text=" Upload The Following" isRequired={true} />

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
    backgroundColor: Colors.homeBackground,
  },
  card: {
    marginBottom: 16,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 5,
    backgroundColor: Colors.white,
    // borderWidth: 0.2,
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
