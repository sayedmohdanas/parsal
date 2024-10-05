
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import BottomNav from '../../../../../navigation/BottomNav';
import Colors from '../../../../common/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../common/metrices';
import CustomHeader from '../../components/CustomHeader';
import MapView, { Marker } from 'react-native-maps';
import { GetDriverCurrentLocation } from '../../../../common/CommonFunction';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../../components/Loading/Loading';
import LiveTripCustomCard from '../../../DriverEarning/LiveTripCustomCard';

const LiveTripScreen = () => {
    const navigation = useNavigation();
    const [selectedTrip, setSelectedTrip] = useState(1);
    const [driverLocation, setDriverLocation] = useState({ latitude: null, longitude: null });
    const [loading, setLoading] = useState(true); 
    const tripData = [
        {
            id: 1,
            name: "Arshad",
            pickUpAddress: "Nawabganj, Lucknow",
            dropOffAddress: "Hazratganj, Lucknow",
            itemDetails: "Electronics",
            itemWeight: "5 kg",
            statusDate: "17 Sep 2024",
            phoneNumber: "9876543210", 
        },
        {
            id: 2,
            name: "John",
            pickUpAddress: "Indira Nagar, Lucknow",
            dropOffAddress: "Gomti Nagar, Lucknow",
            itemDetails: "Clothing",
            itemWeight: "2 kg",
            statusDate: "18 Sep 2024",
            phoneNumber: "8765432109", 
        },
        {
            id: 3,
            name: "Maria",
            pickUpAddress: "Alambagh, Lucknow",
            dropOffAddress: "K.D. Singh Babu Stadium, Lucknow",
            itemDetails: "Books",
            itemWeight: "3 kg",
            statusDate: "19 Sep 2024",
            phoneNumber: "7654321098", 
        },
    ];
    
    

    useEffect(() => {
        const fetchDriverLocation = async () => {
            try {
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
                            latitude: driverLocation?.latitude || 37.78825, // Fallback values
                            longitude: driverLocation?.longitude || -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
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
                            <TouchableOpacity onPress={() => handleCardClick(1)}>
                                <View style={[styles.tripCard, selectedTrip === 1 && styles.selectedCard]}>
                                    <Text style={styles.tripTime}>12:20 AM</Text>
                                    <Text style={styles.tripName}>Arshad</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleCardClick(2)}>
                                <View style={[styles.tripCard, selectedTrip === 2 && styles.selectedCard]}>
                                    <Text style={styles.tripTime}>01:15 AM</Text>
                                    <Text style={styles.tripName}>John</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleCardClick(3)}>
                                <View style={[styles.tripCard, selectedTrip === 3 && styles.selectedCard]}>
                                    <Text style={styles.tripTime}>02:30 AM</Text>
                                    <Text style={styles.tripName}>Maria</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Card positioned just above bottom navigation */}
                    {selectedTrip && (
                        <View style={styles.cardContainer}>
                            {tripData
                                .filter(trip => trip.id === selectedTrip)
                                .map(trip => (
                                    <LiveTripCustomCard key={trip.id} trip={trip} />
                                ))}
                        </View>
                    )}
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
        paddingHorizontal: responsiveWidth(5),
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tripCard: {
        marginHorizontal: responsiveWidth(3),
        padding: responsiveHeight(2),
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
        fontSize: responsiveFontSize(16),
        color: Colors.black,
    },
    tripName: {
        fontSize: responsiveFontSize(14),
        color: Colors.grey,
        marginTop: responsiveHeight(1),
    },
    cardContainer: {
        position: 'absolute',
        bottom: responsiveHeight(100), // Adjust this value as needed to sit above the BottomNav
        width: '100%',
        paddingHorizontal: responsiveWidth(15),
        zIndex: 10, // Ensure it's above the map
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
    },
});

export default LiveTripScreen;
