import { StyleSheet ,View,Text, Image} from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../common/metrices";
import Colors from "../../common/Colors";

const DriverDetails=()=>{
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
        name: "Arshar Warsi", // Replaced with your name
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
    return(
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

    
    </View>
    )
}
const styles = StyleSheet.create({
    UserDetailMainContainer: {
        // flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 15,
        borderRadius:30,
        paddingVertical:responsiveHeight(8),
        paddingHorizontal:responsiveWidth(18),
        marginLeft:responsiveWidth(5),
        alignItems: 'center'
    },
    userDetail: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent:'center'
    },
    manStyle: {
        height: responsiveHeight(35),
        width: responsiveWidth(35),
        borderRadius: 35
    },
    userNameAddress: {
        marginLeft: responsiveWidth(6)
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
        // marginTop: 2
    },
});
export default DriverDetails