import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../../../../common/Colors';
import AppImages from '../../../../common/AppImages';


const ProfileDetail = ({ route, navigation }) => {
  const { image, name ,status} = route.params;    

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Profile Detail',
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
            style={{ height: 20, width: 20, marginRight: 10 }} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, name]);

  return (
    <View style={styles.container}>
     <Image 
    
        source={image ? { uri: image } : require('../../../../assets/images/profile.png')} 
        // source={image ? image: require('../../../../assets/images/profile.png')} 
        style={styles.fullSizeImage} 
      /> 
      {/* {status === 1 ? (
        <Image
        source={image ? image: require('../../../../assets/images/profile.png')} 
          style={styles.fullSizeImage}
        />
      ) : (
        <Image
        source={image ? { uri: image } : require('../../../../assets/images//profile.png')} 
        style={styles.fullSizeImage}
        />
      )} */}
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
