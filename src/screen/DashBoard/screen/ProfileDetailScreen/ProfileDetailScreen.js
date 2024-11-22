import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import Colors from '../../../../common/Colors';
import AppImages from '../../../../common/AppImages';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';

const ProfileDetail = ({ route, navigation }) => {
  const { image, name, status } = route?.params;

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Profile Detail',
  //     headerBackTitleVisible: false, // Hides text next to back button
  
  //     headerLeft: () => (
  //       <TouchableOpacity onPress={() => navigation.goBack()}>
  //         <Image source={AppImages.goback} style={{ width: 25, height: 25, marginLeft: 5 }} />
  //       </TouchableOpacity>
  //     ),
  
  //     headerRight: () => (
  //       <TouchableOpacity onPress={() => { /* Handle edit action */ }}>
  //         <Image
  //           source={AppImages.editPen}
  //           resizeMode='contain'
  //           style={{ height: 20, width: 20, marginRight: 10 }} 
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation, name]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Custom Header */}
      <HeaderBackButton headerText={name} onPress={()=>navigation.goBack()}  />

      <View style={styles.container}>
        {/* Profile Image */}
        <Image 
          source={image ? { uri: image } : require('../../../../assets/images/profile.png')} 
          style={styles.fullSizeImage} 
        /> 

        {/* Optional: Show name and status */}
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{name ? name : 'User Name'}</Text>
          {status && <Text style={styles.statusText}>{status}</Text>}
        </View>
      </View>
    </SafeAreaView>
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
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  statusText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 5,
  },
});

export default ProfileDetail;
