import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import AppImages from '../../../common/AppImages';
import DateRangeSelector from './DataRangeSelectore';
import { Switch } from 'react-native-switch';


const CustomHeader = ({ screenName, selectedRange, setSelectedRange }) => {
    const [isEnabled, setIsEnabled] = useState(true);



    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>
            {/* Left side: Profile Picture */}
            <Image
                source={AppImages.profileImage} // Replace with your profile pic URL
                style={styles.profilePic}
            />

            {/* Center: Screen Name */}
            {/* <Text style={styles.screenName}>{screenName}</Text> */}

            <Switch

                value={isEnabled}
                onValueChange={(val) => setIsEnabled(val)}
                disabled={false}
                activeText={'Online'}
                inActiveText={'Offline'}
                circleSize={20}
                circleBorderWidth={3}
                backgroundActive={'green'}
                backgroundInactive={'gray'}
                circleActiveColor={'#30a566'}
                circleInActiveColor={'#000000'}
                renderInsideCircle={() => (
                    <Image source={AppImages.Online} style={{ width: responsiveWidth(20), height: responsiveHeight(20) }} resizeMode='contain' />
                )}
                changeValueImmediately={true}
                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                outerCircleStyle={{}}
                renderActiveText={true}
                renderInActiveText={true}
                switchLeftPx={4}
                switchRightPx={4}
                switchWidthMultiplier={4}
                switchBorderRadius={30}
            />

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
