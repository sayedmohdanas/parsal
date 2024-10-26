import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../../../common/Colors';
import {FontSizes, Fonts, Spacing} from '../../../../common/Theme';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import {useNavigation} from '@react-navigation/native';
import {hitAddMoney, hitAddWithraw} from '../../../../config/api/api';
import Loading from '../../../../components/Loading/Loading';
import {setwalletBalance} from '../../../../redux/HitApis/HitApiSlice';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddCashScreen = ({route}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [balance, setbalance] = useState(0);
  const dispatch = useDispatch();

  const {screenName} = route?.params || {screenName: 'Add Cash'};

  const handleContinue = async () => {
    setLoading(true);
    try {
      const user = await AsyncStorage.getItem('user');
      const parsed_user = JSON.parse(user);
      const params = {
        driver_id: parsed_user?.payload?.driver_id,
        online: balance,
        cash: 0,
      };
      if (screenName == 'Add Cash') {
        const response = await hitAddMoney(params);
        const newBalance = response?.new_wallet_balance;
        dispatch(setwalletBalance(newBalance));
        // navigation.navigate('Wallet', { newBalance:0 });
        navigation.navigate('Wallet', {newBalance});
      } else if (screenName == 'Withdraw') {
        const response = await hitAddWithraw(params);
        const newBalance = response?.new_wallet_balance;
        dispatch(setwalletBalance(newBalance));
        navigation.navigate('Wallet', {newBalance});
      }
    } catch (error) {
      console.log('error from addOReithraw', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({title: screenName});
  }, [navigation, screenName]);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <View style={{flex: 1, marginHorizontal: responsiveWidth(8)}}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Enter the Amount {balance}</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="₹0"
              keyboardType="numeric"
              placeholderTextColor={'#3D465A'}
              onChangeText={e => {
                setbalance(e);
              }}
            />
          </View>
          <View style={{marginBottom: responsiveWidth(10)}}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AddCashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
    paddingHorizontal: Spacing.small,
    // justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.large,
    marginTop: responsiveHeight(30),
  },
  titleText: {
    fontSize: FontSizes.semiLarge,
    fontWeight: Fonts.bold,
    color: Colors.black,
  },
  amountInput: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: Spacing.medium,
    fontSize: responsiveFontSize(34),
    borderWidth: 0.5,
    borderColor: Colors.grey,
    color: '#3D465A',
    fontWeight: Fonts.bold,
    marginBottom: Spacing.large,
    paddingVertical: responsiveHeight(40), // Adjusted for proper padding
    textAlign: 'center', // Center text alignment
  },
  continueButton: {
    backgroundColor: Colors.brandBlue,
    borderRadius: 10,
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    marginTop: Spacing.large,
    alignSelf: 'center',
    width: '100%',
    marginBottom: Spacing.small,
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: Fonts.semilarge,
  },
});
