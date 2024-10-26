import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../../common/Colors';
import {useNavigation} from '@react-navigation/native';
import AppImages from '../../../common/AppImages';
import PartnerAddressCard from '../screen/Profile/PartnerAddressCard';
import ProfileWithStatus from './ProfileWithStatus';
import {useSelector} from 'react-redux';
import {getImageUrl} from '../../../common/CommonFunction';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import {getimage} from '../../../config/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VehicleProfileCard = ({screen = false, isOnline, vehicle_data}) => {
  const driverProfile = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
  const partenrId = useSelector(state => state?.parsalPartner?.partnerId);
  const navigation = useNavigation();
  const name = driverProfile
    ? driverProfile.driver_name?.toLocaleUpperCase() ||
      driverProfile.partner_name?.toLocaleUpperCase()
    : 'No Driver Data';

  const [user_image, setuser_image] = useState();
  const vehicle = {
    vehicle_number: 'UP32HK3432',
    driver: {driver_name: 'John Doe', phone: '1234567890'},
  };
  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);

        // Construct profile image URL based on owner_type
        const isOwnerTypeZero = parsedUser?.payload?.owner_type === 0;

        const profileImageUrl = isOwnerTypeZero
          ? getimage(
              `partners_img/${driverProfile?.partner_id}/drivers/${driverProfile?.id}_${driverProfile?.profile_pic}`,
            )
          : getimage(
              `partners_img/${driverProfile?.id}/${driverProfile?.profile_pic}`,
            );

        // Return the image URL
        return profileImageUrl;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const imgUrl = await fetchUserData();
      if (imgUrl) {
        setuser_image(imgUrl);
      }
    };

    fetchData();
  }, []);

  return (
    <View
      style={[
        styles.card,
        {borderBottomColor: isOnline ? 'green' : 'red', borderBottomWidth: 2}, // Set border color based on online status
      ]}>
      {/* <View style={[isOnline?borderBottomColor:,styles.card]}> */}
      <View style={[styles.topSection, screen ? {justifyContent: ''} : {}]}>
        {/* <Image source={AppImages.profileImage} style={styles.profileImage} />+ */}
        <ProfileWithStatus
          isOnline={isOnline}
          image={user_image}
          name={name}
        />
        <View style={styles.leftSection}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.contactContainer}>
            <Text style={styles.VType}>2 Wheeler </Text>
            <Text style={styles.VType}>{vehicle_data?.vehicle_number}</Text>
          </View>
        </View>
      </View>


      <View>
        {screen && (
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', {vehicle_data})}>
              <Text style={styles.status}>View Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 16,
    marginTop: responsiveHeight(12),
    // marginBottom:12,
    width: '100%',
    // paddingHorizontal: 10,
    borderBottomWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical:8,
    borderBottomColor: 'green',
  },
  topSection: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'column',
  },
  vehicleNumber: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: responsiveFontSize(16),
    color: Colors.black,
    marginTop: responsiveHeight(4),
  },
  VType: {
    fontSize: responsiveFontSize(16),
    color: '#777',
    marginTop: 4,
  },
  contact: {
    fontSize: responsiveFontSize(16),
    color: '#777',
    marginTop: responsiveHeight(4),
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: Colors.brandBlue,
  },
  profileImage: {
    width: responsiveWidth(35),
    height: responsiveHeight(35),
    borderRadius: 17.5,
    marginRight: 10,
  },
});

export default VehicleProfileCard;
