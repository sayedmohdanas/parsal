import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppImages from '../../common/AppImages'
import Colors from '../../common/Colors'
import CustomButton from '../../components/CustomButton/CustomButton';
import { errorToast, getItem, successToast } from '../../common/CommonFunction'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/Loading/Loading'
import CheckBox from 'react-native-check-box'
import { loginPartner,  } from '../../redux/HitApis/HitApiSlice'
import flagImages from './FlagImages';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation, route }) => { 
  const dispatch = useDispatch()
  const user = useSelector((state) => state.parsal_store?.user);
  const status = useSelector((state) => state?.parsalPartner?.status);
  const loading = useSelector((state) => state?.parsalPartner?.loading);
  const [termsAndConditions, setTermsAndConditions] = useState(false)
  const [tdsDeclaration, setTdsDeclaration] = useState(false)
  const [countryCode, setCountryCode] = useState('IN');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [number, setNumber] = useState('')
  const [flag, setFlag] = useState(flagImages.default);
  const [countryName, setCountryName] = useState('India');
  const [mobile, setMobile] = useState('9711825718');


  // useEffect(() => {
  //   const pId = async () => {
  //     await AsyncStorage.removeItem('partner_id');
 

  //   }
  //   pId()
  // }, [])
  useEffect(() => {
    if (route.params?.number) {
      setNumber(route.params.number);
    }
  }, [route.params?.number]);

  const handleGetOtp = async () => {
    try {
      if (number === '' || number == undefined || number === null) {
        errorToast('Invalid Input', 'Please enter your email address.');
        return;
      }
      const request = {
        email: number,
        // mobile: mobile
      };
      dispatch(loginPartner(request))
      if (status === 'failed') {
        errorToast('Issue!!', 'Something went wrong');
      }

    } catch (error) {
      console.log('Error in getting otp by email', error)
    }
  }
  useEffect(() => {
    if (status === 'succeeded' && !loading) {
      successToast('Success', `OTP has been sent successfully to ${number}`);
      // navigation.replace('OtpScreen', { number: number });
      if (!loading) {
        navigation.navigate('Otp', { number: number })
      }

    }
  }, [status])
  const handleTermsPress = () => {
    Alert.alert('Terms and Conditions clicked')
    console.log('Terms and Conditions clicked');
  };
  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy clicked')
    console.log('Privacy Policy clicked');
  };
  const handleTDSPress = () => {
    Alert.alert('TDS Declaration clicked')
    console.log('TDS Declaration clicked');
  };

  return (
    <>

      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.homeBackground }}>
        <View >
          <View style={{ marginBottom: 80, justifyContent: "center", alignItems: 'center' }}>
            <View style={{ marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={AppImages.SplashScreenLogo} style={styles.parcalLogo} resizeMode='contain' />
            </View>
          </View>


          <View style={{ justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ alignSelf: 'flex-start' }}>

              <Text style={styles.inputLabel}>Mobile Number</Text>

            </View>
            <View style={[styles.numberInputContainer]}>


              <View style={{ marginLeft: 5 }}>

                <Text style={{ color: Colors.black, fontSize: 15, fontWeight: 600 }}>+91</Text>
              </View>
              <View style={styles.inputContainer}>

                <TextInput
                  placeholder='Enter your number'
                  style={styles.textInputstyle}
                  // maxLength={10}
                  value={number.trim()}
                  placeholderTextColor={Colors.black}
                  onChangeText={(e) => {
                    setNumber(e)
                  }}
                />
              </View>
            </View>

            {/* Add label above the TextInput */}
            <View style={{ width: '92%', marginBottom: 16 }}>



              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={styles.checkbox}
                  onClick={() => setTermsAndConditions(!termsAndConditions)}
                  isChecked={termsAndConditions}
                  checkBoxColor={Colors.brandBlue}
                />
                <View style={styles.textWrapper}>
                  <Text style={styles.label}>
                    I have read and agreed to{' '}

                    <Text style={styles.linkText} onPress={handleTermsPress}>Terms and Conditions</Text>

                    {' '}and{' '}

                    <Text style={styles.linkText} onPress={handlePrivacyPress}>Privacy Policy</Text>

                  </Text>
                </View>
              </View>

              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={styles.checkbox}
                  onClick={() => setTdsDeclaration(!tdsDeclaration)}
                  isChecked={tdsDeclaration}
                  checkBoxColor={Colors.brandBlue}
                />
                <View style={styles.textWrapper}>
                  <Text style={styles.label}>
                    I have read and hereby provide my consent on the{' '}
                    <Text style={styles.linkText} onPress={handleTDSPress} >TDS Declaration</Text>

                  </Text>
                </View>
              </View>

            </View>

            <View style={{ marginBottom: 10, justifyContent: "center", alignItems: 'center' }}>
              <CustomButton
                buttonText={'LOGIN'}
                disabled={!termsAndConditions || !tdsDeclaration || number.length <= 10}
                onPress={() => {
                  handleGetOtp()

                }} />
            </View>
          </View>
        </View>
      </View>


      <Loading loading={loading} />

    </>
  )
}

export default LoginScreen


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
    // borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderColor: Colors.textInputBorderColor,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 16,
    borderLeftWidth: 1,
    height: 40,
    borderColor: Colors.textInputBorderColor,
  },
  textInputstyle: {
    marginLeft: 10,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 15
  },
  numberStyleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#F6F1FF',
    borderRadius: 60,
  },
  numberContainer: {
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.brandBlue,
    fontWeight: '600',
  },
  number: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 15,
    color: Colors.brandBlue,
    marginHorizontal: -5,
    lineHeight: 20,
    textAlignVertical: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#000',
    alignSelf: 'flex-start',
    marginLeft: 25,
  },
  flagContainer: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flag: {
    height: 20,
    width: 20
  }
});


