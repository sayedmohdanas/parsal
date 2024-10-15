import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import CheckBox from 'react-native-check-box';
import Heading from '../../components/Heading/Heading';
import PageButtons from '../../components/TempBtn/TempBtn';
import {useDispatch, useSelector} from 'react-redux';
import {addDriverDetails} from '../../redux/HitApis/HitApiSlice';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../common/Colors';
import {
  errorToast,
  GetDriverCurrentLocation,
  successToast,
} from '../../common/CommonFunction';
import {getMessaging} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getPartner} from '../../config/url';
import {hitGetPartner} from '../../config/api/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
const DriverDetailScreen = ({route}) => {
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  console.log('partnerId===>', partnerId);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const {v_id, onUpdate} = route.params;
  // const v_id=12
  // const partneData = useSelector(state => state?.parsalPartner?.PartnerDetails?.partner);
  const registerSuccess = useSelector(state => state?.parsalPartner?.statuss);
  const navigation = useNavigation();
  const [driverNumber, setDriverNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [driverProfilePic, setDriverProfilePic] = useState('');
  const [licenseUploaded, setLicenseUploaded] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [partneData, setPartnerData] = useState([]);
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const response = await hitGetPartner({partner_id: partnerId});    
        setPartnerData(response?.partner);
      } catch (error) {
        console.error('Error fetching partner details:', error);
      }
    };
    fetchPartnerDetails();
  }, [navigation]);
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = value => {
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };
  const handleSubmit = async () => {
    if (!validateEmail(email?.replaceAll(' ', ''))) {
      errorToast('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (driverNumber?.length != 10) {
      // Adjusting to 10 digits requirement
      errorToast('Invalid Number', 'Please enter 10 digits valid  number.');
      return; // Exit if the driver number is invalid
    }
    const partnerId = await AsyncStorage.getItem('partner_id');
    const {latitude, longitude} = await GetDriverCurrentLocation();
    const payload = {
      partner_id: partnerId,
      email: email,
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
      address: 'Lucknow, Uttar Pradesh , India',
      fcm_id: await getMessaging().getToken(),
      status: 1,
      working_status: 1,
      owner_status: isChecked && 2,
    };

    try {
      const resultAction = await dispatch(addDriverDetails(payload));      
      if (addDriverDetails.fulfilled.match(resultAction)) {
        const user = await AsyncStorage.getItem('user');
        let parsedUser = JSON.parse(user);
        if (isChecked) {
          parsedUser.payload.owner_type = 2;
          parsedUser.payload.driver_id = resultAction?.payload?.driver_id; 
        }
        await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
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
  const isEnabled = name && driverNumber && licenseUploaded;
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Heading text="Driver Details" isRequired={true} />
          <View style={styles.card}>
            <CheckBox
              style={{padding: 10}}
              onClick={() => {
                setIsChecked(!isChecked);
                if (!isChecked) {
                  setName(partneData?.partner_name);
                  setDriverNumber(partneData?.phone?.replaceAll(" ",""));
                  setEmail(partneData?.email);
                } else {
                  setName('');
                  setDriverNumber('');
                  setEmail('');
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
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Driver Email"
            label="Driver Email"
            isRequired={true}
            // error={emailError}
          />
          {/* {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null} */}
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
    paddingHorizontal: responsiveWidth(20),
    backgroundColor: Colors.homeBackground,
  },
  card: {
    marginBottom: responsiveHeight(16),
    flexDirection: 'row',
    paddingVertical: responsiveHeight(16),
    borderRadius: 5,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingBottom: responsiveHeight(80),
  },
  confirmationText: {
    color: '#000',
    fontSize: responsiveFontSize(16),
    textAlign: 'center',
    fontWeight: '500',
  },
  headinglabel: {
    fontSize: responsiveFontSize(16),
    color: 'black',
    marginVertical: responsiveHeight(20),
    fontWeight: '600',
  },
  redAsterisk: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(14),
    fontWeight: '500',
    // marginTop: responsiveHeight(8),
    // alignSelf:'center',
    // marginLeft:responsiveWidth(20)
  },
});
export default DriverDetailScreen;
