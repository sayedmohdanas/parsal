import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../../../../common/Colors';
import AppImages from '../../../../common/AppImages';


const ProfileDetail = ({ route, navigation }) => {
  const { profileImage, driverName } = route.params;    

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: driverName ? driverName.charAt(0).toUpperCase() + driverName.slice(1) : 'Profile Detail',
      headerBackTitleVisible: false, // Hides text next to back button
  
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={AppImages.goback} style={{ width: 25, height: 25, marginLeft: 5 }} />
        </TouchableOpacity>
      ),
  
      headerRight: () => (
        <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
          <Image
            source={AppImages.editPen}
            resizeMode='contain'
            style={{ height: 20, width: 20, marginRight: 10 }} // Adjust margin as needed
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, driverName]);

  return (
    <View style={styles.container}>
     <Image 
        // source={profileImage ? { uri: profileImage } : require('../../../common/AppImages/profile.png')} 
        source={profileImage ? { uri: profileImage } : require('../../../../assets/images/profile.png')} 
        style={styles.fullSizeImage} 
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.homeBackground,
  },
  fullSizeImage: {
    width: '100%',
    height: 400,
    // borderRadius: 150,
  },
});

export default ProfileDetail;
