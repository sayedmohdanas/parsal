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
import React, {useEffect, useState} from 'react';
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
import {getVehicle, setParentId} from '../../redux/HitApis/HitApiSlice';

const OtpScreen = ({navigation, route}) => {
  const {number} = route?.params;
  const dispatch = useDispatch();
  const userOtp = useSelector(state => state?.parsalPartner?.user?.otp);
  const loading = useSelector(state => state?.parsalPartner?.loading);
  const [otp, setOtp] = useState('');

  // useEffect(() => {
  //   const pId = async () => {
  //     const parent_id = await AsyncStorage.getItem('partner_id');
  //     dispatch(setParentId(parent_id));
  //   };
  //   pId();
  // }, [dispatch]);

  const handleOtp = async () => {

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

      const response = await hitPartnerVerifyOtp(request);

      const partnerId = response?.partnerId;
console.log('response',response);
      if (response.status === 2) {
        if (
          response?.partner?.email != null ||
          ('' && response?.partner?.phone != null) ||
          ''
        ) {
          await AsyncStorage.setItem('partner_id', String(partnerId));
          dispatch(setParentId(partnerId));

          navigation.replace('MyVehicles', {
            partner_id: partnerId,
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
              marginBottom: 80,
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
            {/* <View style={[mystyles.center]}>
        <Image source={AppImages.EnterNumberScreenImg} style={styles.mainImg} resizeMode='contain' />
            </View> */}
            <View style={[{flexDirection: 'row'}, styles.numberStyleContainer]}>
              <View style={[{flexDirection: 'row'}, styles.numberContainer]}>
                <Text style={styles.number}>{number}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // dispatch(setStatusPending());
                  // navigation.replace('Login');
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
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={styles.inputLabel}>ENTER OTP</Text>
            </View>
            <View style={[styles.numberInputContainer]}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="ENTER OTP"
                  style={styles.textInputstyle}
                  value={otp}
                  keyboardType='numeric'
                  placeholderTextColor={Colors.black}
                  onChangeText={e => {
                    setOtp(e);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomButton
                buttonText={'VERIFY'}
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
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,

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
});
