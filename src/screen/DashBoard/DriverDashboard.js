
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
// import LiveTripCustomCard from '../../../DriverEarning/LiveTripCustomCard';
// import DestinationSection from '../../../DriverMapScreen/DestinationSection';
import Colors from '../../common/Colors';
import BottomNav from '../../../navigation/BottomNav';
import CustomHeader from './components/CustomHeader';
import Loading from '../../components/Loading/Loading';
import DriverArriveCard from '../DriverEarning/DriverArriveCard';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import { GetDriverCurrentLocation } from '../../common/CommonFunction';

const DriverDashboard = () => {
    const navigation = useNavigation();
    const [selectedTrip, setSelectedTrip] = useState(1);
    const [driverLocation, setDriverLocation] = useState({ latitude: null, longitude: null });
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchDriverLocation = async () => {
            try {
                // const { latitude, longitude } = await GetDriverCurrentLocation();
                const { latitude, longitude } = await GetDriverCurrentLocation();
                setDriverLocation({ latitude, longitude });
            } catch (error) {
                console.error("Error fetching driver location: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverLocation();
    }, [navigation]);

    const handleCardClick = (tripId) => {
        setSelectedTrip(tripId);
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <Loading loading={loading} /> // my custom loading component
            ) : (
                <>
                    <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={{
                             // Approximate center of India
                            latitudeDelta: 0.1,  // Adjusted to show the whole country
                            longitudeDelta: 0.1, 
                            // latitude: 20.5937, // Approximate center of India
                            // longitude: 78.9629,
                            latitude: driverLocation?.latitude || 37.78825, // Fallback values
                            longitude: driverLocation?.longitude || -122.4324,
                            // latitudeDelta: 0.0922,
                            // longitudeDelta: 0.0421,
                        }}
                    >
                        {/* Marker for the driver's current location */}
                        {driverLocation.latitude && driverLocation.longitude && (
                            <Marker
                                coordinate={{ latitude: driverLocation.latitude, longitude: driverLocation.longitude }}
                                title={"Driver Location"}
                            />
                        )}
                    </MapView>

                    {/* Header and Trip details */}
                    <View style={styles.content}>
                        <CustomHeader screenName={"Live Trips"} />
                        <View style={styles.tripContainer}>
                            <View >
                                <View style={[styles.tripCard]}>
                                    <Text style={styles.tripTime}>Booking Count</Text>
                                    <Text style={styles.tripName}>2</Text>
                                </View>
                            </View>

                            <View >
                                <View style={[styles.tripCard]}>
                                    <Text style={styles.tripTime}>Operator Bill</Text>
                                    <Text style={styles.tripName}>₹ 160.50</Text>
                                </View>
                            </View>

                        
                        </View>
                    </View>

                    {/* Card positioned just above bottom navigation */}
                    {/* {selectedTrip && (
                        <View style={styles.cardContainer}>
                            {tripData
                                .filter(trip => trip.id === selectedTrip)
                                .map(trip => (
                                    // <LiveTripCustomCard key={trip.id} trip={trip} />
                                    <DriverArriveCard key={trip.id} trip={trip} />
                                    // <DestinationSection/>
                                ))}
                        </View>
                    )} */}
                </>
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNavContainer}>
                <BottomNav Trip={true} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    tripContainer: {
        borderTopWidth: 1,
        paddingHorizontal: 5,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tripCard: {
        marginHorizontal:3,
        padding:2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
    },
    selectedCard: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.brandBlue,
    },
    tripTime: {
        fontSize:12,
        color: Colors.black,
        marginTop:10,
        fontWeight:'400'
    },
    tripName: {
        fontSize:16,
        fontWeight:'600',
        
        lineHeight:19.36
,        color:'#000000',
        marginTop:10,
        marginBottom:8
    },
    cardContainer: {
        position: 'absolute',
        bottom:96,
        width: '100%',
        paddingHorizontal:15,
        zIndex: 10, 
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 13,
        left: 0,
        right: 0,
    },
});

export default DriverDashboard;
