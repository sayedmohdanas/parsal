import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import VehicleProfileCard from '../../components/VehicleprofileCard';
import Colors from '../../../../common/Colors';
import PartnerAddressCard from './PartnerAddressCard';
import AppImages from '../../../../common/AppImages';
import { useNavigation } from '@react-navigation/native';
import BankDetailCard from './ProfileBankDetail/BankDetail';
import LanguagePreferenceCard from './LanguagePreference';

const ProfileScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <VehicleProfileCard screen={""} />
      <PartnerAddressCard
        address="123 Main St, Apt 4B, Springfield"
        mobileNumber="+1234567890"
        additionalData="Additional information or notes here."
      />

      <BankDetailCard />

      <View style={{ marginTop: 12, backgroundColor: Colors.white, padding: 16, borderRadius: 5, width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>

        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>My Vehicle</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyVehicles')}>
          <Image source={AppImages.next} style={{ width: 30, height: 30 }} resizeMode='contain' />
        </TouchableOpacity>
      </View>

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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'

  },
});

export default ProfileScreen;
