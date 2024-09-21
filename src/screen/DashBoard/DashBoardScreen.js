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








import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VehicleProfileCard from './components/VehicleprofileCard';
import Colors from '../../common/Colors';
import OnlineButton from './components/OnlineButton';
import OfflineButton from './components/OfflineButton';
import { GetDriverCurrentLocation, GetDriverCurrentLocation2, requestLocationPermission } from '../../common/CommonFunction';
import { hitUpdateDriverStatus } from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DashboardScreen = ({ route }) => {



  const [isOnline, setIsOnline] = useState(false); // Track online/offline state
  const navigation = useNavigation();

  const toggleOnlineStatus = async () => {
    try {
      const unparse_driver_data = await AsyncStorage.getItem("driver_data");
      const parse_data = JSON.parse(unparse_driver_data);
      console.log(parse_data.driver_id,'parss---');

      
      
      setIsOnline(prevStatus => !prevStatus);
      if (!isOnline) {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          "driver_id": parse_data?.driver_id,
          "current_lat": latitude,
          "current_long": longitude,
          "working_status": 1
        };
        const res = await hitUpdateDriverStatus(param);
      } else {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        const param = {
          "driver_id": parse_data?.driver_id,
          "current_lat": latitude,
          "current_long": longitude,
          "working_status": 0
        };
        const res = await hitUpdateDriverStatus(param);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const [driverData, setDriverData] = useState(null); 
  useEffect(() => {
    // Define an inner async function
    const fetchDriverData = async () => {
        try {
            // Request location permission
            const locationGranted = await requestLocationPermission();
            if (!locationGranted) {
                console.error('Location permission denied');
                return;
            }

            // Fetch data from AsyncStorage
            const unparsedDriverData = await AsyncStorage.getItem("driver_data");
            if (unparsedDriverData) {
                const parsedData = JSON.parse(unparsedDriverData);
                setDriverData(parsedData); 
                 console.log(parsedData,'dataaaa')
                // Set the parsed data to state
            } else {
                console.warn("No driver data found in AsyncStorage");
            }
        } catch (error) {
            console.error("Error fetching driver data:", error);
        }
    };

    // Call the async function inside useEffect
    fetchDriverData();
}, []); // Empty dependency array ensures this runs only once

  ;
  

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
      <VehicleProfileCard screen={true} isOnline={isOnline} vehicle_data={driverData} />

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


















