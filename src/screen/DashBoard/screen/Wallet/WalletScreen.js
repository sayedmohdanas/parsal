import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../../../common/Colors';
import {Fonts, FontSizes, Spacing} from '../../../../common/Theme';
import AppImages from '../../../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {errorToast} from '../../../../common/CommonFunction';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import { hitGetBankAccount } from '../../../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WalletScreen = ({route}) => {
  const [balance, setBalance] = useState(0);
  const [isHidden, setIsHidden] = useState(true); // State to control visibility
  const [accountNumber,setAccountNumber]=useState('0754234')
  // Generate the masked number: Keep the first two digits, replace the rest with stars
  const maskedNumber =
    accountNumber.slice(0, 2) + '*'.repeat(accountNumber.length - 2);

  // const store_data = useSelector(state => state?.parsalPartner);
  const store_data = useSelector(
    state => state.parsalPartner.wallet_balance?.data?.new_balance || 0,
  );

  const navigation = useNavigation();

//   useEffect(() => {
//     if (route.params?.newBalance) {
//       setBalance(route.params.newBalance);
//     } else {
//       setBalance(store_data);
//     }
// try {
//   const response = await hitGetBankAccount
// } catch (error) {
  
// }
//   }, [route.params?.newBalance, store_data]);

useEffect(() => {
  // Define the async function inside useEffect
  const fetchBankAccountDetails = async () => {
    if (route.params?.newBalance) {
      setBalance(route.params.newBalance);
    } else {
      setBalance(store_data);
    }

    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      const param = {
        partnerId: parsedUser?.payload?.partner_id,
      };
      const response = await hitGetBankAccount({partner_id: param?.partnerId});
      console.log(response,'response---->>')
      if (response) {
        setAccountNumber(response?.data?.account_no || '');
      } else {
        console.error('Error fetching bank account details:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Call the async function
  fetchBankAccountDetails();
}, [route.params?.newBalance, store_data]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackButton
        headerText={'Wallet'}
        onPress={() => navigation.goBack('')}
      />
      <View style={styles.walletcard}>
        <ImageBackground
          source={AppImages.walltetBackground}
          style={{padding: 15}}
          resizeMode="stretch">
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionHistory')}
            style={styles.imageContainer}>
            <Image
              source={AppImages.transectionList}
              style={styles.transactionImage}
            />
          </TouchableOpacity>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              {' '}
              {'₹ ' + (balance || 0).toFixed(2) + ''}
            </Text>
            <View style={styles.walletInfoContainer}>
              <Image
                source={AppImages.my_wallet}
                style={styles.walletIcon}
                tintColor={'rgba(255, 255, 255, 0.6)'}
              />
              <Text style={styles.walletInfoText}>My Wallet Balance</Text>
            </View>
          </View>
          <View style={styles.accountInfoContainer}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountText}>045 524 568</Text>
              <Text style={styles.accountLabel}>Routing</Text>
            </View>
            <View style={styles.accountInfo}>
              <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
                <Text style={[styles.accountText, {letterSpacing: 1}]}>
                  {isHidden ? maskedNumber : accountNumber}
                </Text>
              </TouchableOpacity>
              <Text style={styles.accountLabel}>Account</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('AddCash', {screenName: 'Add Cash',remaningBalance:balance})
              }>
              <Text style={styles.buttonText}>Add Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (balance <= 0) {
                  errorToast('Insufficient balance to cash out.');
                  return; // Add return here to prevent navigation if balance is less than 0
                }
                navigation.navigate('AddCash', {screenName: 'Withdraw',remaningBalance:balance});
              }}>
              <Text style={styles.buttonText}>Cash Out</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
    // paddingHorizontal: Spacing.small,
  },
  walletcard: {
    flex: 0.5,
    borderRadius: responsiveHeight(10),
    marginTop: responsiveHeight(25),
  },
  imageContainer: {
    alignSelf: 'flex-end',
    margin: responsiveWidth(16),
    backgroundColor: 'rgba(120, 122, 243, 1)',
    borderRadius: responsiveHeight(5),
    padding: 4,
    paddingHorizontal:responsiveWidth(6),
    paddingVertical:responsiveHeight(8)

  },
  transactionImage: {
    width: responsiveWidth(24),
    height: responsiveHeight(24),
    resizeMode:'contain'
    
  },
  balanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(25),
  },
  balanceText: {
    fontSize: responsiveFontSize(34),
    fontWeight: Fonts.medium,
    color: Colors.white,
  },
  walletInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.small,
  },
  walletIcon: {
    width: responsiveWidth(12),
    height: responsiveHeight(14),
    resizeMode:'contain'

  },
  walletInfoText: {
    marginLeft: Spacing.small,
    fontSize: FontSizes.small,
    fontWeight: Fonts.semilarge,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  accountInfoContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: responsiveHeight(60),
  },
  accountInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontSize: responsiveFontSize(14),
    fontWeight: Fonts.bold,
    color: Colors.white,
    alignSelf: 'center',
  },
  accountLabel: {
    marginTop: Spacing.small,
    marginLeft: Spacing.small,
    fontSize: FontSizes.small,
    fontWeight: Fonts.semilarge,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(54),
    paddingHorizontal: responsiveWidth(13),
  },
  button: {
    backgroundColor: 'rgba(120, 122, 243, 1)',
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(12),
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.semiLarge,
    fontWeight: Fonts.semilarge,
    borderRadius: 10,
  },
});
