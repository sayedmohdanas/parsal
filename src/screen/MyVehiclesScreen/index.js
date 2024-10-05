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



import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPartner, getVehicle, setMyVehicleData, setParentId } from '../../redux/HitApis/HitApiSlice'; // Ensure this is the correct path
import Loading from '../../components/Loading/Loading';
import VehicleList from './VehicleList';
import { successToast } from '../../common/CommonFunction';
import { hitMyVehicle } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../common/Colors';
import { responsiveHeight, responsiveWidth } from '../../common/metrices';

const MyVehiclesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const vehicleData = useSelector(
    state => state?.parsalPartner?.MyVehicle || [],
  ); 
  const vehicleCount = vehicleData?.length;
  // const partnerId = useSelector(state => state?.parsalPartner?.partnerId);

  const [loading, setLoading] = useState(false); // State to manage loading
  
  const refreshData = async () => {
    try {
      const partnerIds = await AsyncStorage.getItem('partner_id');
      console.log(partnerIds,'prent===>>>');
      const partnerId =  JSON.parse(partnerIds)
      console.log(partnerId,'partneriddddd===>>>>>>>>>>><<<<>>>');
      
      await dispatch(setParentId(partnerId));

      const res = await hitMyVehicle({ partnerId: partnerId });
      dispatch(setMyVehicleData(res));
    } catch (error) {
      console.log(error)
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

  // Show success toast when vehicle data is loaded
  useEffect(() => {
    if (vehicleCount > 0) {
      successToast(
        `Successfully loaded ${vehicleCount} vehicle${vehicleCount !== 1 ? 's' : ''}.`,
      );
    }
  }, [vehicleCount]);

  // Handle card press
  const handleCardPress = vehicleId => {
    navigation.navigate('DriverDetail', {
      v_id: vehicleId,
      onUpdate: refreshData,
    });
  };

  const handleAddBankPress = () => {
    navigation.navigate('UpdateBankDetails'); // Replace 'TargetScreen' with your desired screen name
  };

  const onPress = () => {
    Alert.alert('Pay Fees Button Pressed');
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <VehicleList vehicleData={vehicleData} handleCardPress={handleCardPress} />
        </>
      )}

      <View style={styles.stickyButtonContainer}>
        {vehicleCount > 0 && (
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
            <Text style={{ color: 'white' }}>➙</Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity
            style={styles.anotherVehicleButton}
            onPress={() => navigation.navigate('VehicleDetail')}>
            <Text style={styles.anotherVehicleText}>+</Text>
            <Text style={styles.anotherVehicleText}>Another Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: vehicleCount > 0 ? '#3D40D1' : '#d3d3d3' },
            ]}
            onPress={onPress}
            disabled={vehicleCount === 0}>
            <Text style={styles.buttonText}>Pay Fees</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    shadowOffset: { width: 0, height: -2 },
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
});

export default MyVehiclesScreen;
