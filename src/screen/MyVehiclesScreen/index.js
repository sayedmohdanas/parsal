// import React, { useEffect, useCallback, useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPartner, getVehicle, setMyVehicleData, setParentId } from '../../redux/HitApis/HitApiSlice'; // Ensure this is the correct path
// import Loading from '../../components/Loading/Loading';
// import VehicleList from './VehicleList';
// import { successToast } from '../../common/CommonFunction';
// import { hitMyVehicle } from '../../config/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Colors from '../../common/Colors';
// import { responsiveHeight, responsiveWidth } from '../../common/metrices';

// const MyVehiclesScreen = ({ navigation }) => {

//   const dispatch = useDispatch();
//   const vehicleData = useSelector(
//     state => state?.parsalPartner?.MyVehicle || [],
//   );

//   const vehicleCount = vehicleData?.length;
//   // const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
//   // const refreshData = async () => {
//   //   try {
//   //     const partnerIds = await AsyncStorage.getItem('partner_id');
//   //     await dispatch(setParentId(partnerId));

//   //     const partnerId = JSON.parse(partnerIds)
//   //     const res = await hitMyVehicle({ partnerId: partnerId });
//   //      await dispatch(getPartner({partner_id:partnerId}))
//   //     // console.log(response,'response=======>>>')
//   //     dispatch(setMyVehicleData(res));
//   //   } catch (error) {
//   //     console.log(error)
//   //   }

//   // };
//   const refreshData = async () => {
//     try {
//       const partnerIds = await AsyncStorage.getItem('partner_id');
//       const partnerId = JSON.parse(partnerIds);
//       console.log('Partner ID:', partnerId);

//       setLoading(true);

//       await dispatch(setParentId(partnerId));

//       const res = await hitMyVehicle({ partnerId });
//       console.log('MyVehicle Response:', res);

//       await dispatch(getPartner({ partner_id: partnerId }));
//       console.log('Partner Response Dispatched');

//       dispatch(setMyVehicleData(res));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);  // Ensure loading state is turned off after the API call
//     }
//   };

//   // Use focus effect to call refreshData when screen gains focus
//   useEffect(() => {
//     const unsubscribeFocus = navigation.addListener('focus', () => {
//       refreshData();
//     });
//     return () => {
//       unsubscribeFocus();
//     };
//   }, [navigation]);

//   //   Show success toast when vehicl e data is loaded
//   useEffect(() => {
//     if (vehicleCount > 0) {
//       successToast(
//         `Successfully loaded ${vehicleCount} vehicle${vehicleCount !== 1 ? 's' : ''
//         }.`,
//       );
//     }
//   }, [vehicleCount]);

//   // Handle card press
//   const handleCardPress = vehicleId => {
//     navigation.navigate('DriverDetail', {
//       v_id: vehicleId,
//       onUpdate: refreshData,
//     });
//   };
//   const handleAddBankPress = () => {
//     navigation.navigate('UpdateBankDetails'); // Replace 'TargetScreen' with your desired screen name
//   };
//   const onPress = () => {
//     Alert.alert('Pay Fees Button Pressed');
//   };
//   useEffect(() => {
//     refreshData();
//   }, [])

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Loading loading={loading} />
//       ) : (
//         <>
//           <VehicleList vehicleData={vehicleData} handleCardPress={handleCardPress} />

//         </>
//       )}

//       <View style={styles.stickyButtonContainer}>
//         {vehicleCount > 0 && (
//           <View style={{
//             backgroundColor: Colors.brandBlue,
//             marginBottom: responsiveHeight(10),
//             paddingVertical: responsiveHeight(6),
//             flexDirection: 'row',
//           }}>
//             <Text
//               style={{
//                 marginLeft: responsiveWidth(16),
//                 textDecorationLine: 'underline',
//                 marginRight: 6,
//                 color: 'white',
//               }}
//               onPress={handleAddBankPress}
//             >
//               ADD Bank Account
//             </Text>
//             <Text style={{ color: 'white' }}>➙</Text>
//           </View>
//         )}

//         <View style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           // borderTopWidth: 1,
//           // borderTopColor: '#d3d3d3',
//           paddingBottom: 16,
//           paddingHorizontal: 16
//         }}>
//           <TouchableOpacity
//             style={styles.anotherVehicleButton}
//             onPress={() => navigation.navigate('VehicleDetail')}>
//             <Text style={styles.anotherVehicleText}>+</Text>
//             <Text style={styles.anotherVehicleText}>Another Vehicle</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.button,
//               { backgroundColor: vehicleCount > 0 ? '#3D40D1' : '#d3d3d3' },
//             ]}
//             onPress={onPress}
//             disabled={vehicleCount === 0}>
//             <Text style={styles.buttonText}>Pay Fees</Text>
//           </TouchableOpacity>
//         </View>

//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//   },
//   stickyButtonContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     // padding: 16,
//     backgroundColor: 'white',
//     borderTopColor: '#d3d3d3',
//     // borderTopWidth: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     elevation: 1,
//     // flexDirection: 'cloum',
//     justifyContent: 'space-between',
//   },
//   button: {
//     paddingVertical: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     width: '49%',
//   },
//   anotherVehicleButton: {
//     // paddingVertical: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // paddingHorizontal: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#3D40D1',
//     width: '49%',
//     gap: 5,
//     flexDirection: 'row',
//   },
//   anotherVehicleText: {
//     color: '#3D40D1',
//     fontSize: 16,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default MyVehiclesScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setLogout,
  setMyVehicleData,
  setParentId,
} from '../../redux/HitApis/HitApiSlice';
import Loading from '../../components/Loading/Loading';
import VehicleList from './VehicleList';
import {hitMyVehicle} from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import CustomHeader from '../DashBoard/components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import AppImages from '../../common/AppImages';
import {successToast} from '../../common/CommonFunction';
import VehicleVerificationCard from './VehicleVerification';

