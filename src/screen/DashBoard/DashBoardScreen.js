// // src/screen/DashBoardScreen/DashBoardScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native'; // For navigation
// import VehicleProfileCard from './components/VehicleprofileCard';
// import Colors from '../../common/Colors';

// const DashboardScreen = () => { 
//   const [isOnline, setIsOnline] = useState(false); // Track online/offline state

//   const route = useRoute();

//   const navigation = useNavigation();
//   // const { data } = route?.params || {/}; 

//   // const { data } = route.params || {};


//   // useEffect(() => {
//   //   if (data) {
//   //     Alert.alert('Data Received', `Received data: ${JSON.stringify(data)}`);
//   //   } else {
//   //     Alert.alert('No Data', 'No data received');
//   //   }
//   //   console.log('Received data:', data);
//   // }, [data]);
//   return (
//     <View style={styles.container}>
//       {/* Hamburger Menu Button */}
//       <TouchableOpacity
//         onPress={() => navigation.openDrawer()} // Open the drawer
//         style={styles.hamburgerButton}
//       >
//         <View style={{ flexDirection:'row',alignItems:'center',gap:5}} >
//         {/* <Image
//            source={AppImages.hamburgerImage} // Path to your hamburger icon
//           style={styles.hamburgerIcon}
//         /> */}
//        {/* <Image source={AppImages.SplashScreenLogo} style={styles.parcalLogo} resizeMode='contain' /> */}
//        </View>

//       </TouchableOpacity>

//       {/* Dashboard Content */}
//       {/* <Text style={styles.title}>Welcome to the Dashboard</Text> */}
//       <VehicleProfileCard screen={true}/>
//       {/* Add other content here, such as VehicleProfileCard or other components */}

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 5,
//     paddingHorizontal:5,
//     backgroundColor: Colors.homeBackground

//   },
//   hamburgerButton: {
//     position: 'absolute',
//     // top: 40,
//     left: 15,
//     zIndex: 1,
//     flexDirection:'row'
//   },
//   hamburgerIcon: {
//     width: 25,
//     height: 25,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   parcalLogo: {
//     width: 60,
//     height: 60,
//   },
// });

// export default DashboardScreen;

















import Geolocation from 'react-native-geolocation-service';

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VehicleProfileCard from './components/VehicleprofileCard';
import Colors from '../../common/Colors';
import OnlineButton from './components/OnlineButton';
import OfflineButton from './components/OfflineButton';
import { GetDriverCurrentLocation, requestLocationPermission } from '../../common/CommonFunction';
import { hitUpdateDriverStatus } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DashboardScreen = ({ route }) => {

  const [isOnline, setIsOnline] = useState(false); // Track online/offline state
  const navigation = useNavigation();

  const toggleOnlineStatus = async () => {
    try {
      const unparse_driver_data = await AsyncStorage.getItem("driver_data");
      const parse_data = JSON.parse(unparse_driver_data);
      
      setIsOnline(prevStatus => !prevStatus);
      
      if (!isOnline) {
        console.log('parse_data?.id', parse_data);
        
        const { latitude, longitude } = await GetDriverCurrentLocation();
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        
        const param = {
          "driver_id": parse_data?.id,
          "current_lat": latitude,
          "current_long": longitude,
        };
        console.log('param', param);
        
        const res = await hitUpdateDriverStatus(param);
        console.log(res);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  
  useEffect(() => {
    requestLocationPermission()
  
  }, []);
  
  

  return (
    <View style={styles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.hamburgerButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {/* Hamburger icon and logo can be added here */}
        </View>
      </TouchableOpacity>

      {/* Vehicle Profile Card or other dashboard content */}
      <VehicleProfileCard screen={true} isOnline={isOnline} />

      {/* Bottom Toggle Buttons Section */}
      <View style={[
        styles.bottomSection,
        { backgroundColor: !isOnline ? '#393E41' : '#fff' }
      ]}>
        {isOnline ? (
          <OfflineButton toggleStatus={toggleOnlineStatus} />
        ) : (
          <OnlineButton toggleStatus={toggleOnlineStatus} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 5,
    backgroundColor: Colors.homeBackground, // Keeping the main background color
  },
  hamburgerButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    flexDirection: 'row',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // paddingTop:40,
    // paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center', // Center buttons horizontally
    justifyContent: 'center', // Center buttons vertically
  },
});

export default DashboardScreen;


// // src/screen/DashBoardScreen/DashBoardScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native'; // For navigation
// import VehicleProfileCard from './components/VehicleprofileCard';
// import Colors from '../../common/Colors';

// const DashboardScreen = () => { 
//   const [isOnline, setIsOnline] = useState(false); // Track online/offline state

//   const route = useRoute();

//   const navigation = useNavigation();
//   // const { data } = route?.params || {/}; 

//   // const { data } = route.params || {};


//   // useEffect(() => {
//   //   if (data) {
//   //     Alert.alert('Data Received', `Received data: ${JSON.stringify(data)}`);
//   //   } else {
//   //     Alert.alert('No Data', 'No data received');
//   //   }
//   //   console.log('Received data:', data);
//   // }, [data]);
//   return (
//     <View style={styles.container}>
//       {/* Hamburger Menu Button */}
//       <TouchableOpacity
//         onPress={() => navigation.openDrawer()} // Open the drawer
//         style={styles.hamburgerButton}
//       >
//         <View style={{ flexDirection:'row',alignItems:'center',gap:5}} >
//         {/* <Image
//            source={AppImages.hamburgerImage} // Path to your hamburger icon
//           style={styles.hamburgerIcon}
//         /> */}
//        {/* <Image source={AppImages.SplashScreenLogo} style={styles.parcalLogo} resizeMode='contain' /> */}
//        </View>

//       </TouchableOpacity>

//       {/* Dashboard Content */}
//       {/* <Text style={styles.title}>Welcome to the Dashboard</Text> */}
//       <VehicleProfileCard screen={true}/>
//       {/* Add other content here, such as VehicleProfileCard or other components */}

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 5,
//     paddingHorizontal:5,
//     backgroundColor: Colors.homeBackground

//   },
//   hamburgerButton: {
//     position: 'absolute',
//     // top: 40,
//     left: 15,
//     zIndex: 1,
//     flexDirection:'row'
//   },
//   hamburgerIcon: {
//     width: 25,
//     height: 25,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   parcalLogo: {
//     width: 60,
//     height: 60,
//   },
// });

// export default DashboardScreen;


















