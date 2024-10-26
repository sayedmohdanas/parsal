import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../../common/AppImages';
import Colors from '../../../common/Colors';
import {
  GetDriverCurrentLocation,
  errorToast,
  successToast,
} from '../../../common/CommonFunction';
import {useDispatch, useSelector} from 'react-redux';
import {
  setLogout,
  setOrderData,
  setlivetripmenu,
  setloginuserdetails,
  setupdate_order,
  setwalletBalance,
} from '../../../redux/HitApis/HitApiSlice';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import {
  hitGetDriverDetails,
  hitGetLiveOrderApi,
  hitGetPartner,
  hitGetWalletBalanceApi,
  hitUpdateDriverLocationApi,
  hitUpdateDriverStatus,
} from '../../../config/api/api';
import {getimage} from '../../../config/url';
import {useFocusEffect} from '@react-navigation/native';

const Menu = ({navigation, owner = ''}) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = async navigation => {
    try {
      const unparse_driver_data = await AsyncStorage.getItem('user');
      const parse_data = JSON.parse(unparse_driver_data);
      if (parse_data?.payload?.owner_type != 1) {
        const {latitude, longitude} = await GetDriverCurrentLocation();
        const param = {
          driver_id: parse_data?.payload?.driver_id,
          current_lat: latitude,
          current_long: longitude,
          working_status: 0,
        };
        const res = await hitUpdateDriverStatus(param);
      }
      await AsyncStorage.removeItem('partner_id');
      await AsyncStorage.removeItem('partner_name');
      await AsyncStorage.removeItem('user');
      dispatch(setLogout());
      successToast(
        'Logged out successfully',
        'You will be redirected to login.',
      );
      navigation.replace('Login'); // Navigate to the login screen
    } catch (error) {
      console.error(error);
      errorToast('Logout Failed', 'An error occurred during logout.');
    }
  };
  const [user_details, setuser_details] = useState([]);
  const store_data = useSelector(state => state?.parsalPartner);
  const [parse_data, setparsed_data] = useState([]);
  const [show_live, setshow_live] = useState(false);
  const get_user_details = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsed_user = JSON.parse(user);
    setparsed_data(parsed_user);
    if (parsed_user?.payload?.owner_type == 0) {
      hitGetDriverDetails({ids: [parsed_user?.payload?.driver_id]})
        .then(res => {
          setuser_details(res?.drivers[0]);
          dispatch(setloginuserdetails(res?.drivers[0]));
          const param = {driver_id: parsed_user?.payload?.driver_id};

          // parsed_user?.payload?.driver_id};
          hitGetWalletBalanceApi(param)
            .then(res => {
              dispatch(setwalletBalance(res));
            })
            .catch(err => {
              console.error(err);
            });
          const parameter = {
            user_id: parsed_user?.payload?.driver_id,
            type: 'driver',
          };
          hitGetLiveOrderApi(parameter)
            .then(res => {
              if (res?.status == 0) {
                setshow_live(false);
                dispatch(setlivetripmenu(false));
              } else {
                dispatch(setlivetripmenu(true));
                setshow_live(true);
                dispatch(setOrderData(res?.ongoingOrder));
                if (res?.ongoingOrder?.is_arrived_pickup) {
                  dispatch(setupdate_order(res?.ongoingOrder));
                }
                // navigation.navigate('DriverMap');
              }
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      hitGetPartner({
        partner_id: parsed_user?.payload?.partner_id,
      })
        .then(res => {
          setuser_details(res?.partner);
          dispatch(setloginuserdetails(res?.partner));
          if (parsed_user?.payload?.owner_type == 2) {
            const param = {driver_id: parsed_user?.payload?.driver_id};

            // parsed_user?.payload?.driver_id};
            hitGetWalletBalanceApi(param)
              .then(res => {
                dispatch(setwalletBalance(res));
              })
              .catch(err => {
                console.error(err);
              });
            const parameter = {
              user_id: parsed_user?.payload?.driver_id,
              type: 'driver',
            };
            hitGetLiveOrderApi(parameter)
              .then(res => {
                if (res?.status == 0) {
                  setshow_live(false);
                  dispatch(setlivetripmenu(false));
                } else {
                  setshow_live(true);
                  dispatch(setlivetripmenu(true));

                  dispatch(setOrderData(res?.ongoingOrder));
                  if (res?.ongoingOrder?.is_arrived_pickup) {
                    dispatch(setupdate_order(res?.ongoingOrder));
                  }
                  navigation.navigate('DriverMap');
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
  useFocusEffect(
    useCallback(() => {
      get_user_details();
    }, []), // Empty dependency array to run only when the page is focused
  );
  console.log('parse_data?.payload?.owner_type',store_data?.show_livetripe_menu);
  return (
    <>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.imageContainer}>
          <Image source={AppImages.backWhite} style={styles.closeImage} />
        </TouchableOpacity> */}
        <TouchableHighlight
          onPress={() => navigation.navigate('Profile')}
          underlayColor={'none'}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <ProfileWithStatus /> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: user_details?.driver_name
                  ? getimage(
                      'partners_img/' +
                        user_details?.partner_id +
                        '/drivers/' +
                        user_details?.id +
                        '_' +
                        user_details?.profile_pic,
                    )
                  : getimage(
                      'partners_img/' +
                        user_details?.id +
                        '/' +
                        user_details?.profile_pic,
                    ),
              }}
              style={{
                height: responsiveHeight(70),
                width: responsiveHeight(70),
                borderRadius: responsiveHeight(70),
                marginRight: responsiveWidth(10),
              }}
            />
            <View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: responsiveFontSize(14),
                  fontWeight: '700',
                }}>
                {user_details?.driver_name?.toLocaleUpperCase() ||
                  user_details?.partner_name?.toLocaleUpperCase()}
              </Text>
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: responsiveFontSize(12),
                  fontWeight: '400',
                }}>
                {user_details?.phone}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.menuContainer}>
        {(parse_data?.payload?.owner_type == 0 ||
          parse_data?.payload?.owner_type == 2) && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Wallet')}
            style={styles.menuItem}>
            <Image source={AppImages.wallet_menu} style={styles.profileImage} />
            <Text style={styles.menuText}>Wallet Balance</Text>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: responsiveFontSize(20),
                  color: Colors.grey,
                  fontWeight: '800',
                  textAlign: 'right',
                }}>
                {'₹' +
                  (store_data.wallet_balance?.new_wallet_balance || 0) +
                  ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {owner && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('Trip')}
              style={styles.menuItem}>
              <Image
                source={AppImages.dash}
                style={[styles.profileImage,{tintColor:Colors.brandBlue}]}
                // style={{height: 30, width: 30}}
                resizeMode="contain"
              />
              <Text style={styles.menuText}>DashBoard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyVehicles')}
              style={styles.menuItem}>
              <Image
                source={AppImages.MyVehcileIcon}
                style={styles.profileImage}
                resizeMode="contain"
              />
              <Text style={styles.menuText}>My Vehicles</Text>
            </TouchableOpacity>
          </>
        )}
        {(parse_data?.payload?.owner_type == 0 ||
          parse_data?.payload?.owner_type == 2) &&
          store_data?.show_livetripe_menu && (
            <TouchableOpacity
              onPress={() => navigation.navigate('DriverMap')}
              style={styles.menuItem}>
              <Image source={AppImages.live} style={styles.profileImage} />
              <Text style={styles.menuText}>Live Order</Text>
            </TouchableOpacity>
          )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Earning')}
          style={styles.menuItem}>
          <Image source={AppImages.earningImage} style={styles.profileImage} />
          <Text style={styles.menuText}>Earning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => navigation.navigate('Ledger')}
          style={styles.menuItem}>
          <Image source={AppImages.ledgerImage} style={styles.profileImage} />
          <Text style={styles.menuText}>Ledger</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Payments')}
          style={styles.menuItem}>
          <Image source={AppImages.paymentsImage} style={styles.profileImage} />
          <Text style={styles.menuText}>Payments</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Loans')}
          style={styles.menuItem}>
          <Image source={AppImages.loansImage} style={styles.profileImage} />
          <Text style={styles.menuText}>Loans</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Training')}
          style={styles.menuItem}>
          <Image source={AppImages.webinar} style={styles.profileImage} />
          <Text style={styles.menuText}>Training</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.menuItem}>
          <Image
            source={AppImages.notificationsImage}
            style={styles.profileImage}
          />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.menuItem}>
          <Image source={AppImages.profileImage} style={styles.profileImage} />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.menuText}>Profile</Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('HelpandSupport')}
          style={styles.menuItem}>
          <Image source={AppImages.help} style={styles.profileImage} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TermsCondition')}
          style={styles.menuItem}>
          <Image source={AppImages.compliant} style={styles.profileImage} />
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TermsCondition')}
          style={styles.menuItem}>
          <Image source={AppImages.terms} style={styles.profileImage} />
          <Text style={styles.menuText}>Terms & Condition</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
          style={styles.menuItem}>
          <Image
            source={AppImages.logoutImage}
            style={styles.profileImage}
            resizeMode="contain"
          />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setLogoutModalVisible(false)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingVertical: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(20),
  },
  imageContainer: {
    alignItems: 'flex-start',
  },
  closeImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
    resizeMode: 'contain',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(12),
    padding: responsiveWidth(12),
    // backgroundColor:'white',
  },
  menuText: {
    fontSize: responsiveFontSize(15),
    fontWeight: '400',
    color: Colors.black,
  },
  profileImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
    // borderRadius: 30,
    marginRight: responsiveHeight(10),
    resizeMode: 'contain',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: responsiveWidth(300),
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    marginBottom: 20,
    color: Colors.black,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: Colors.brandBlue,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Menu;
