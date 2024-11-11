import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Children, useCallback, useEffect, useState} from 'react';
import Colors from '../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Data from './Component/Data';
import ProfileScreenOptions from '../../components/ProfileScreenOptions/ProfileScreenOptions';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  GetDriverCurrentLocation,
  errorToast,
  getItem,
  setItem,
  successToast,
} from '../../common/CommonFunction';
import {useDispatch, useSelector} from 'react-redux';
import {
  hitGetDriverDetails,
  hitGetLiveOrderApi,
  hitGetPartner,
  hitGetUserOrderStatsApi,
  hitGetWalletBalanceApi,
  hitUpdateDriverStatus,
  hitVerifyEmail,
} from '../../config/api/api';
import {Button, Dialog, Portal} from 'react-native-paper';
import BottomNav from '../../../navigation/BottomNav';
import AppImages from '../../common/AppImages';
import {
  setlivetripmenu,
  setloginuserdetails,
  setLogout,
  setnextOrderData,
  setOrderData,
  setupdate_order,
  setwalletBalance,
} from '../../redux/HitApis/HitApiSlice';
import {getimage} from '../../config/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../DashBoard/components/CustomHeader';

const AccountScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
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
              if (res?.ongoingOrder?.length == 0) {
                setshow_live(false);
                dispatch(setlivetripmenu(false));
                return;
              } else {
                setshow_live(true);
                dispatch(setlivetripmenu(true));

                const {order_otp, ...restOrderData} =
                  res?.ongoingOrder[0] || {};
                const modifiedOrderData = {...restOrderData, otp: order_otp};

                dispatch(setOrderData(modifiedOrderData));

                if (res?.ongoingOrder[0]?.is_arrived_pickup) {
                  dispatch(setupdate_order(modifiedOrderData));
                }
                if (res?.ongoingOrder?.length > 1) {
                  const {order_otp, ...restOrderData} =
                    res?.ongoingOrder[1] || {};
                  const modifiedOrderData = {
                    ...restOrderData,
                    otp: order_otp,
                  };
                  dispatch(setnextOrderData(modifiedOrderData));
                }
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
                if (res?.ongoingOrder?.length == 0) {
                  setshow_live(false);
                  dispatch(setlivetripmenu(false));
                  return;
                } else {
                  setshow_live(true);
                  dispatch(setlivetripmenu(true));

                  const {order_otp, ...restOrderData} =
                    res?.ongoingOrder[0] || {};
                  const modifiedOrderData = {...restOrderData, otp: order_otp};

                  dispatch(setOrderData(modifiedOrderData));

                  if (res?.ongoingOrder[0]?.is_arrived_pickup) {
                    dispatch(setupdate_order(modifiedOrderData));
                  }
                  if (res?.ongoingOrder?.length > 1) {
                    const {order_otp, ...restOrderData} =
                      res?.ongoingOrder[1] || {};
                    const modifiedOrderData = {
                      ...restOrderData,
                      otp: order_otp,
                    };
                    dispatch(setnextOrderData(modifiedOrderData));
                  }
                  // navigation.navigate('DriverMap');
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
  const driverProfile = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      get_user_details();
    }, []),
  );

  const [orderStats, setorderstats] = useState([]);
  const fetchData = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const request = {
      id:
        parsedUser?.payload?.owner_type == 1
          ? '1'
          : parsedUser?.payload?.driver_id,
      type: 1,
    };
    hitGetUserOrderStatsApi(request)
      .then(res => {
        setorderstats(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, dispatch, navigation]);
  const [user_image, setuser_image] = useState();
  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const isOwnerTypeZero = parsedUser?.payload?.owner_type == 0;
        const profileImageUrl = isOwnerTypeZero
          ? getimage(
              `partners_img/${driverProfile?.partner_id}/drivers/${driverProfile?.id}_${driverProfile?.profile_pic}`,
            )
          : getimage(
              `partners_img/${parsedUser?.payload?.partner_id}/${user_details?.profile_pic}`,
            );
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
  }, [user_details]);
  const name =
    parse_data?.payload?.owner_type == 0
      ? user_details?.driver_name
      : user_details?.partner_name;
  const email =
    parse_data?.payload?.owner_type == 0
      ? user_details?.email
      : user_details?.email;
  const handleLogout = async () => {
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

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F5F6F7'}}>
        <View
          style={{
            height: responsiveHeight(60),
          }}>
          <CustomHeader screenName={"Account"} showSplash={true} />
        </View>
        <SafeAreaView
          style={{backgroundColor: '#F5F6F7', flex: 1, marginHorizontal: 16}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={styles.profileSection}>
              <Text style={styles.profileTextStyle}>{`Profile`}</Text>
          
            </View> */}

            <View
              style={{flex: 1, backgroundColor: '#F5F6F7', marginBottom: 10}}>
              <View style={styles.userDetailSection}>
                <View style={styles.udSection1}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {!user_image ? (
                      <Image
                        source={AppImages.man}
                        style={{
                          height: responsiveHeight(70),
                          width: responsiveHeight(70),
                          borderRadius: responsiveHeight(70),
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: user_image,
                        }}
                        style={{
                          height: responsiveHeight(70),
                          width: responsiveHeight(70),
                          borderRadius: responsiveHeight(70),
                        }}
                      />
                    )}
                    <View style={styles.userTextContainer}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.email}> {email}</Text>
                      {/* <TouchableOpacity
                        onPress={() => {
                          handleVerifyEmail();
                        }}>
                        <Text style={styles.VerifyEmail}>
                          {'Verify Email ID'}
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
                <View style={styles.udSection2}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('GstDetailScreen');
                    }}
                    activeOpacity={0.7}>
                    <View style={styles.gstButtonContainer}>
                      <Text style={styles.gstButtonText}>
                        {'Edit GST Details'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.dataContainer}>
                    <Data
                      number={orderStats?.totalOrderCount || 0}
                      dataName={'Shipments'}
                    />
                    <Data
                      number={orderStats?.totalOrderCount || 0}
                      dataName={'Transactions'}
                    />
                    <Data
                      number={'₹' + orderStats?.totalPaidAmount || 0}
                      dataName={'Spending'}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.optionSection}>
                <Text style={styles.optionName}>{'Wallet'}</Text>
                <ProfileScreenOptions
                  Icon={AppImages.wallet_menu}
                  optionName={'Wallet Balance'}
                  onPress={() => {
                    navigation.navigate('Wallet');
                  }}
                  walletBalance={store_data.wallet_balance?.new_wallet_balance}
                />

                <Text style={styles.optionName}>{'Other'}</Text>
                <ProfileScreenOptions
                  Icon={AppImages.live}
                  optionName={'Live Order'}
                  onPress={() => {
                    if (show_live) {
                      navigation.navigate('DriverMap');
                    }
                  }}
                />
                {parse_data?.payload?.owner_type != 0 && (
                  <ProfileScreenOptions
                    Icon={AppImages.addvehicle}
                    optionName={'Manage Vehicles'}
                    onPress={() => {
                      navigation.navigate('MyVehicles', {
                        login_user: 1,
                      });
                    }}
                  />
                )}

                <ProfileScreenOptions
                  Icon={AppImages.earningImage}
                  optionName={'Earning'}
                  onPress={() => {
                    navigation.navigate('Earning');
                  }}
                />
                <ProfileScreenOptions
                  Icon={AppImages.ledgerImage}
                  optionName={'Ledger'}
                  onPress={() => {
                    navigation.navigate('HelpAndSupportMain');
                  }}
                />
                <ProfileScreenOptions
                  Icon={AppImages.paymentsImage}
                  optionName={'Payment'}
                  onPress={() => {
                    navigation.navigate('HelpAndSupportMain');
                  }}
                />
                <ProfileScreenOptions
                  Icon={AppImages.trainingImage}
                  optionName={'Traning'}
                  onPress={() => {
                    // navigation.navigate('HelpAndSupportMain');
                  }}
                />
                {/* <Text style={styles.optionName}>{'Address'}</Text>
                <ProfileScreenOptions
                  Icon={AppImages.savedAddress}
                  optionName={'Saved & Address'}
                  onPress={() => {
                    navigation.navigate('SaveAddress');
                  }}
                /> */}
                <Text style={styles.optionName}>{'Support & Legal'}</Text>

                <ProfileScreenOptions
                  Icon={AppImages.helpIcon}
                  optionName={'Help & Support'}
                  onPress={() => {
                    navigation.navigate('HelpAndSupport');
                  }}
                />
                <ProfileScreenOptions
                  Icon={AppImages.privacyPolicyImage}
                  optionName={'Privacy Policy'}
                  onPress={() => {
                    navigation.navigate('TermsCondition', {
                      id: 3,
                      heading: 'Privacy Policy',
                    });
                  }}
                />

                <ProfileScreenOptions
                  Icon={AppImages.termsAndCondition}
                  optionName={'Terms & Conditions'}
                  onPress={() => {
                    navigation.navigate('TermsCondition', {
                      id: 1,
                      heading: 'Terms & Condition',
                    });
                  }}
                />

                <Text style={styles.optionName}>{'Settings'}</Text>
                <ProfileScreenOptions
                  Icon={AppImages.languageIcon}
                  optionName={'Choose Language'}
                  onPress={() => {}}
                />
                <ProfileScreenOptions
                  Icon={AppImages.logoutIcon}
                  onPress={() => {
                    setLogoutModalVisible(prev => !prev);
                  }}
                  optionName={'Logout'}
                />
              </View>
            </View>

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
          </ScrollView>
        </SafeAreaView>
      </View>
      <View style={{marginBottom: 10, backgroundColor: '#F5F6F7'}}>
        <BottomNav Setting={true} account={true} />
      </View>
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  profileTextStyle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '700',
    color: Colors.black,
  },
  editProfileButton: {
    height: responsiveHeight(20),
    width: responsiveWidth(82),
    borderRadius: 6,
    backgroundColor: '#F6F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5
  },
  editButtonText: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: Colors.brandBlue,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(12),
    flex: 1,
  },
  userDetailSection: {
    height: responsiveHeight(205),
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: responsiveHeight(15),
    paddingHorizontal: 10,
  },
  udSection1: {
    flex: 1,
    // backgroundColor: 'green',
    marginTop: 10,
  },
  udSection2: {
    flex: 1.4,
    // backgroundColor: 'brown',
  },
  man: {
    height: responsiveHeight(58),
    width: responsiveHeight(58),
    borderRadius: responsiveHeight(58),
  },
  name: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    color: Colors.black,
    marginLeft: responsiveWidth(2),
  },
  email: {
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
    color: Colors.grey,
  },
  VerifyEmail: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    color: Colors.brandBlue,
    marginTop: 5,
  },
  userTextContainer: {
    marginLeft: responsiveWidth(15),
  },
  gstButtonText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    color: Colors.white,
  },
  gstButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(35),
    borderRadius: 8,
    backgroundColor: Colors.brandBlue,
    marginTop: 4,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(13),
    marginHorizontal: 5,
  },
  optionName: {
    fontSize: responsiveFontSize(15),
    fontWeight: '600',
    color: Colors.black,
    marginTop: responsiveHeight(18),
    marginLeft: 3,
  },
  optionSection: {
    // backgroundColor: 'yellow',
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
