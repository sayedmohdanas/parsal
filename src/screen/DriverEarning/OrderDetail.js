import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import {  responsiveWidth } from '../../../common/metrices'
import { mystyles } from '../../../common/Mystyle'
import Line from '../../components/Line/Line'
import AppImages from '../../common/AppImages'
import { PARTNER_PROFILE_BASE_URL } from '../../../common/Constant'
import { useNavigation } from '@react-navigation/native'
import { responsiveFontSize, responsiveHeight, responsiveWidth, } from '../../common/metrices'
import Colors from '../../common/Colors'

const OrderDetail = () => {
    const props = {
        parsalNumber: "ODR-123456",
        parsalName: "Electronics Package",
        parsalStatusTextColor: "rgba(69, 184, 69, 0.1)", // Example: green color for delivered status
        parsalStatusText: "Delivered",
        textColor: "#45B845", // White text color for the status
        citystart: "New York, NY",
        cityend: "Los Angeles, CA",
        partnerId: "partner123",
        driverId: "driver789",
        profilePic: "profile.jpg", // Image file name for the driver profile
        name: "Your Name", // Replaced with your name
        vNo: "CA-5678-XZ",
        tripCost: "$120",
        statestart:'Uttar Pradesh',
        stateend:"America",
        orderDetails: {
          orderId: "ODR-123456",
          items: [
            { name: "Laptop", quantity: 1 },
            { name: "Mobile Phone", quantity: 2 }
          ],
          shippingDetails: {
            from: "New York, NY",
            to: "Los Angeles, CA",
            driverName: "Your Name", // Replaced with your name
            vehicleNo: "CA-5678-XZ",
            tripCost: "$120"
          }
        }
      };
      
    const navigation = useNavigation()
    return (
        <TouchableOpacity >
            <View style={[styles.container]}>
           
                <View style={[styles.section1]}>
                    <View >
                        <Text style={[styles.parsalNumber]}>{props.parsalNumber}</Text>
                        <Text style={[styles.parsalName]}>{props.parsalName}</Text>
                    </View>
                    <View style={[styles.parsalStatus,{ backgroundColor: props.parsalStatusTextColor ,justifyContent: 'center', alignItems: 'center', }]}>
                        {/* <Text style={[styles.parsalStatusText, { color: props.textColor }]}>{props.parsalStatusText}</Text> */}
                        <Text style={[styles.parsalStatusText, { color: props.textColor }]}>₹ {500}</Text>
                    </View>
                </View>
                <Line marginH={1} />
                <View style={[styles.section2]}>
                    <View style={[styles.LocationMainContainer]}>
                        <View style={[styles.fromLocation]}>
                            <Text style={[styles.citystart]}>
                                {`${props.citystart.split(' ').slice(0, 2).join(' ')}...`}
                            </Text>
                            <Text style={[styles.statestart]}>{props.statestart}</Text>
                        </View>

                        <Image source={AppImages.arrowRight} resizeMode='contain' style={styles.rightArrowStyle} />

                        <View style={[styles.toLocation]}>
                            <Text style={[styles.cityend]}>
                                {`${props.cityend.split(' ').slice(0, 2).join(' ')}...`}
                            </Text>
                            <Text style={[styles.stateend]}>{props.stateend}</Text>
                        </View>
                    </View>

                    <View style={[styles.UserDetailMainContainer]}>
                        <View style={styles.userDetail}>
                        {/* <Image source={{ uri: `${PARTNER_PROFILE_BASE_URL}/${props.partnerId}/drivers/${props.driverId}_${props.profilePic}` }} style={styles.manStyle} /> */}
                        <Image source={AppImages.profileImage} style={styles.manStyle} />
                            <View style={styles.userNameAddress}>
                                <Text style={[styles.name, { fontSize: responsiveFontSize(14) }]}>{props.name}</Text>
                                <Text style={[styles.name, { color: 'grey', fontSize: responsiveFontSize(12) }]}>{props.vNo}</Text>
                                <Text style={[styles.address]}>{props.address}</Text>
                            </View>
                        </View>

                        <View>
                            {/* <Text style={[styles.name]}>{props.tripCost}</Text> */}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default OrderDetail

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(165),
        backgroundColor: Colors.white,
        marginHorizontal: responsiveWidth(16),
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginVertical: 5,
    },
    section1: {
        flex: 1.1,
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    section2: {
        flex: 2,
        // backgroundColor: 'orange'
    },
    parsalNumber: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        color: Colors.black
    },
    parsalName: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        color: Colors.grey
    },
    parsalStatus: {
        // backgroundColor: Colors.black,
        height: responsiveHeight(27),
        borderWidth:1,
        borderColor:"#45B845",
        // paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 10
    },
    parsalStatusText: {
        fontSize: responsiveFontSize(12),
        color: Colors.black,

        fontWeight: '400'
    },
    LocationMainContainer: {
        flex: 1,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    UserDetailMainContainer: {
        flex: 1,
        // backgroundColor: 'pink',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        alignItems: 'center'
    },
    fromLocation: {
        alignItems: 'flex-start',
        flex: 1
    },
    toLocation: {
        alignItems: 'flex-end',
        flex: 1
    },
    citystart: {
        fontSize: responsiveFontSize(14),
        fontWeight: '500',
        color: Colors.black

    },
    statestart: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
        color: Colors.grey,
        marginTop: 1
    },
    rightArrowStyle: {
        height: responsiveHeight(24),
        width: responsiveWidth(20),
        marginTop: responsiveHeight(10)
    },
    cityend: {
        fontSize: responsiveFontSize(14),
        fontWeight: '500',
        color: Colors.black
    },
    stateend: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
        color: Colors.grey,
        marginTop: 1

    },
    infoCircleStyle: {
        height: responsiveHeight(28),
        width: responsiveWidth(28),
    },
    manStyle: {
        height: 35,
        width: 35,
        borderRadius: 35
    },
    userNameAddress: {
        marginLeft: responsiveWidth(10)
    },
    name: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
        color: Colors.black
    },
    address: {
        fontSize: responsiveFontSize(10),
        fontWeight: '500',
        color: Colors.grey,
        marginTop: 2
    },
    userDetail: {
        flexDirection: 'row',
        alignItems: "center"
    }

})