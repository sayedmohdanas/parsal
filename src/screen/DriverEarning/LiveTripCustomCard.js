import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import Line from '../../components/Line/Line';
import BorderLine from '../../common/BorderLine.';
import DriverInformation from '../DashBoard/components/DriverInformation';

const LiveTripCustomCard = ({ trip }) => {
  
    return (
        <View style={[styles.UserDetailMainContainer]}>
            <DriverInformation />
            <Line marginH={1} />

            <View style={styles.statusDetail}>
                <Text style={styles.statusText}>Detail Status</Text>
                <Text style={styles.statusDate}>{trip?.statusDate}</Text>
            </View>

            <View style={styles.adressContainer}>

                <View style={styles.markerContainer}>
                    <Image source={AppImages.pickupIcon} style={styles.pickupIcon} />
                    <BorderLine orientation={"vertical"} length={responsiveHeight(26)} margin={3} />
                    <Image source={AppImages.dropupIcon} style={styles.pickupIcon} />

                </View>
                <View style={styles.PickAndDropConatiner}>
                    <View style={styles.pickuContainer}>
                        <Text style={styles.lable}>
                            Picked
                        </Text>
                        <Text style={styles.PickedAdressText}>
                            {trip?.pickUpAddress}
                        </Text>
                    </View>
                    <View style={styles.dropContainer}>
                        <Text style={styles.lable}>
                            Delivery
                        </Text>
                        <Text style={styles.dropAdressText}>
                            {trip?.dropOffAddress}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.itemContainer}>
                <View style={styles.itemName}>
                    <Text style={styles.itemHeading}>Item :</Text>
                    <Text style={styles.itemNameText}>{trip?.itemDetails}</Text>
                </View>
                <View>
                    <Text>
                        {trip?.itemWeight}
                    </Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    UserDetailMainContainer: {
        padding: responsiveHeight(2),
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginBottom: responsiveHeight(1),
    },
    userDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: responsiveHeight(18),
        paddingHorizontal: responsiveHeight(15)

    },
    manStyle: {
        width: responsiveWidth(30),
        height: responsiveWidth(30),
        borderRadius: responsiveWidth(6),
        marginRight: responsiveWidth(3),
    },
    userNameAddress: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        color: Colors.black,
    },
    address: {
        color: Colors.grey,
        fontSize: responsiveFontSize(12),
        marginTop: responsiveHeight(0.5),
    },
    statusDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveHeight(15)
    },

    statusText: {
        color: Colors.black,
        fontSize: responsiveFontSize(12),
        fontWeight: '700',
    },
    statusDate: {
        color: '#000000',
        fontWeight: '500',
        fontSize: responsiveFontSize(10),

    },
    adressContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(12),
        paddingHorizontal: responsiveHeight(15)

    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight: 5
    },
    lable: {
        fontSize: responsiveFontSize(8),
        fontWeight: '400',
        lineHeight: 9.68
    },
    PickedAdressText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
        lineHeight: 14.52,
        color: "#000000",
        marginTop: responsiveHeight(6),
        marginBottom: responsiveHeight(6)

    },
    dropAdressText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '400',
        lineHeight: 14.52,
        color: "#000000",
        marginTop: responsiveHeight(6)

    },
    itemContainer: {
        backgroundColor: '#F6F6FC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(12),
        paddingVertical: responsiveHeight(10),
        paddingHorizontal: responsiveHeight(15)
    }
    , itemName: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemHeading: {
        fontSize: responsiveFontSize(10),
        fontWeight: '700',
        lineHeight: 12.1,
        color: '#000000'
    },
    itemNameText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '400',
        lineHeight: 14.52,
        color: '#000000',
        marginLeft: responsiveHeight(4)
    },
    pickupIcon: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
    },
});

export default LiveTripCustomCard;
