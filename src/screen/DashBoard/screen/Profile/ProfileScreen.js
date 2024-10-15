import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import VehicleProfileCard from '../../components/VehicleprofileCard';
import Colors from '../../../../common/Colors';
import PartnerAddressCard from './PartnerAddressCard';
import AppImages from '../../../../common/AppImages';
import { useNavigation } from '@react-navigation/native';
import BankDetailCard from './ProfileBankDetail/BankDetail';
import LanguagePreferenceCard from './LanguagePreference';
import { useSelector } from 'react-redux';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../common/metrices';
import { hitGetBankAccount } from '../../../../config/api/api';
const ProfileScreen = ({route}) => {
  // const { vehicle_data } = route?.params;
  const vehicle_data={}
  const navigation = useNavigation()
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const [bankAccount,setBankAcccount]=useState({})
   let Owner_type=1
  const driverProfile = useSelector(state => state?.parsalPartner?.driverData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await hitGetBankAccount({ partner_id: 100 });
        setBankAcccount(response?.data)
        console.log('response from get account ===>', response);
      } catch (error) {
        console.error('Error fetching bank account:', error);
      }
    };
  console.log('bank-Account=================>>>>>',bankAccount,)
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <VehicleProfileCard screen={""} vehicle_data={vehicle_data} />
      <PartnerAddressCard
      driverProfile={driverProfile}
        address="123 Main St, Apt 4B, Springfield"
        mobileNumber="+1234567890"
        additionalData="Additional information or notes here."
      />
      <BankDetailCard  bankAccount={bankAccount}/>
      {Owner_type != 0 &&(
      <View style={{ marginTop: responsiveHeight(12), backgroundColor: Colors.white, padding: 16, borderRadius: 5, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={{ color: 'black', fontWeight: '600', fontSize: responsiveFontSize(16) }}>My Vehicle</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyVehicles')}>
          <Image source={AppImages.next} style={{ width: responsiveWidth(30), height: responsiveHeight(30) }} resizeMode='contain' />
        </TouchableOpacity>
      </View>
      )}
      <LanguagePreferenceCard />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 5,
    // gap:15,
    backgroundColor: Colors.homeBackground
  },
  text: {
    fontSize:responsiveFontSize(24),
    fontWeight: 'bold',
    color: 'black'
  },
});
export default ProfileScreen;