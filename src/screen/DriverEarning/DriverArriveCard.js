import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import DriverInformation from '../DashBoard/components/DriverInformation';
import ArriveButton from '../DashBoard/components/ArriveButton';
import SlideButton from 'rn-slide-button';

const DriverArriveCard = ({ trip }) => {
    const [isArrived, setIsArrived] = useState(false);
    const [isSlid, setIsSlid] = useState(false);

    const handleSlideComplete = () => {
        setIsSlid(true);
    };

    return (
        <View style={styles.container}>
            <DriverInformation />

            <View style={styles.chatButtonContainer}>
                <TouchableOpacity style={styles.chatButton}>
                    <Image source={AppImages.messageIcon} style={styles.icon} resizeMode='contain' />
                    <Text style={styles.buttonText}>{"Chat"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatButton}>
                    <Image source={AppImages.crossIcon} style={styles.crossIcon} resizeMode='contain' />
                    <Text style={styles.buttonText}>{"Cancel"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.otpInputContainer}>
                <TextInput
                    placeholder='Enter OTP'
                    style={styles.otpInput}
                    placeholderTextColor={"#D1D1D1"}
                />
                <Image source={AppImages.pickedIcon} style={styles.otpIcon} resizeMode='contain' />
            </View>

            <View style={styles.itemContainer}>
                {isArrived ? (
                    <ArriveButton buttonText={'Arrive'} disabled={true} />
                ) : (
                    <View style={styles.slideButtonContainer}>
                        <SlideButton
                            title="Start Ride"
                            titleStyle={styles.slideButtonTitle}
                            thumbStyle={styles.slideButtonThumb}
                            containerStyle={{ backgroundColor: isSlid ? 'red' : '#232323' }}
                            onSlideComplete={handleSlideComplete}
                            underlayStyle={styles.slideButtonUnderlay}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: responsiveHeight(2),
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginBottom: responsiveHeight(1),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chatButtonContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(15),
        justifyContent: 'center',
        gap: 10,
    },
    chatButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        width: "44%",
        borderRadius: 4,
        paddingHorizontal: responsiveWidth(10),
        paddingVertical: responsiveHeight(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0.5,
    },
    buttonText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '400',
        lineHeight: 14.52,
        color: "#000000",
        marginLeft: responsiveWidth(5),
    },
    otpInputContainer: {
        borderWidth: 1,
        borderColor: "#D8D8D8",
        marginHorizontal: responsiveWidth(25),
        borderRadius: 10,
        height: responsiveHeight(40),
        marginTop: responsiveHeight(20),
        flexDirection: 'row',
    },
    otpInput: {
        marginLeft: responsiveWidth(6),
        flex: 1,
        fontWeight: '500',
        fontSize: responsiveFontSize(12),
    },
    otpIcon: {
        width: responsiveWidth(24),
        height: responsiveHeight(24),
        alignSelf: 'center',
        marginRight: responsiveWidth(8),
    },
    itemContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: responsiveHeight(6),
        paddingVertical: responsiveHeight(8),
    },
    slideButtonContainer: {
        flex: 1,
        paddingHorizontal: responsiveWidth(18),
    },
    slideButtonTitle: {
        color: Colors.white,
    },
    slideButtonThumb: {
        backgroundColor: '#45B845',
        height: responsiveHeight(50),
        width: responsiveWidth(70),
        borderRadius: 30,
    },
    slideButtonUnderlay: {
        backgroundColor: '#90EE90',
    },
    icon: {
        width: responsiveWidth(18),
        height: responsiveHeight(18),
    },
    crossIcon: {
        width: responsiveWidth(10),
        height: responsiveHeight(10),
    },
});

export default DriverArriveCard;
