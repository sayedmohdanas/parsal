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
import {
  errorToast,
  GetDriverCurrentLocation,
  successToast,
} from '../../common/CommonFunction';
import { getMessaging } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hitGetPartner, hitUpdateDriverDetails } from '../../config/api/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Loading from '../../components/Loading/Loading';
const DriverDetailScreen = ({ route }) => {
  const { v_id, updateDriverData } = route.params || {};
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const dispatch = useDispatch();
  const [name, setName] = useState(updateDriverData?.driver?.driver_name || '');
  const [email, setEmail] = useState(updateDriverData?.driver?.email || '');
  const [driverNumber, setDriverNumber] = useState(
    updateDriverData?.driver?.phone || '',
  );
  const [isChecked, setIsChecked] = useState(
    updateDriverData?.driving == 1 ? true : false || false,
  );
  const [driverProfilePic, setDriverProfilePic] = useState(
    updateDriverData?.driver?.profile_pic || '',
  );
  const [licenseUploaded, setLicenseUploaded] = useState(
    updateDriverData?.driver?.driving_license_pic || '',
  );
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [partneData, setPartnerData] = useState([]);
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const response = await hitGetPartner({ partner_id: partnerId });
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
  const [loader, setloader] = useState(false);
  const handleSubmit = async () => {
    if (!validateEmail(email?.replaceAll(' ', ''))) {
      errorToast('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (driverNumber?.length != 10) {
      errorToast('Invalid Number', 'Please enter 10 digits valid  number.');
      return; // Exit if the driver number is invalid
    }
    setloader(true);
    const partnerId = await AsyncStorage.getItem('partner_id');
    const { latitude, longitude } = await GetDriverCurrentLocation();
    const payload = {
      partner_id: partnerId,
      email: email.replaceAll(' ', '')?.toLocaleLowerCase(),
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
      if (updateDriverData) {
        try {
          const Updatedpayload = {
            ...payload,
            driver_id: updateDriverData?.driver_id,
          };

          const response = await hitUpdateDriverDetails(Updatedpayload);
          if (response?.status) {
            successToast(`Driver ${name} successfully Updated.`);
            navigation.goBack('');
            setloader(false);
          } else {
            setloader(false);
            errorToast(`Something went wrong while updating driver`);
          }
        } catch (error) {
          setloader(false);
        }
      } else {
        const resultAction = await dispatch(addDriverDetails(payload));
        if (addDriverDetails.fulfilled.match(resultAction)) {
          const user = await AsyncStorage.getItem('user');
          let parsedUser = JSON.parse(user);
          if (isChecked) {
            parsedUser.payload.owner_type = 2;
            parsedUser.payload.driver_id = resultAction?.payload?.driver_id;
            parsedUser.payload.phone = payload?.phone;
            parsedUser.payload.vehicle_type_id = payload?.payload;
          }
          await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
          successToast(`Driver ${name} successfully added.`);
          setloader(false);
          navigation.goBack('');
        } else {
          Alert.alert(
            'Error',
            resultAction.payload?.message ||
            'An error occurred while submitting.',
          );
          setloader(false);
        }
      }
    } catch (error) {
      setloader(false);
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }
  };
  const isEnabled = name && driverNumber && licenseUploaded;
  return (
    <>
      <HeaderBackButton
        headerText={'Assign Driver'}
        onPress={() => navigation.goBack('')}
      />
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
                    setDriverNumber(partneData?.phone?.replaceAll(' ', ''));
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
      <Loading loading={loader} />
    </>
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