const MyVehiclesScreen = ({route}) => {
  const dispatch = useDispatch();
  const vehicleData = useSelector(state => state?.parsalPartner?.MyVehicle);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigation = useNavigation();
  const vehicleCount = vehicleData?.length;
  const [loading, setLoading] = useState(false);
  const [verifyVisibleCard, setVerifyVisibleCard] = useState(false);

  const refreshData = async () => {
    try {
      const partnerIds = await AsyncStorage.getItem('partner_id');
      const partnerId = JSON.parse(partnerIds);
      await dispatch(setParentId(partnerId));
      hitMyVehicle({partnerId: partnerId})
        .then(res => {
          dispatch(setMyVehicleData(res));
        })
        .catch(err => {
          dispatch(setMyVehicleData([]));
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  // Use focus effect to call refreshData when screen gains focus
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      refreshData();
    });
    return () => {
      unsubscribeFocus();
    };
  }, []);
  // Handle card press
  const handleCardPress = vehicleId => {
    navigation.navigate('DriverDetail', {
      v_id: vehicleId,
      vehicle_num: vehicleData?.vehicles?.filter(
        item => item?.id == vehicleId,
      )[0]?.vehicle_number,
      onUpdate: refreshData,
    });
  };
  const handleAddBankPress = () => {
    navigation.navigate('UpdateBankDetails');
  };
  const onPress = () => {
    Alert.alert('Pay Fees Button Pressed');
  };
  useEffect(() => {
    refreshData();
  }, []);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('partner_id');
      await AsyncStorage.removeItem('partner_name');
      await AsyncStorage.removeItem('user');
      dispatch(setLogout());
      successToast(
        'Logged out successfully',
        'You will be redirected to login.',
      );
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      errorToast('Logout Failed', 'An error occurred during logout.');
    }
  };
  function isAnyVehicleAssignedToDriver(vehicles) {
    if (vehicles) return vehicles?.some(vehicle => vehicle.driver_id !== null);
  }
  const [selected_vehicle, setselected_vehicle] = useState();
  console.log('selected_vehicle', selected_vehicle?.vehicle?.driver);
  return (
    <>
      <View style={{height: responsiveHeight(60)}}>
        <CustomHeader
          leftimage={
            route?.params?.login_user
              ? AppImages.previous
              : AppImages.logoutImage
          }
          rotate={!route?.params?.login_user}
          screenName={'My Vehicles'}
          not_show={route?.params?.login_user ? true : false}
          onPress={() => {
            if (route?.params?.login_user) {
              navigation.navigate('Setting');
            } else {
              setLogoutModalVisible(prev => !prev);
            }
          }}
        />
      </View>
      <View style={styles.container}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <>
            <VehicleList
              vehicleData={vehicleData?.vehicles}
              partnerData={vehicleData?.partner}
              handleCardPress={handleCardPress}
              setVerifyVisibleCard={setVerifyVisibleCard}
              setselected_vehicle={setselected_vehicle}
              selected_vehicle={selected_vehicle}
            />
          </>
        )}
        <View style={styles.stickyButtonContainer}>
          {isAnyVehicleAssignedToDriver(vehicleData?.vehicles) && (
            <View
              style={{
                backgroundColor: Colors.brandBlue,
                marginBottom: responsiveHeight(10),
                paddingVertical: responsiveHeight(6),
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  marginLeft: responsiveWidth(16),
                  textDecorationLine: 'underline',
                  marginRight: 6,
                  color: 'white',
                }}
                onPress={handleAddBankPress}>
                ADD Bank Account
              </Text>
              <Text style={{color: 'white'}}>➙</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}>
            <TouchableOpacity
              style={styles.anotherVehicleButton}
              onPress={() => navigation.navigate('VehicleDetail')}>
              <Text style={styles.anotherVehicleText}>+</Text>
              <Text style={styles.anotherVehicleText}>Add Vehicle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: vehicleCount > 0 ? '#3D40D1' : '#d3d3d3'},
              ]}
              onPress={onPress}
              disabled={vehicleCount === 0}>
              <Text style={styles.buttonText}>Pay Fees</Text>
            </TouchableOpacity>
          </View>
        </View>
        {verifyVisibleCard && (
          <VehicleVerificationCard
            reject_Data={[
              ...(selected_vehicle?.vehicle?.documents
                ?.filter(item => item?.status == 2)
                ?.map(doc => ({...doc, docType: 'vehicle'})) || []),
              ...(selected_vehicle?.partner_data?.documents
                ?.filter(item => item?.status == 2)
                ?.map(doc => ({...doc, docType: 'partner'})) || []),
              ...(selected_vehicle?.vehicle?.driver
                ?.isApproved_driving_license == 2
                ? [
                    {
                      doc_name: 'Driving License',
                      doc_pic: selected_vehicle?.driver?.driving_license_pic,
                      docType: 'driver',
                    },
                  ]
                : []),
            ]}
            selected_vehicle={selected_vehicle}
            verifyVisibleCard={verifyVisibleCard}
            setVerifyVisibleCard={setVerifyVisibleCard}
            refreshData={refreshData}
          />
        )}
      </View>
      {/* < VehicleVerificationCard/> */}

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
                onPress={() => handleLogout()}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* < VehicleVerificationCard/> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#f0f0f0',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopColor: '#d3d3d3',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    elevation: 1,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 4,
    width: '49%',
  },
  anotherVehicleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3D40D1',
    width: '49%',
    gap: 5,
    flexDirection: 'row',
  },
  anotherVehicleText: {
    color: '#3D40D1',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export default MyVehiclesScreen;
