import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../common/metrices";
import AppImages from "../../../common/AppImages";



const DriverInformation = () => {


    const makeCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const trip = {
        name: 'Anas',
        phoneNumber: '9988007799'
    }
    return (
        <View style={styles.userDetail}>
            <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                <Image source={AppImages.profileImage} style={styles.manStyle} />
                <View style={{ marginLeft: responsiveHeight(6) }}>
                    <Text style={[styles.name, { fontSize: responsiveFontSize(14), fontWeight: '500' }]}>{trip?.name}</Text>

                    <Text style={[styles.name, { fontSize: responsiveFontSize(10), fontWeight: '500', color: Colors.grey, marginTop: responsiveHeight(2) }]}>{"Pickup Logistic"}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.callDetail} onPress={() => makeCall(trip?.phoneNumber)}>
                <Image source={AppImages.callImage} style={styles.phoneIcon} />
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    userDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: responsiveHeight(14),
        paddingHorizontal: responsiveHeight(15)

    },
    manStyle: {
        width: responsiveWidth(44),
        height: responsiveWidth(44),
        borderRadius: responsiveWidth(6),
        marginRight: responsiveWidth(3),
    },
    phoneIcon:{
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
    callDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default DriverInformation