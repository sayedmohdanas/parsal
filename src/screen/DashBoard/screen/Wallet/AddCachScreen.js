import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../../common/Colors';
import { FontSizes, Fonts, Spacing } from '../../../../common/Theme';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import { useNavigation } from '@react-navigation/native';
import { hitAddMoney, hitAddWithraw } from '../../../../config/api/api';
import Loading from '../../../../components/Loading/Loading';
import { setwalletBalance } from '../../../../redux/HitApis/HitApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import { errorToast, successToast } from '../../../../common/CommonFunction';
import { useEffect, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';


const AddCashScreen = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const store_data = useSelector(state => state?.parsalPartner);
  const fetchedData = store_data?.wallet_balance;

  // Safely clone the data object to avoid direct mutation
  // const updatedData = {
  //   ...fetchedData,
  //   data: {
  //     ...fetchedData?.data,
  //     new_balance: fetchedData?.data?.new_balance + 90, // Update the value
  //   },
  // };

  // // Updated logic
  // const updatedNewBalance = updatedData.data.new_balance + 100;

  // // Dispatch updated data if necessary
  // console.log(updatedData.data.new_balance); // This will now correctly log 90


  // Set default value for remaningBalance
  const { screenName, remaningBalance = 0 } = route?.params || {
    screenName: 'Add Cash',
    remaningBalance: 0,
  };

  // const handleContinue = async () => {
  //   setLoading(true);
  //   try {
  //     const user = await AsyncStorage.getItem('user');
  //     const parsed_user = JSON.parse(user);
  //     const params = {
  //       driver_id: parsed_user?.payload?.driver_id,
  //       online: Number(balance),
  //       cash: 0,
  //     };
  //     if (screenName === 'Add Cash') {
  //       const response = await hitAddMoney(params);
  //       const newBalance = response?.new_wallet_balance;
  //       dispatch(setwalletBalance(newBalance));
  //       navigation.navigate('Wallet', {newBalance});
  //       successToast('Success', 'Cash deposited successfully');
  //     } else if (screenName === 'Withdraw') {
  //       const response = await hitAddWithraw(params);
  //       const newBalance = response?.new_wallet_balance;
  //       dispatch(setwalletBalance(newBalance));
  //       navigation.navigate('Wallet', {newBalance});
  //       successToast('Success', 'Cash withdrawn successfully');
  //     }
  //   } catch (error) {
  //     console.error('Error from Add/Withdraw:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleContinue = async () => {
    if (screenName === 'Add Cash') {
      const options = {
        description: 'Add cash to wallet',
        image: 'https://drive.google.com/file/d/1SExuiUtMBtQj_KZot2-5TpzX5jUrW9fe/view?usp=sharing', // Optional company logo
        currency: 'INR',
        key: 'rzp_test_XZXlIZEFXyAYyU', // Replace with your Razorpay key
        amount: Number(balance) * 100, // Razorpay expects the amount in paisa
        name: 'PARSAL',
        prefill: {
          email: 'example@example.com', // Optional prefilled data
          contact: '9999999999',
          name: 'Test User',
        },
        theme: { color: Colors.brandBlue },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          // On Success
          const paymentId = data.razorpay_payment_id;
          successToast('Payment Successful', `Payment ID: ${paymentId}`);

          // Update balance in backend
          setLoading(true);
          try {
            const user = await AsyncStorage.getItem('user');
            const parsed_user = JSON.parse(user);
            const params = {
              driver_id: parsed_user?.payload?.driver_id,
              online: Number(balance), // Amount added
              cash: 0,
            };

            const response = await hitAddMoney(params); // Backend API to add money
            // const newBalance = response?.new_wallet_balance;
            // const fetchedData = store_data.wallet_balance;
            // const updatedNewBalance = fetchedData?.data.new_balance + 100; // Update logic here
            // fetchedData.data.new_balance = updatedNewBalance;
            const updatedData = {
              ...fetchedData,
              data: {
                ...fetchedData?.data,
                new_balance: fetchedData?.data?.new_balance + Number(balance), // Update the value
              },
            };
            dispatch(setwalletBalance(updatedData));
            navigation.navigate('Wallet', { updatedData });
            successToast('Success', 'Cash added to wallet successfully');
          } catch (error) {
            console.error('Error adding money:', error);
          } finally {
            setLoading(false);
          }
        })
        .catch((error) => {
          // On Failure
          console.error(`Payment Error: ${error.code} | ${error.description}`);
          errorToast('Something Went Wrong', 'Try Again');
        });
    } else if (screenName === 'Withdraw') {
      // Withdraw logic remains the same
      if (Number(balance) > remaningBalance) {
        setErrorMessage('Insufficient Balance');
        return;
      }

      setLoading(true);
      try {
        const user = await AsyncStorage.getItem('user');
        const parsed_user = JSON.parse(user);
        const params = {
          driver_id: parsed_user?.payload?.driver_id,
          online: 0,
          cash: Number(balance), // Amount withdrawn
        };

        const response = await hitAddWithraw(params); // Backend API for withdrawal
        // const newBalance = response?.new_wallet_balance;
        // dispatch(setwalletBalance(newBalance));
        const updatedData = {
          ...fetchedData,
          data: {
            ...fetchedData?.data,
            new_balance: fetchedData?.data?.new_balance - Number(balance), // Update the value
          },
        };
        dispatch(setwalletBalance(updatedData));
        navigation.navigate('Wallet', { updatedData });
        // navigation.navigate('Wallet', { newBalance });
        successToast('Success', 'Cash withdrawn successfully');
      } catch (error) {
        console.error('Error withdrawing money:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleAmountChange = (amount) => {
  //   setBalance(amount);
  //   if (screenName === 'Withdraw' && Number(amount) > remaningBalance) {
  //     setErrorMessage('Insufficient Balance');
  //   } else {
  //     setErrorMessage('');
  //   }
  // };
  const handleAmountChange = (amount) => {
    setBalance(amount);
    if (Number(amount) <= 0) {
      setErrorMessage('Please enter a valid amount.');
    } else if (screenName === 'Withdraw' && Number(amount) > remaningBalance) {
      setErrorMessage('Insufficient Balance');
    } else {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: screenName });
  }, [navigation, screenName]);

  return (
    <>
      <HeaderBackButton
        headerText={'Manage Wallet'}
        onPress={() => navigation.goBack('')}
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <>
            <View style={{ flex: 1, marginHorizontal: responsiveWidth(8) }}>
              {screenName === 'Withdraw' && (
                <>
                  {/* Display Remaining Balance for Withdraw */}
                  <Text
                    style={{
                      fontSize: FontSizes.medium,
                      fontWeight: Fonts.semiLarge,
                      color: Colors.black,
                      marginBottom: Spacing.medium,
                      textAlign: 'center',
                    }}>
                    Balance: ₹{Number(remaningBalance).toFixed(2)}
                  </Text>
                </>
              )}

              {/* Enter Amount Section */}
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Enter the Amount</Text>
              </View>
              <TextInput
                style={styles.amountInput}
                placeholder="₹0"
                keyboardType="numeric"
                placeholderTextColor={'#3D465A'}
                onChangeText={handleAmountChange}
              />

              {/* Display Error Message */}
              {screenName === 'Withdraw' && errorMessage ? (
                <Text
                  style={{
                    fontSize: FontSizes.small,
                    color: Colors.red,
                    textAlign: 'center',
                    marginBottom: Spacing.large,
                  }}>
                  {errorMessage}
                </Text>
              ) : null}
            </View>

            {/* Continue Button */}
            <View style={{ marginBottom: responsiveWidth(10) }}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (!!errorMessage || Number(balance) <= 0) && { backgroundColor: Colors.grey },
                ]}
                onPress={handleContinue}
                disabled={!!errorMessage || Number(balance) <= 0}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>

            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default AddCashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
    paddingHorizontal: Spacing.small,
  },
  remainingBalanceText: {
    fontSize: responsiveFontSize(18),
    color: Colors.black,
    fontWeight: Fonts.bold,
    textAlign: 'center',
    marginVertical: Spacing.medium,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.large,
    marginTop: responsiveHeight(5),
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
  errorText: {
    fontSize: responsiveFontSize(14),
    color: Colors.red,
    textAlign: 'center',
    marginBottom: Spacing.large,
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
