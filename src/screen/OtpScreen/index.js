import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { mystyles } from '../../common/Mystyle'
import AppImages from '../../common/AppImages'
import { responsiveHeight, responsiveWidth } from '../../common/metrices'
// import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import CountryPicker from 'react-native-country-picker-modal';
import Colors from '../../common/Colors'
import CustomButton from '../../components/CustomButton/CustomButton';
// import { useNavigation } from '@react-navigation/native'
import { errorToast, getItem, successToast } from '../../common/CommonFunction'
import { EmailOtp } from '../../redux/HitApis/HitApisSlice'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/Loading/Loading'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { Checkbox } from 'react-native-paper'
import { blueGrey100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'

const OtpScreen = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const { number } = route?.params;
  const dispatch = useDispatch()
  const user = useSelector((state) => state.parsal_store?.user);
  const status = useSelector((state) => state?.parsal_store?.status);
  const loading = useSelector((state) => state?.parsal_store?.loading);
  const [checked, setChecked] = React.useState(false);
  const [countryCode, setCountryCode] = useState('IN');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [otp, setOtp] = useState('')
  const [mobile, setMobile] = useState('9711825718');
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedHearby, setCheckedHearby] = useState(false);
  console.log('status', status);
  console.log('user=>', user)
  console.log('loading => ', loading);
  const handleLanguage = (value) => {
    setSelectedOption(value);
    console.log(value);
  };
  const handleSelectCountry = (country) => {
    setCountryCode(country.cca2);
    console.log(country.cca2)
  };
  const handleDropdownClick = () => {
    setIsPickerVisible(!isPickerVisible);
  };
  const partnerId = useSelector(state => state?.parsalPartner?.parentId);
  const handleGetOtp = async () => {
    if (partnerId) {
      // Navigate to MyVehicles screen if partnerId exists
      navigation.navigate('MyVehicles');
    } else {
      // Navigate to OwnerDetail screen if partnerId does not exist
      navigation.navigate('OwnerDetail');
    }
    //     try {
    //         if (number === '' || number == undefined || number === null) {
    //             errorToast('Invalid Input', 'Please enter your email address.');
    //             return;
    //         }
    //         const request = {
    //             email: number,
    //             mobile: mobile
    //         };
    //         dispatch(EmailOtp(request))
    //         if (status === 'failed') {
    //             errorToast('Issue!!', 'Something went wrong');
    //         }
    //     } catch (error) {
    //         console.log('Error in getting otp by email', error)
    //     }
    // }
    // useEffect(() => {
    //     if (status === 'succeeded' && !loading) {
    //         successToast('Success', `OTP has been sent successfully to ${mobile}`);
    //         // navigation.replace('OtpScreen', { number: number });
    //     }
  }
  const handleTermsPress = () => {
    // Handle navigation to Terms and Conditions
    console.log('Terms and Conditions clicked');
  };
  const handlePrivacyPress = () => {
    // Handle navigation to Privacy Policy
    console.log('Privacy Policy clicked');
  };
  const handleTDSPress = () => {
    // Handle navigation to TDS Declaration
    console.log('TDS Declaration clicked');
  };
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View >
          <View style={{ marginBottom: 80, justifyContent: "center", alignItems: 'center' }}>
            <View style={{ marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={AppImages.SplashScreenLogo} style={styles.parcalLogo} resizeMode='contain' />
            </View>
            {/* <View style={[mystyles.center]}>
        <Image source={AppImages.EnterNumberScreenImg} style={styles.mainImg} resizeMode='contain' />
            </View> */}
            <View style={[{ flexDirection: 'row' }, styles.numberStyleContainer]}>
              <View style={[{ flexDirection: 'row' }, styles.numberContainer]}>
                <Text style={styles.number}>{number}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                // dispatch(setStatusPending());
                // navigation.replace('Login');
                navigation.replace('Login', { number: number });
              }}>
                <View style={[{ justifyContent: 'center', alignItems: "center" }, styles.buttonContainer]}>
                  <Text style={[styles.buttonText]}  >{`Change`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignSelf: 'flex-start' }}>
              <Text style={styles.inputLabel}>ENTER OTP</Text>
            </View>
            <View style={[styles.numberInputContainer]}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder='ENTER OTP'
                  style={styles.textInputstyle}
                  value={otp}
                  placeholderTextColor={Colors.black}
                  onChangeText={(e) => {
                    setOtp(e)
                  }}
                />
              </View>
            </View>
            <View style={{ marginBottom: 10, justifyContent: "center", alignItems: 'center' }}>
              <CustomButton
                buttonText={'VERIFY'}
                onPress={() => {
                  handleGetOtp()
                }} />
              <Text style={styles.resendBtn}>RESEND OTP</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <Loading loading={loading} /> */}
    </>
  )
}
export default OtpScreen


const styles = StyleSheet.create({
    parcalLogo: {
      width: 160,
      height: 49,
    },
    mainImg: {
      width: 384,
      height: 383,
    },
    numberInputContainer: {
      flexDirection: 'row',
      height: 55,
      borderBottomWidth: 2,
      marginHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      borderColor: Colors.textInputBorderColor,
      marginBottom: 20,
    },
    inputContainer: {
      flex: 1,
      marginLeft: 10,
    //   borderLeftWidth: 1,
      height: 40,
      borderColor: Colors.textInputBorderColor,
    },
    textInputstyle: {
      // marginLeft: 10,  
      color: Colors.black,
    },
    numberStyleContainer: {
      alignItems: 'center',
      justifyContent:'center',
      gap: 8,
      paddingHorizontal:10,
    
      height: 40,
      // backgroundColor: '#F6F1FF',
      // borderRadius: 60,
    },
    numberContainer: {
     
      gap: 10,
    },
    buttonText: {
      fontSize: 16,
      color: Colors.brandBlue,
      fontWeight: '600',
    },
    number: {
      color: '#000000',
      fontSize: 16,
      fontWeight: '600',
    },
    checkboxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 12,
    },
    textContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    label: {
      fontSize: 15,
      color: '#000',
    },
    linkText: {
      fontSize: 15,
      color: 'blue',
      marginHorizontal: -5,
    },
    inputLabel: {
      fontSize: 12,
      color: 'gray',
      fontWeight:'500', 
      alignSelf:'flex-start',
      
    //   marginBottom: 8,
      marginLeft: 25,
    },
    resendBtn:{
      color:Colors.brandBlue,
      fontSize:17,
      fontWeight:'600',
      marginTop:10
    }
  });
  