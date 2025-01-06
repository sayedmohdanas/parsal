// import React from 'react';
// import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
// import Colors from '../../../../common/Colors';
// import AppImages from '../../../../common/AppImages';
// import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';

// const ProfileDetail = ({ route, navigation }) => {
//   const { image, name, status } = route?.params;
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* Custom Header */}
//       <HeaderBackButton headerText={name} onPress={()=>navigation.goBack()}  />

//       <View style={styles.container}>
//         {/* Profile Image */}
//         <Image 
//           source={image ? { uri: image } : require('../../../../assets/images/profile.png')} 
//           style={styles.fullSizeImage} 
//         /> 

//         <View style={styles.textContainer}>
//           {/* <Text style={styles.nameText}>{name ? name : 'User Name'}</Text> */}
//           {status && <Text style={styles.statusText}>{status}</Text>}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.homeBackground,
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: 400,
//   },
//   textContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   nameText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.primaryText,
//   },
//   statusText: {
//     fontSize: 16,
//     color: Colors.secondaryText,
//     marginTop: 5,
//   },
// });

// export default ProfileDetail;

import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Colors from '../../../../common/Colors';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';

const ProfileDetail = ({ route, navigation }) => {
  const { image, name, status } = route?.params;

  // Shared value for scale
  const scale = useSharedValue(1);

  // Animated style for the image
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Handle pinch gestures
  const onPinchGesture = (event) => {
    if (event.nativeEvent.scale) {
      scale.value = event.nativeEvent.scale;
    }
  };

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      scale.value = withTiming(1, { duration: 300 }); // Reset scale after gesture ends
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Custom Header */}
      <HeaderBackButton headerText={name} onPress={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Pinch Gesture Handler */}
        <PinchGestureHandler
          onGestureEvent={onPinchGesture}
          onHandlerStateChange={onPinchStateChange}
        >
          <Animated.Image
            source={image ? { uri: image } : require('../../../../assets/images/profile.png')}
            style={[styles.fullSizeImage, animatedStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>

        <View style={styles.textContainer}>
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
  statusText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 5,
  },
});

export default ProfileDetail;
