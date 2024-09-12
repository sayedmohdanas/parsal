import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AppImages from '../../../common/AppImages';
import Colors from '../../../common/Colors';

const Menu = ({ navigation }) => {
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
    borderRadius: 17.5,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

export default Menu;
