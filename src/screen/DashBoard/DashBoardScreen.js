import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VehicleProfileCard from './components/VehicleprofileCard';
import CustomBottomSheet from '../../components/BottomSheets/CustomBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { showBottomSheet } from '../../redux/bottomSheetSlice/bottomSheetSlice';
import AppImages from '../../common/AppImages';
import { Button } from 'react-native-paper';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.bottomSheet.isVisible);
  const navigation = useNavigation();

  const openAddVehicleSheet = () => {
    Alert.alert('Opening Add Vehicle Sheet');
    dispatch(showBottomSheet({
      contentType: 'addMoreVehicle', 
      snapPoints: ['30%'], 
    }));
  };

  const editBankDetail = () => {
    Alert.alert('Opening Edit Bank Detail Sheet');
    dispatch(showBottomSheet({  
      contentType: 'editBankDetail', 
      snapPoints: ['77%'], 
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.hamburgerButton}
      >
        <Image
          source={AppImages.hamburgerImage} // Path to your hamburger icon
          style={styles.hamburgerIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openAddVehicleSheet}
        style={styles.hamburgerButton}
      >
        <Image
          source={AppImages.hamburgerImage}
          style={styles.hamburgerIcon}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={editBankDetail}
        style={styles.hamburgerButton}
      >
        <Image
          source={AppImages.SplashScreenLogo}
          style={styles.parcalLogo}
        />
      </TouchableOpacity> */}
     <Button onPress={editBankDetail}>open</Button>
      <VehicleProfileCard screen={true} />

      {isVisible && <CustomBottomSheet />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent:'space-between',
    gap:30
  },
  hamburgerButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    flexDirection: 'row'
  },
  hamburgerIcon: {
    width: 25,
    height: 25,
  },
  parcalLogo: {
    width: 60,
    height: 60,
  },
});

export default DashboardScreen;
