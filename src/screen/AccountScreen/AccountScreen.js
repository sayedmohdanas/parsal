import {
  Alert,
  Image,
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
  errorToast,
  getItem,
  setItem,
  successToast,
} from '../../common/CommonFunction';
import {useDispatch, useSelector} from 'react-redux';
import {
  hitGetDriverDetails,
  hitGetUserOrderStatsApi,
  hitGetWalletBalanceApi,
  hitVerifyEmail,
} from '../../config/api/api';
import {Button, Dialog, Portal} from 'react-native-paper';
import BottomNav from '../../../navigation/BottomNav';
import AppImages from '../../common/AppImages';
import {
  setlivetripmenu,
  setloginuserdetails,
  setOrderData,
  setwalletBalance,
} from '../../redux/HitApis/HitApiSlice';
import {getimage} from '../../config/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const driverProfile = useSelector(
    state => state?.parsalPartner?.logindriverdetails,
  );
  useFocusEffect(
    useCallback(() => {
      get_user_details();
    }, []),
  );

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const [orderStats, setorderstats] = useState([]);
  const fetchData = async () => {
    const getCustomerId = await getItem('customerId');
    const request = {id: getCustomerId};
    dispatch(fetchProfileThunk(request));
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

  const handleVerifyEmail = async () => {
    try {
      const customerId = await getItem('customerId');
      const request = {
        customerId: customerId,
        email: email,
      };

      hitVerifyEmail(request)
        .then(e => {
          if (e.status === 1) {
            successToast('Success', `Email sent to ${email} for verification`);
          }
        })
        .catch(() => {
          errorToast('Error', 'Error occurred while verifying email');
        });
    } catch (err) {
      console.log('Error in verify email API =>', err.message);
    }
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
  const name = driverProfile
    ? driverProfile.driver_name || driverProfile.partner_name
    : 'No Driver Data';
  const email = driverProfile
    ? driverProfile.email || driverProfile.email
    : 'No Driver Data';
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F5F6F7'}}>
        <SafeAreaView
          style={{backgroundColor: '#F5F6F7', flex: 1, marginHorizontal: 16}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
              <Text style={styles.profileTextStyle}>{`Profile`}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfileScreen')}
                activeOpacity={0.8}>
                <View style={styles.editProfileButton}>
                  <Text style={styles.editButtonText}>{'EDIT PROFILE'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{flex: 1, backgroundColor: '#F5F6F7', marginBottom: 10}}>
              <View style={styles.userDetailSection}>
                <View style={styles.udSection1}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    <View style={styles.userTextContainer}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.email}> {email}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleVerifyEmail();
                        }}>
                        <Text style={styles.VerifyEmail}>
                          {'Verify Email ID'}
                        </Text>
                      </TouchableOpacity>
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
                    navigation.navigate('HelpAndSupportMain');
                  }}
                />

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
                    navigation.navigate('HelpAndSupportMain');
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
                    showDialog();
                  }}
                  optionName={'Logout'}
                />
              </View>
            </View>

            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Alert</Dialog.Title>
                <Dialog.Content>
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: Colors.black,
                      fontSize: responsiveFontSize(16),
                    }}>
                    Are you sure you want to logout?
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog} textColor={Colors.brandBlue}>
                    Cancel
                  </Button>
                  <Button
                    onPress={async () => {
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'EnterNumberScreen'}],
                      });
                      dispatch(setUserStatusIdle());
                      await setItem('userLogin', '0');
                      successToast('Success', 'User Logged Out succesfully');
                    }}
                    textColor={Colors.red}>
                    Yes
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
        </SafeAreaView>
      </View>
      <View style={{marginBottom: 10,backgroundColor:"#F5F6F7"}}>
        <BottomNav Setting={true} />
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
});
