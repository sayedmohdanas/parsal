import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Slick from 'react-native-slick';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';

const { height } = Dimensions.get('window');

const Earning = () => {
    // Sample profile data with earnings
    const profileData = [
        { id: 1, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar', earning: 50, distance: 7.5 },
        { id: 2, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines', earning: 6229, distance: 8.5 },
        { id: 3, name: 'Sachin ', location: 'Mumbai', place: 'Bandra', earning: 1524, distance: 10.8 },
        { id: 4, name: 'Msd', location: 'Charbagh', place: 'Khurram Namar', earning: 40, distance: 9.5 },
        { id: 5, name: 'Virat singh', location: 'Delhi', place: 'Civil Lines', earning: 70, distance: 7.7 },
        { id: 6, name: 'Sachin Thakur', location: 'Mumbai', place: 'Bandra', earning: 60, distance: 8.3 },
        // Add more items if necessary...
    ];

    // Sample date data
    const dateData = [
        { date: '12 Sept 24', profiles: [1, 2] },
        { date: '18 Sept 24', profiles: [3, 4] },
        { date: '14 Sept 24', profiles: [5, 6] },
    ];

    const [currentDateIndex, setCurrentDateIndex] = useState(0);

    // Calculate total earnings for the selected date
    const getTotalEarnings = () => {
        const selectedProfiles = dateData[currentDateIndex].profiles;
        const earnings = profileData
            .filter(profile => selectedProfiles.includes(profile.id))
            .reduce((sum, profile) => sum + profile.earning, 0);
        return earnings;
    };

    const renderProfileItem = ({ item }) => (
        <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Image source={AppImages.profileImage} style={styles.profileImage} />
                    <Text style={styles.name}>{item.name}</Text>
                </View>
            </View>
            <View style={styles.profileText}>
                <Text style={styles.place}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginRight: 3 }}>from:</Text>
                    {item.place}
                </Text>
                <Text style={styles.place}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginRight: 3 }}>to:</Text>
                    {item.location}
                </Text>


            </View>

            <View style={styles.earningContainer}>
                <Text style={styles.earningText}>{item.distance}km</Text>

                <Text style={styles.earningText}>₹{item.earning}</Text>
            </View>
        </View>
    );

    // Handle date change
    const handlePrevDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : dateData.length - 1));
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex < dateData.length - 1 ? prevIndex + 1 : 0));
    };

    // Get profiles for the selected date
    const selectedProfiles = profileData.filter(profile => dateData[currentDateIndex].profiles.includes(profile.id));

    return (
        <View style={styles.container}>
            {/* Slider Section */}
            <View style={styles.sliderContainer}>
                <TouchableOpacity style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }} onPress={handlePrevDate}>

                    <Image source={AppImages.previous} style={{ width: 30, height: 30 }} resizeMode='contain' />
                </TouchableOpacity>
                <Text style={styles.dateText}>{dateData[currentDateIndex].date}</Text>
                <TouchableOpacity style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }} onPress={handleNextDate}>
                    <Image source={AppImages.next} style={{ width: 30, height: 30 }} resizeMode='contain' />
                </TouchableOpacity>
            </View>


            <View style={styles.earningDisplay}>
                <Text style={styles.earningAmount}>₹{getTotalEarnings()}</Text>
            </View>


            <FlatList
                data={selectedProfiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProfileItem}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Colors.homeBackground
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    sliderButton: {
        fontSize: 40,
        color: Colors.black,
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
    },
    earningDisplay: {
        alignItems: 'center',
        marginBottom:30

    },
    earningTitle: {
        fontSize: 18,
        color: Colors.black,
    },
    earningAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
    },
    profileCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 10,
        marginBottom: 3
    },
    profileInfo: {
        flexDirection: 'row',
        flex: 0.8
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    profileText: {
        justifyContent: 'center',
        flex: 1.2
    },
    name: {
        fontSize: 12,
        color: Colors.black,
        marginTop: 5,
        textAlign: 'center'
    },
    place: {
        fontSize: 14,
        color: Colors.black,
    },
    location: {
        fontSize: 14,
        color: Colors.black,
    },
    earningContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: "row",
        flex: 1
    },
    earningText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    flatListContent: {
        paddingBottom: 20,
    },
});

export default Earning;
