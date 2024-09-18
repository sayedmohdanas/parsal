import React, {useEffect, useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getVehicle, setMyVehicleData} from '../../redux/HitApis/HitApiSlice'; // Ensure this is the correct path
import Loading from '../../components/Loading/Loading';
import VehicleList from './VehicleList';
import {successToast} from '../../common/CommonFunction';
import {hitMyVehicle} from '../../config/api/api';

const MyVehiclesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const vehicleData = useSelector(
    state => state?.parsalPartner?.MyVehicle || [],
  );
  const loading = useSelector(state => state?.parsalPartner?.loading || false);
  const vehicleCount = vehicleData?.length;
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  const refreshData = async () => {
    const res = await hitMyVehicle({partnerId: partnerId});
    dispatch(setMyVehicleData(res));
  };

  // Use focus effect to call refreshData when screen gains focus
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      refreshData();
    });
    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  //   Show success toast when vehicle data is loaded
  useEffect(() => {
    if (vehicleCount > 0) {
      successToast(
        `Successfully loaded ${vehicleCount} vehicle${
          vehicleCount !== 1 ? 's' : ''
        }.`,
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

  const onPress = () => {
    Alert.alert('Pay Fees Button Pressed');
  };

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
        <TouchableOpacity
          style={styles.anotherVehicleButton}
          onPress={() => navigation.navigate('VehicleDetail')}>
          <Text style={styles.anotherVehicleText}>+</Text>
          <Text style={styles.anotherVehicleText}>Another Vehicle</Text>
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
    padding: 16,
    backgroundColor: '#fff',
    borderTopColor: '#d3d3d3',
    // borderTopWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    elevation: 1,
    flexDirection: 'row',
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
    // paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
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
