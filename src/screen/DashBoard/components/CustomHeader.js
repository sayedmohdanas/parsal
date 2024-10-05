import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import AppImages from '../../../common/AppImages';
import DateRangeSelector from './DataRangeSelectore';

const CustomHeader = ({ screenName, selectedRange, setSelectedRange }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>
            {/* Left side: Profile Picture */}
            <Image
                source={AppImages.profileImage} // Replace with your profile pic URL
                style={styles.profilePic}
            />

            {/* Center: Screen Name */}
            <Text style={styles.screenName}>{screenName}</Text>

            {/* Right side: Placeholder (Optional) */}
            <View style={styles.placeholder} />
            {screenName === "Earning" ? (
                <DateRangeSelector setSelectedRange={setSelectedRange} selectedRange={selectedRange} />
            ) : null}


        </View>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: responsiveHeight(60),
        backgroundColor: Colors.white,
        paddingHorizontal: responsiveWidth(16),
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.grey,
    },
    profilePic: {
        height: responsiveHeight(32),
        width: responsiveHeight(32),
        borderRadius: responsiveHeight(20),
    },
    screenName: {
        fontSize: responsiveFontSize(20),
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        flex: 1, // Ensures that the text is centered
    },
    placeholder: {
        width: responsiveWidth(40), // Matches the profile pic width for balance
    }
});
