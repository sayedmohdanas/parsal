import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AppImages from '../src/common/AppImages';
import Colors from '../src/common/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../src/common/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getimage} from '../src/config/url';
const BottomNav = props => {
  const navigation = useNavigation();
  const orderData = useSelector(state => state.parsal_store?.orderData);
  const driverProfile = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
  const [user_image, setuser_image] = useState();
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
        setuser_image(profileImageUrl);

        return profileImageUrl;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const fetchData = async () => {
    const imgUrl = await fetchUserData();
    if (imgUrl) {
      setuser_image(imgUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.header_center}
            onPress={() => {
              navigation.navigate('Trip');
            }}>
            <View style={[styles.header, {paddingTop: 5}]}>
              {props.Trip ? (
                <Image
                  source={AppImages.TripIconB}
                  resizeMode={'contain'}
                  style={{
                    height: responsiveHeight(24),
                    width: responsiveWidth(24),
                    tintColor: props.home ? '' : '',
                  }}
                />
              ) : (
                <Image
                  source={AppImages.TripIcon}
                  resizeMode={'contain'}
                  style={{
                    height: responsiveHeight(24),
                    width: responsiveWidth(24),
                    tintColor: props.home ? ' ' : '',
                  }}
                />
              )}
            </View>
            <View
              style={[
                styles.header,
                {
                  borderBottomWidth: props.home ? 0 : 0,
                  borderColor: props.home ? Colors.brandBlue : null,
                },
              ]}>
              <Text style={styles.menu_txt}>{'Trips'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header_center}
              onPress={() => {
                if (orderData) {
                  navigation.navigate('TripScreen');
                } else {
                  navigation.navigate('OrderScreen');
                }
              }}>
              <View style={[styles.header, {paddingTop: 5}]}>
                {props.order ? (
                  <>
                    <View style={{position: 'relative'}}>
                      {orderData && (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('TripScreen');
                          }}
                          style={{
                            position: 'absolute',
                            height: 8,
                            width: 8,
                            borderRadius: 5,
                            backgroundColor: 'red',
                            zIndex: 1000,
                            right: 0,
                          }}
                        />
                      )}
                      <Image
                        source={AppImages.activeOrder}
                        resizeMode={'contain'}
                        style={{
                          height: responsiveHeight(24),
                          width: responsiveWidth(24),
                          tintColor: props.home ? '' : '',
                        }}
                      />
                    </View>
                  </>
                ) : (
                  <View style={{position: 'relative'}}>
                    {orderData && (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('OrderScreen');
                        }}
                        style={{
                          position: 'absolute',
                          height: 8,
                          width: 8,
                          borderRadius: 5,
                          backgroundColor: 'red',
                          zIndex: 1000,
                          right: 0,
                        }}
                      />
                    )}
                    <Image
                      source={AppImages.OrderIcon}
                      resizeMode={'contain'}
                      style={{
                        height: responsiveHeight(24),
                        width: responsiveWidth(24),
                        tintColor: props.home ? ' ' : '',
                      }}
                    />
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.header,
                  {
                    borderBottomWidth: props.job ? 3 : 0,
                    borderColor: Colors.brandBlue,
                  },
                ]}>
                <Text style={styles.menu_txt}>{'Order'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header_center}
              onPress={() => {
                navigation.navigate('Earning');
              }}>
              <View style={[styles.header, {paddingTop: 5}]}>
                {/* <Image source={AppImages.PaymentIcon} resizeMode={'contain'} style={{ height: responsiveHeight(24), width: responsiveWidth(24), tintColor: props.payment ? Colors.brandBlue : null }} /> */}
                {props.Earning ? (
                  <Image
                    source={AppImages.EarningIconB}
                    resizeMode={'contain'}
                    style={{
                      height: responsiveHeight(24),
                      width: responsiveWidth(24),
                      tintColor: props.home ? '' : '',
                    }}
                  />
                ) : (
                  <Image
                    source={AppImages.EarningIcon}
                    resizeMode={'contain'}
                    style={{
                      height: responsiveHeight(24),
                      width: responsiveWidth(24),
                      tintColor: props.home ? ' ' : '',
                    }}
                  />
                )}
              </View>
              <View
                style={[
                  styles.header,
                  {
                    borderBottomWidth: props.profile ? 3 : 0,
                    borderColor: Colors.brandBlue,
                  },
                ]}>
                <Text style={styles.menu_txt}>{'Earning'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header_center}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <View style={[styles.header, {paddingTop: 5}]}>
                <Image
                  source={
                    props.account ? AppImages.activeUser : AppImages.UserIcon
                  }
                  resizeMode={'contain'}
                  style={{
                    height: responsiveHeight(24),
                    width: responsiveWidth(24),
                    tintColor: props.payment ? Colors.brandBlue : null,
                  }}
                />
                {/* <Image
                  source={{uri: user_image}}
                  resizeMode={'contain'}
                  style={{
                    height: responsiveHeight(25),
                    width: responsiveHeight(25),
                    borderRadius: responsiveHeight(25),
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                  }}
                /> */}
              </View>
              <View
                style={[
                  styles.header,
                  {
                    borderBottomWidth: props.profile ? 3 : 0,
                    borderColor: Colors.brandBlue,
                  },
                ]}>
                <Text style={styles.menu_txt}>{'Account'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default BottomNav;
const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(62),
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(16),
    borderRadius: 40,
    // elevation: 7,
    // shadowColor: Colors.black,
    // iOS Shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.15, // Shadow opacity to match your color's alpha
    shadowRadius: 20, // Shadow radius
    // Android Shadow
    elevation: 8, // Elevation controls shadow on Android
  },
  menu_txt: {
    fontSize: responsiveFontSize(11),
    color: '#000000',
    // fontFamily: Font.txt_normal
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    marginTop: responsiveHeight(2),
  },
  header_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
