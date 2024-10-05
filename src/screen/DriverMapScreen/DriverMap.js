import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppImages from '../../common/AppImages';
import ActionButton from './ActionButtons';
import ProfileSection from './ProfileSecrion';
import { GetDriverCurrentLocation } from '../../common/CommonFunction';
import MapViewDirections from 'react-native-maps-directions';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import database from '@react-native-firebase/database';
import Colors from '../../common/Colors';
const DriverMapScreen = ({ route }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [latLOng, setLatLong] = useState({ latitude: '', longitude: '' })
  const [mapRegion, setMapRegion] = useState(null);

  const data = route?.params || {};
  const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

  const orderData = useSelector(state => state?.parsalPartner?.orderData || null);
  const update_order = useSelector(state => state?.parsalPartner?.update_order || null);
// console.log('orderData',update_order?.is_arrived_pickup);

  // console.log(orderData?.newOrder?.driver_id,'orderda---idddtafrommascreen')
  const driverID = orderData?.newOrder?.driver_id

  const isFocused = useIsFocused();

  useEffect(() => {
    let intervalId;

    const fetchLocation = async () => {
      try {
        const { latitude, longitude } = await GetDriverCurrentLocation();
        setLatLong({ latitude, longitude });

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,  // Adjust for zoom level
          longitudeDelta: 0.01,
        });

        database()
          .ref(`/drivers/${driverID}/location`)
          .set({
            latitude,
            longitude,
            timestamp: database?.ServerValue.TIMESTAMP,
          });

        console.log({ latitude, longitude }, 'Location sent to Firebase');
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (isFocused) {
      fetchLocation();
      intervalId = setInterval(fetchLocation, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFocused]);





  const handleAccept = () => {
    setShowButtons(false);
    console.log('Request Accepted');
  };
  const handleReject = () => {
    setShowButtons(false);
    console.log('Request Rejected');
  };

  const origin = {
    // latitude: Number(data.drop_lat),
    // longitude: Number(data.drop_long),

    latitude: Number(latLOng?.latitude ? latLOng?.latitude : data?.drop_lat),
    longitude: Number(latLOng?.longitude ? latLOng?.longitude : data?.drop_long),
  };

  const destination = {
    latitude:update_order?.is_arrived_pickup ? Number(data?.drop_lat): Number(data?.picklat),
    longitude:update_order?.is_arrived_pickup ?Number(data?.drop_long):  Number(data?.pickLong),
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // initialRegion={{
        //   ...origin,
        //   // latitude:Number(latLOng.latitude),
        //   // longitude:Number(latLOng.longitude),
        //   latitudeDelta: 0.01,  // Adjust for zoom level
        //   longitudeDelta: 0.01,
        // }}
        initialRegion={mapRegion} 
      >
        {/* Marker for current location */}
        <Marker
          coordinate={origin}
        // image={AppImages.rideBike}
        // style={{ width: 70, height: 70 }}

        >
          <Image
            source={AppImages.rideBike}
            style={{ width: 40, height: 40 }}
             resizeMode="contain"
          />
        </Marker>


        {/* Marker for pickup location */}
        <Marker
          coordinate={destination}
        />

        {/* Display directions from current location to pickup location */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeWidth={4}
          strokeColor={Colors.brandBlue}
        />
      </MapView>
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <ActionButton title="Accept" color="green" onPress={handleAccept} />
          <ActionButton title="Reject" color="red" onPress={handleReject} />
        </View>
      ) : (
        <ProfileSection  data={ orderData}/>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
});
export default DriverMapScreen;






// import React, { useEffect, useState } from 'react';
// import { Image, StyleSheet, View } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import AppImages from '../../common/AppImages';
// import ActionButton from './ActionButtons';
// import ProfileSection from './ProfileSecrion';
// import { GetDriverCurrentLocation } from '../../common/CommonFunction';
// import MapViewDirections from 'react-native-maps-directions';
// import { useIsFocused } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import database from '@react-native-firebase/database';
// import Colors from '../../common/Colors';

// const DriverMapScreen = ({ route }) => {
//   const [showButtons, setShowButtons] = useState(false);
//   const [latLOng, setLatLong] = useState({ latitude: '', longitude: '' });
//   const [heading, setHeading] = useState(0); // To store rotation angle

//   const data = route?.params || {};
//   const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

//   const orderData = useSelector(state => state?.parsalPartner?.orderData || null);
//   const update_order = useSelector(state => state?.parsalPartner?.update_order || null);
//   const driverID = orderData?.newOrder?.driver_id;
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     let intervalId;

//     const fetchLocation = async () => {
//       try {
//         const { latitude, longitude } = await GetDriverCurrentLocation();
//         setLatLong({ latitude, longitude });

//         // Calculate heading based on current and previous location
//         if (latLOng.latitude && latLOng.longitude) {
//           const headingValue = calculateHeading(
//             { latitude: latLOng.latitude, longitude: latLOng.longitude },
//             { latitude, longitude }
//           );
//           setHeading(headingValue);
//         }

//         database()
//           .ref(`/drivers/${driverID}/location`)
//           .set({
//             latitude,
//             longitude,
//             timestamp: database?.ServerValue.TIMESTAMP,
//           });

//         console.log({ latitude, longitude }, 'Location sent to Firebase');
//       } catch (error) {
//         console.error('Error fetching location:', error);
//       }
//     };

//     if (isFocused) {
//       fetchLocation();
//       intervalId = setInterval(fetchLocation, 5000);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isFocused, latLOng]);

//   const calculateHeading = (startCoords, endCoords) => {
//     const lat1 = startCoords.latitude;
//     const lon1 = startCoords.longitude;
//     const lat2 = endCoords.latitude;
//     const lon2 = endCoords.longitude;

//     const toRadians = (deg) => deg * (Math.PI / 180);
//     const y = Math.sin(toRadians(lon2 - lon1)) * Math.cos(toRadians(lat2));
//     const x =
//       Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
//       Math.sin(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.cos(toRadians(lon2 - lon1));
//     const heading = (Math.atan2(y, x) * 180) / Math.PI;
//     return heading;
//   };

//   const handleAccept = () => {
//     setShowButtons(false);
//     console.log('Request Accepted');
//   };

//   const handleReject = () => {
//     setShowButtons(false);
//     console.log('Request Rejected');
//   };

//   const origin = {
//     latitude: Number(latLOng?.latitude ? latLOng?.latitude : data?.drop_lat),
//     longitude: Number(latLOng?.longitude ? latLOng?.longitude : data?.drop_long),
//   };

//   const destination = {
//     latitude: update_order?.is_arrived_pickup
//       ? Number(data?.drop_lat)
//       : Number(data?.picklat),
//     longitude: update_order?.is_arrived_pickup
//       ? Number(data?.drop_long)
//       : Number(data?.pickLong),
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           ...origin,
//           latitudeDelta: Number(latLOng?.latitude),
//           longitudeDelta: Number(latLOng?.longitude),
//         }}
//       >
//         {/* Marker for current location */}
//         <Marker coordinate={origin}>
//           <Image
//             source={AppImages.rideBike}
//             style={[
//               styles.bikeImage,
//               { transform: [{ rotate: `${heading}deg` }] }, // Apply rotation based on heading
//             ]}
//             resizeMode="contain"
//           />
//         </Marker>

//         {/* Marker for pickup location */}
//         <Marker coordinate={destination} />

//         {/* Display directions from current location to pickup location */}
//         <MapViewDirections
//           origin={origin}
//           destination={destination}
//           apikey={GOOGLE_API_KEY}
//           strokeWidth={4}
//           strokeColor={Colors.brandBlue}
//         />
//       </MapView>
//       {showButtons ? (
//         <View style={styles.buttonContainer}>
//           <ActionButton title="Accept" color="green" onPress={handleAccept} />
//           <ActionButton title="Reject" color="red" onPress={handleReject} />
//         </View>
//       ) : (
//         <ProfileSection data={orderData} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   bikeImage: {
//     width: 40,
//     height: 40,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 50,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
// });

// export default DriverMapScreen;
