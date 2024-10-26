import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AppImages from '../../common/AppImages';
import {responsiveHeight, responsiveWidth} from '../../common/metrices';
import Colors from '../../common/Colors';
import CustomButton from '../../components/CustomButton/CustomButton';
import {
  errorToast,
  generateRandomPhoneNumber,
  successToast,
} from '../../common/CommonFunction';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/Loading/Loading';
import {hitPartnerVerifyOtp} from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getVehicle,
  setLogout,
  setOwner,
  setParentId,
} from '../../redux/HitApis/HitApiSlice';
import OTPTextView from 'react-native-otp-textinput';

const OtpScreen = ({navigation, route}) => {
  const {number} = route?.params;
  const dispatch = useDispatch();
  const userOtp = useSelector(state => state?.parsalPartner?.user?.otp);
  const user = useSelector(state => state?.parsalPartner?.user);

  const loading = useSelector(state => state?.parsalPartner?.loading);
  const [otp, setOtp] = useState('');
  let otpInput = useRef(null);

  useEffect(() => {
    const pId = async () => {
      if (user) {
        console.log('user========>>>>', user);
      }
    };
    pId();
  }, [navigation]);

  // useEffect(() => {
  //   const pId = async () => {
  //   if(userOtp){
  //     successToast(`${userOtp}`,`${userOtp} is the otp for mobile verification`)
  //   }
  //   };
  //   pId();
  // }, []);
  const handleTextChange = async text => {
    setOtp(text);
  };

  const handleOtp = async () => {
    const owner_type = user?.payload?.owner_type;
    const id = user?.payload?.partner_id;
    try {
      if (otp.length < 4) {
        errorToast('Invalid Input', 'Enter a Valid Otp');
        return;
      }
      if (otp !== userOtp) {
        errorToast('Invalid Input', 'Incorrect Otp');
        return;
      }

      const request = {
        email: number,
        phone: generateRandomPhoneNumber(),
      };
      // if (owner_type) {
      console.log('user', user);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // }
      if (owner_type == 0) {
        // await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('owner_type', JSON.stringify(owner_type));
        // await dispatch(setOwner(owner_type))
        navigation.replace('DriverDashboard');

        return;
      } else if (owner_type == 1 || owner_type == 2) {
        await AsyncStorage.setItem('owner_type', JSON.stringify(owner_type));
        await AsyncStorage.setItem('partner_id', JSON.stringify(id));

        //  await dispatch(setOwner(owner_type))
        navigation.replace('OwnerDashboard');
        return;
      }

      const response = await hitPartnerVerifyOtp(request);
      const partnerId = response?.partnerId;
      if (response.status === 2) {
        if (
          response?.partner?.email !== null &&
          response?.partner?.phone !== null &&
          response?.partner?.partner_name !== '-' &&
          response?.partner?.email !== '-' &&
          response?.partner?.phone !== '-'
        ) {
          navigation.replace('MyVehicles', {     
            email: number,
          });
        } else {
          await AsyncStorage.setItem('partner_id', String(partnerId));
          // Dispatch the setParentId action
          dispatch(setParentId(partnerId));
          navigation.replace('OwnerDetail', {
            partner_id: partnerId,
            email: number,
          });
        }
      } else if (partnerId) {
        // Save partnerId in AsyncStorage
        await AsyncStorage.setItem('partner_id', String(partnerId));

        // Dispatch the setParentId action
        dispatch(setParentId(partnerId));

        // Navigate to the OwnerDetail screen
        navigation.replace('OwnerDetail', {
          partner_id: partnerId,
          email: number,
        });
      } else {
        console.error('PartnerId not found in the response');
      }
    } catch (err) {
      console.error('Error in OTP screen', err);
    }
  };



  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: Colors.homeBackground,
        }}>
        <View>
          <View
            style={{
              marginBottom: responsiveHeight(30),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                marginBottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={AppImages.SplashScreenLogo}
                style={styles.parcalLogo}
                resizeMode="contain"
              />
            </View>
        
            <View style={[{flexDirection: 'row'}, styles.numberStyleContainer]}>
              <View style={[{flexDirection: 'row'}, styles.numberContainer]}>
                <Text style={styles.number}>{number}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {               
                  dispatch(setLogout());
                  navigation.navigate('Login', {number: number});
                }}>
                <View
                  style={[
                    {justifyContent: 'center', alignItems: 'center'},
                    styles.buttonContainer,
                  ]}>
                  <Text style={[styles.buttonText]}>{`Change`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{alignSelf: 'flex-start'}}></View>
            <View style={[styles.numberInputContainer]}>
              <View style={styles.inputContainer}>
                <OTPTextView
                  ref={otpInput}
                  handleTextChange={handleTextChange}
                  inputCount={4}
                  containerStyle={styles.otpContainer}
                  textInputStyle={styles.otpInput}
                  inputCellLength={1}
                  tintColor={Colors.brandBlue}
                  offTintColor={Colors.textInputBorderColor}
                  autoFocus={true}                  
                />
              </View>
            </View>
            <View
              style={{
                marginTop: responsiveHeight(20),
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomButton
                buttonText={'VERIFY'}
                disabled={otp.length < 4} // Ensure you're checking the length of the OTP strin
                onPress={() => {
                  handleOtp();
                }}
              />
              <Text style={styles.resendBtn}>RESEND OTP</Text>
            </View>
          </View>
        </View>
      </View>
      <Loading loading={loading} />
    </>
  );
};
export default OtpScreen;

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

    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    borderColor: Colors.textInputBorderColor,
  },
  textInputstyle: {
    color: Colors.black,
  },
  numberStyleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    height: 40,
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
    fontWeight: '500',
    alignSelf: 'flex-start',

    //   marginBottom: 8,
    marginLeft: 25,
  },
  resendBtn: {
    color: Colors.brandBlue,
    fontSize: 17,
    fontWeight: '600',
    marginTop: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.textInputBorderColor,
    fontSize: 20,
    color: Colors.brandBlue,
    textAlign: 'center',
    height: responsiveHeight(55),
    width: responsiveWidth(50),
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
  },
  inputCell: {
    borderBottomWidth: 1,
    borderColor: Colors.textInputBorderColor,
  },
});
