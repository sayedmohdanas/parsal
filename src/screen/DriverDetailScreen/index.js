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
import {hitGetPartner, hitUpdateDriverDetails} from '../../config/api/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import { Fonts, FontSizes } from '../../common/Theme';
import Loading from '../../components/Loading/Loading';
const DriverDetailScreen = ({route}) => {
  const {v_id, updateDriverData} = route.params || {};

  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const dispatch = useDispatch();
  const [loading ,setLoading]=useState(false)

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
  // const [driverNumber, setDriverNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [driverProfilePic, setDriverProfilePic] = useState('');
  // const [licenseUploaded, setLicenseUploaded] = useState('');
  const [partneData, setPartnerData] = useState([]);
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      setLoading(true);
      try {
        const response = await hitGetPartner({partner_id: partnerId});
        setPartnerData(response?.partner);
      } catch (error) {
        console.error('Error fetching partner details:', error);
      }
      setLoading(false);

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
    setLoading(true)
    const partnerId = await AsyncStorage.getItem('partner_id');
    const {latitude, longitude} = await GetDriverCurrentLocation();
    const payload = {
      partner_id: partnerId,
      email: email.replaceAll(' ', ''),
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
            navigation.navigate('OwnerDashboard');
          } else {
            errorToast(`Something went wrong while updating driver`);
          }
        } catch (error) {
          console.log('Something went wrong while updating driver', error);
        }
      } else {
        const resultAction = await dispatch(addDriverDetails(payload));
        console.log('resultAction',resultAction);
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
          navigation.navigate('OwnerDashboard');
        } else {
          Alert.alert(
            'Error',
            resultAction.payload?.message ||
              'An error occurred while submitting.',
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }finally {
      setLoading(false);
    }
  };
  const isEnabled = name && driverNumber && licenseUploaded;
  return (
    <View style={styles.container}>
    {loading ? (
      <Loading loading={loading} />
    ) : (
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
    )}
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
    fontSize: FontSizes.semiLarge,
    textAlign: 'center',
    fontWeight: Fonts.semilarge,
  },
  headinglabel: {
    fontSize: FontSizes.semiLarge,
    color: 'black',
    marginVertical: responsiveHeight(20),
    fontWeight: Fonts.medium,
  },
  redAsterisk: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: FontSizes.medium,
    fontWeight: Fonts.semilarge,
  },
});
export default DriverDetailScreen;
