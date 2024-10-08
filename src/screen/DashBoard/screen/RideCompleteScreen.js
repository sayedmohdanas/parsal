import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppImages from '../../../common/AppImages';
import Colors from '../../../common/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';

const RideCompleteScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.earningsTop}>₹850.25</Text>
            <Text style={styles.rideCompleteText}>8 Rides Complete</Text>

            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Ride Earning</Text>
                    <Text style={styles.value}>₹850.25</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.rowWithCenter}>
                        <Text style={styles.label}>Tax Deductions</Text>
                        <Image source={AppImages.arrowDown} style={styles.arrowImage} />
                    </View>
                    <Text style={styles.value}>-₹0.30</Text>
                </View>

                <View style={styles.borderLine} />

                <View style={styles.row}>
                    <Text style={styles.label}>Total Earning</Text>
                    <Text style={styles.value}>₹850.55</Text>
                </View>
            </View>

            <View style={styles.cashCollectedCard}>
                <Text style={styles.cashCollectedText}>Cash Collected</Text>
                <Text style={styles.cashAmount}>₹850.55</Text>
            </View>

            <Text style={styles.yourRidesText}>Your Rides</Text>
            <View style={styles.yourRidesCard}>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.rideTime}>09:45 PM</Text>
                        <Text style={styles.rideId}> · #54215445124265</Text>
                    </View>
                    <Text style={styles.rideAddress}> .street no-254, Indira Nagar,...</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rideAmount}>₹850.55</Text>
                    <TouchableOpacity>
                        <Image source={AppImages.next} style={styles.nextImage} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cancelledRidesCard}>
                <View style={styles.yourCancelRidesCard}>
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.rideTime}>09:45 PM</Text>
                            <Text style={styles.rideId}> · #54215445124265</Text>
                        </View>
                        <Text style={styles.rideAddress}> . street no-254, Indira Nagar,...</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rideAmount}>₹0</Text>
                        <TouchableOpacity>
                            <Image source={AppImages.next} style={styles.nextImage} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.cancelLineContainer}>
                <View style={styles.borderLine} />

                    <View style={styles.cancelledTextContainer}>
                        <Image source={AppImages.redCross} style={styles.redCrossImage} />
                        <Text style={styles.cancelledText}>Cancelled</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.homeBackground,
        padding: 20,
        justifyContent: 'flex-start',
    },
    earningsTop: {
        fontSize: responsiveFontSize(35),
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 42.36,
        color: '#000',
    },
    rideCompleteText: {
        fontSize: responsiveFontSize(14),
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 16.94,
        marginBottom: 20,
        color: '#000',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    cashCollectedCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(20),
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    cashCollectedText: {
        fontSize: responsiveFontSize(14),
        fontWeight: '600',
        color: '#000000',
        lineHeight: 16.94,
    },
    cashAmount: {
        fontSize: responsiveFontSize(14),
        fontWeight: '600',
        color: '#000000',
        lineHeight: 16.94,
    },
    yourRidesText: {
        fontSize: responsiveFontSize(14),
        color: "#000000",
        fontWeight: '600',
        lineHeight: 16.94,
        marginTop: responsiveHeight(15),
        marginLeft: responsiveWidth(5),
    },
    yourRidesCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(20),
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    cancelledRidesCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: responsiveHeight(20),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    yourCancelRidesCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    rowWithCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: responsiveFontSize(14),
        color: '#000000',
    },
    value: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        color: '#000000',
    },
    arrowImage: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    borderLine: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 6,
    },
    rideTime: {
        fontSize: responsiveFontSize(14),
        fontWeight: '600',
        color: '#000000',
        lineHeight: 16.94,
    },
    rideId: {
        fontSize: responsiveFontSize(14),
        fontWeight: '600',
        color: '#000000',
        lineHeight: 16.94,
    },
    rideAddress: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        color: '#000000',
        lineHeight: 16.94,
    },
    rideAmount: {
        fontSize: responsiveFontSize(14),
        fontWeight: '600',
        color: '#000000',
        lineHeight: 16.94,
    },
    nextImage: {
        width: 18,
        height: 18,
    },
    cancelLineContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    cancelledTextContainer: {
        flexDirection: 'row',
        marginVertical: responsiveHeight(10),
        gap: 5,
        alignItems: 'center',
    },
    redCrossImage: {
        width: 18,
        height: 18,
    },
    cancelledText: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        lineHeight: 16.94,
        color: "#777777",
    },
});

export default RideCompleteScreen;
