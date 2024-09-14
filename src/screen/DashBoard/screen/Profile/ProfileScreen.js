import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import VehicleProfileCard from '../../components/VehicleprofileCard';
import Colors from '../../../../common/Colors';
import PartnerAddressCard from './PartnerAddressCard';
import AppImages from '../../../../common/AppImages';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <VehicleProfileCard screen={""}/>
      <PartnerAddressCard
                address="123 Main St, Apt 4B, Springfield"
                mobileNumber="+1234567890"
                additionalData="Additional information or notes here."
            />

            <View style={{backgroundColor:Colors.white,padding:8,borderRadius:5,width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
              <Text style={{color:'black',fontWeight:'bold',fontSize:15}}>My Vehicle</Text>
              <Image source={AppImages.next} style={{ width: 30, height: 30 }} resizeMode='contain' />

            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
     marginTop:2,
     paddingHorizontal:5,
     backgroundColor: Colors.homeBackground

},
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'

  },
});

export default ProfileScreen;
