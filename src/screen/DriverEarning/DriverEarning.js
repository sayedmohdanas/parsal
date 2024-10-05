import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import OrderDetail from './OrderDetail';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../DashBoard/components/CustomHeader';
import BottomNav from '../../../navigation/BottomNav';
import DateRangeSelector from '../DashBoard/components/DataRangeSelectore';
import { hitDriverEarning } from '../../config/api/api';

const { height } = Dimensions.get('window');

const Earning = () => {
    const [selectedRange, setSelectedRange] = useState('today');///date ke liye

    const profileData = [
        { id: 1, name: 'Ms Dhoni', location: 'Charbagh', place: 'Khurram Namar', earning: 8066, distance: 7.5 },
        { id: 2, name: 'Virat Kohli', location: 'Delhi', place: 'Civil Lines', earning: 6229, distance: 8.5 },
        { id: 3, name: 'Sachin', location: 'Mumbai', place: 'Bandra', earning: 15246, distance: 10.8 },
        { id: 4, name: 'Msd', location: 'Charbagh', place: 'Khurram Namar', earning: 40, distance: 9.5 },
        { id: 5, name: 'Virat Singh', location: 'Delhi', place: 'Civil Lines', earning: 70, distance: 7.7 },
        { id: 6, name: 'Sachin Thakur', location: 'Mumbai', place: 'Bandra', earning: 6066, distance: 8.3 },
    ];

    const dateData = [
        { date: '12 jun 2025', profiles: [1, 2] },
        { date: '18 jun 2025', profiles: [3, 4] },
        { date: '14 jun 2025', profiles: [5, 6] },
    ];

    const [currentDateIndex, setCurrentDateIndex] = useState(0);

    const getEarningData = async () => {
        try {

          const response= await hitDriverEarning({selectedRange})
          console.log(response,'responsefromDriverEarning======>')
        } catch (error) {
          console.log(error)
        }
      };
    




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
                    <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(16), marginRight: responsiveHeight(3) }}>from:</Text>
                    {item.place}
                </Text>
                <Text style={styles.place}>
                    <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(16), marginRight: responsiveHeight(3) }}>to:</Text>
                    {item.location}
                </Text>
            </View>
            <View style={styles.earningContainer}>
                <Text style={styles.earningText}>{item.distance}km</Text>
                <Text style={styles.earningText}>₹{item.earning}</Text>
            </View>
        </View>
    );

    const handlePrevDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : dateData.length - 1));
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => (prevIndex < dateData.length - 1 ? prevIndex + 1 : 0));
    };

    const selectedProfiles = profileData.filter(profile => dateData[currentDateIndex].profiles.includes(profile.id));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <CustomHeader screenName="Earning" setSelectedRange={setSelectedRange} selectedRange={selectedRange} />
                <View style={{alignSelf:'flex-end',marginRight:responsiveWidth(8),marginTop:responsiveHeight(8)}}>
                </View>

            </View>
            <View style={styles.container}>
                <View style={styles.sliderContainer}>
                    {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}> */}
                        {/* <Text style={styles.dateText}>{dateData[currentDateIndex].date}</Text> */}
                        {/* <Text style={styles.dayText}>{"Today"}</Text> */}
                        {/* <View style={{borderBlockColor:'green',borderWidth:1}}> */}

                        {/* <DateRangeSelector  setSelectedRange={setSelectedRange}selectedRange={selectedRange} /> */}
                        {/* </View> */}
                    {/* </View>      */}
                </View>

                <View style={[styles.earningDisplay,{justifyContent:'center'}]}>
                    {/* <TouchableOpacity style={styles.navButton} onPress={handlePrevDate}>
                        <Image source={AppImages.arrowLeft} style={styles.arrowImage} resizeMode='contain' />
                    </TouchableOpacity> */}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.totalEarningText}>{"Total Earning"}</Text>
                        <Text style={styles.earningAmount}>₹{getTotalEarnings()}</Text>
                        <View style={styles.percentageContainer}>
                            <View style={styles.increaseContainer}>
                                <Image source={AppImages.arrowUp} style={styles.arrowUpImage} resizeMode='contain' />
                                <Text style={styles.percentageText}>{"3 "}%</Text>
                            </View>
                            <Text style={styles.heigherText}>{"higher than last day"}</Text>
                        </View>

                        {/* <Text style={styles.dateText}>{dateData[currentDateIndex].date}</Text> */}

                    </View>
                    {/* <TouchableOpacity style={styles.navButton} onPress={handleNextDate}>
                        <Image source={AppImages.arrowRight} style={styles.arrowImage} resizeMode='contain' />
                    </TouchableOpacity> */}
                </View>


                <View style={styles.earningDisplay}>
                    <TouchableOpacity style={styles.navButton} onPress={handlePrevDate}>
                        <Image source={AppImages.arrowLeft} style={styles.arrowImage} resizeMode='contain' />
                    </TouchableOpacity>
                    
                      <Text style={styles.dateText}>{dateData[currentDateIndex].date}</Text>

                    <TouchableOpacity style={styles.navButton} onPress={handleNextDate}>
                        <Image source={AppImages.arrowRight} style={styles.arrowImage} resizeMode='contain' />
                    </TouchableOpacity>
                </View>

                <View style={styles.orderListContainer}>
                    <Text style={styles.orderListHeadign}>{"Order List "}</Text>
                    <ScrollView style={styles.scrollView}>
                        <OrderDetail />
                        <OrderDetail />
                        <OrderDetail />
                        <OrderDetail />
                        <OrderDetail />
                        <OrderDetail />
                    </ScrollView>
                </View>
            </View>
            <View style={{marginBottom:responsiveHeight(12)}}>
            <BottomNav  Earning={true}/>
            </View>
          
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.homeBackground,
    },
    sliderContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsiveHeight(18),
    },
    dateText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '600',
        lineHeight: responsiveHeight(14.52),
        color: Colors.black,
    },
    dayText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '400',
        marginTop: responsiveHeight(3),
        lineHeight: responsiveHeight(14.52),
        color: "#777777",
    },
    earningDisplay: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsiveHeight(10),
        paddingHorizontal: responsiveHeight(30),
        flexDirection: 'row',
        marginBottom: responsiveHeight(30),
    },
    navButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowImage: {
        width: responsiveHeight(20),
        height: responsiveHeight(24),
    },
    totalEarningText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '400',
        color: Colors.black,
    },
    earningAmount: {
        fontSize: responsiveFontSize(26),
        fontWeight: '700',
        color: Colors.black,
    },
    percentageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    increaseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(69, 184, 69, 0.1)',
        borderRadius: 4,
    },
    arrowUpImage: {
        width: responsiveFontSize(10),
        height: responsiveFontSize(10),
    },
    percentageText: {
        color: '#45B845',
        fontSize: responsiveFontSize(10),
    },
    heigherText: {
        fontSize: responsiveFontSize(10),
        fontWeight: '400',
        color: "#777777",
        lineHeight: responsiveHeight(13),
        marginLeft: responsiveHeight(3),
    },
    orderListContainer: {
        // paddingHorizontal: responsiveHeight(10),
    },
    orderListHeadign: {
        fontSize: responsiveFontSize(16),
        fontWeight: '700',
        marginLeft: responsiveHeight(18),
        color: Colors.black,
    },
    scrollView: {
        paddingBottom: responsiveHeight(40),
    },
    profileCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: responsiveHeight(10),
        backgroundColor: 'white',
        margin: responsiveHeight(5),
        borderRadius: 10,
        marginBottom: responsiveHeight(3),
    },
    profileInfo: {
        flexDirection: 'row',
        flex: 0.8,
    },
    profileImage: {
        width: responsiveHeight(90),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
        marginRight: responsiveHeight(20),
    },
    name: {
        fontSize: responsiveFontSize(14),
        fontWeight: '500',
        color: Colors.black,
    },
    profileText: {
        justifyContent: 'center',
        marginLeft: responsiveHeight(10),
    },
    place: {
        fontSize: responsiveFontSize(12),
        color: Colors.gray,
    },
    earningContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 0.2,
    },
    earningText: {
        fontSize: responsiveFontSize(12),
        color: Colors.black,
    },
});

export default Earning;
