import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../../common/AppImages';
import Colors from '../../../common/Colors';
import { errorToast, successToast } from '../../../common/CommonFunction';

const Menu = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);


  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('partner_id');
      successToast('Logged out successfully', 'You will be redirected to login.');
      navigation.replace('Login'); // Navigate to the login screen
    } catch (error) {
      errorToast('Logout Failed', 'An error occurred during logout.');
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.imageContainer}>
          <Image source={AppImages.backWhite} style={styles.closeImage} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Earning')} style={styles.menuItem}>
          <Image source={AppImages.earningImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Earning</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Ledger')} style={styles.menuItem}>
          <Image source={AppImages.ledgerImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Ledger</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Payments')} style={styles.menuItem}>
          <Image source={AppImages.paymentsImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Payments</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Loans')} style={styles.menuItem}>
          <Image source={AppImages.loansImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Loans</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Training')} style={styles.menuItem}>
          <Image source={AppImages.trainingImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Training</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.menuItem}>
          <Image source={AppImages.notificationsImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.menuItem}>
          <Image source={AppImages.profileImage} style={styles.profileImage} resizeMode="contain" />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.menuText}>Profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')} style={styles.menuItem}>
          <Image source={AppImages.privacyPolicyImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={styles.menuItem}>
          <Image source={AppImages.logoutImage} style={styles.profileImage} resizeMode="contain" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setLogoutModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLogout(navigation)} style={styles.modalButton}>
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
    backgroundColor: Colors.brandBlue,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'flex-start',
  },
  closeImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black
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
