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
import { Fonts } from '../../../../common/Theme';
import CustomHeader from '../../components/CustomHeader';
const ProfileScreen = () => {
  const navigation = useNavigation()
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const [bankAccount, setBankAcccount] = useState({})
  let Owner_type = 1
  const partneData = useSelector(state => state?.parsalPartner?.ownerDetail);

  const driverProfile = useSelector(state => state?.parsalPartner?.driverDetail);
  useEffect(() => {
    console.log('profile-data====>>>>', partneData);

    const fetchData = async () => {
      try {
        const response = await hitGetBankAccount({ partner_id: 100 });
        setBankAcccount(response?.data)
        console.log('response from get account ===>', response);
      } catch (error) {
        console.error('Error fetching bank account:', error);
      }

    };
    fetchData();
  }, []);
  return (
    <>
      <CustomHeader screenName={"Profile"} />
      <View style={styles.container}>


        <VehicleProfileCard screen={""} />
        <PartnerAddressCard
          profile={partneData}
          address="123 Main St, Apt 4B, Springfield"
          mobileNumber="+1234567890"
          additionalData="Additional information or notes here."
        />
        <BankDetailCard bankAccount={bankAccount} />
        {Owner_type != 0 && (
          <View style={{ marginTop: responsiveHeight(12), backgroundColor: Colors.white, padding: 16, borderRadius: 5, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{ color: 'black', fontWeight: '600', fontSize: responsiveFontSize(16) }}>My Vehicle</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyVehicles')}>
              <Image source={AppImages.next} style={{ width: responsiveWidth(30), height: responsiveHeight(30) }} resizeMode='contain' />
            </TouchableOpacity>
          </View>
        )}
        <LanguagePreferenceCard />
      </View>
    </>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: Colors.homeBackground
  },
  text: {
    fontSize: responsiveFontSize(24),
    fontWeight: Fonts.bold,
    color: 'black'
  },
});
export default ProfileScreen;