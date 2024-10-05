import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import BorderLine from '../../common/BorderLine.';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { hitCancelOrder, hitUpdateOrder } from '../../config/api/api';
import { errorToast, successToast } from '../../common/CommonFunction';
import { setOrderData, setupdate_order } from '../../redux/HitApis/HitApiSlice';
import { io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { SuccessToast } from 'react-native-toast-message';
import { socketUrl } from '../../config/url';
import Loading from '../../components/Loading/Loading';
import OTPTextInput from 'react-native-otp-textinput';
import { responsiveHeight, responsiveWidth } from '../../common/metrices';
import OTPTextView from 'react-native-otp-textinput';


const DestinationSection = () => {
    const navigation = useNavigation()
    const [loading, setLoadig] = useState(false)
    // const [otp, setOtp] = useState('');
    // const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
    // const update_order = useSelector(state => state?.parsalPartner?.update_order || null);
    // console.log(orderData?.newOrder?.driver_id, 'driver_id===>')
    // let otpInput = useRef(null);
    // const dispatch = useDispatch()
    const [address,setAddress]=useState('King Georges Medical University Shah Mina Rd, Chowk, Lucknow, Uttar Pradesh 226003 ')

    const handleOpenMap = () => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.openURL(mapUrl).catch(err => Alert.alert('Error', 'Failed to open the map.'));
    };


    const handleOtpSubmit = async () => {

        try {
                if (otp !== orderData?.otp || orderData?.Otp < 4) {
                    errorToast('Invalid Input', 'Incorrect Otp');
                    return;
                }
            const payload = {
                is_arrive_pickup: 1,
                order_id: orderData?.newOrder?.id
            };
            const response = await hitUpdateOrder(payload)
            if (response) {
                socket.emit('driver_pickup', response, (acknowledgment) => {
                    console.log('Data sent, acknowledgment:', acknowledgment);

                });
                dispatch(setupdate_order(response?.order))
            }

        } catch (error) {

        }

    };
    const handleEndTrip = async () => {
        // try {
        //     setLoadig(true)
        //     Alert.alert(
        //         "Cancel Order",
        //         "Are you sure you want to cancel this order?",
        //         [
        //             {
        //                 text: "No", // Do nothing on "No"
        //                 onPress: () => console.log("Cancel Pressed"),
        //                 style: "cancel",
        //             },
        //             {
        //                 text: "Yes",
        //                 onPress: async () => {
        //                     // Handle the order cancellation logic here
        //                     successToast("Successfull", 'Order Cancel')
        //                     dispatch(setupdate_order(null))
        //                     const param = {
        //                         order_id: orderData?.newOrder?.id
        //                     }
        //                     const res = await hitCancelOrder(param)
        //                     if (res) {
        //                         socket.emit("cancel_order", {
        //                             userId: orderData?.newOrder?.cust_id,
        //                             orderId: "order789",
        //                             role: "driver",
        //                             reason: "Customer requested cancellation",
        //                         });
        //                         navigation.goBack()
        //                         console.log('Request cancelled');
        //                     }

        //                     // Call API to cancel the order or update state
        //                 },
        //             },
        //         ],
        //         { cancelable: false } // Prevent closing the alert by tapping outside
        //     );

        // } catch (error) {
        //     Alert.alert('Error', 'Something wwent wrong')
        //     console.error(error)
        // } finally {
        //     setLoadig(false)
        // }
    };
    // console.log('otpp', otp)
    return (
        <>
            <View style={styles.profileContainer}>

                {/* {!update_order?.is_arrived_pickup && */}
                    <View style={{}}>
                        <View style={styles.otpSection}>
                            <View style={{

                            }}>
                                {/* <Text style={styles.otpLabel}>Enter OTP:</Text> */}
                                {/* <OTPTextView
                                    ref={otpInput}
                                    handleTextChange={handleTextChange}
                                    inputCount={4}
                                    containerStyle={styles.otpContainer}
                                    textInputStyle={styles.otpInput}
                                    inputCellLength={1}
                                    tintColor={Colors.brandBlue}
                                    offTintColor={Colors.textInputBorderColor}
                                /> */}
                            </View>
                            <TouchableOpacity style={styles.otpButton} onPress={handleOtpSubmit}>
                                <Text style={styles.otpButtonText}>Submit OTP</Text>
                            </TouchableOpacity>
                        </View>
                        <BorderLine color="#1E0000" thickness={0.4} length="100%" orientation="horizontal" margin={4} />
                    </View>
                {/* } */}



<View style={{ flex: 1,  margin: 4 }}>
                        <View style={{ marginLeft: 14 }}>
                            <Text style={{color:'red',fontWeight:'500',fontSize:16}}>LOCATION</Text>
                        </View>
            
                    </View>

                <View style={{ width: "100%",flexDirection: "row",justifyContent:'space-between',marginBottom:15}}>
                   

                    <View style={{ flex: 1, flexDirection: "row",paddingHorizontal:20 }}>
                      

                     <Text style={{color:Colors.black,fontSize:14,fontWeight:'500',}}>{address} </Text>
                        
    
                    </View>
                    <View style={{ flex: 1, flexDirection: "row",alignItems:'center',justifyContent:'center' }}>
                    <TouchableOpacity onPress={handleOpenMap} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={AppImages.navigatationIcon} style={{ width: 60, height:60, marginLeft: 5 }} />

                      </TouchableOpacity>
    
                    </View>
                  
                </View>
                {/* </View> */}

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.button} onPress={handleEndTrip}>
                        <Text style={styles.buttonText}>End Trip</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Loading loading={loading} />
        </>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        backgroundColor: Colors.white,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 10,
        paddingTop: 10
    },
    otpSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop: 3,
        marginBottom: 3,
        // backgroundColor:'red'
    },
    button: {
        backgroundColor: Colors.brandBlue,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical:16

    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    otpLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        // marginRight: 10,
        color: 'black',
        marginLeft: 25
    },
    otpInput: {
        borderWidth: 1,
        borderColor: 'gray',
        color: Colors.black,
        padding: 7,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    otpButton: {
        backgroundColor: Colors.brandBlue,
        padding: 8,
        borderRadius: 5,
        // marginTop:18
    },
    otpButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green'

    },
    ProfileView: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'flex-start',
        gap: 5,
        alignItems: 'center',
        flexDirection: 'row',

    },
    profileImage: {
        width: 38,
        height: 38,
        borderRadius: 35,
        marginLeft: 8
    },
    starImg: {
        height: 12,
        width: 12,
    },
    name: {
        fontSize: 14,
        color: 'black',
        marginTop: 5,
    },
    LocationName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',

    },
    centeredView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
    },
    leftAligned: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verticleLine: {
        height: 10,
        width: 4,
        backgroundColor: Colors.brandBlue,
        marginRight: 10,
    },
    textContainer: {
        justifyContent: 'space-between',
        flex: 1,

    },
    actions: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 5,
        gap: 10,
    },
    actionButton: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 40,
        borderColor: "#f5f5f5",
        borderWidth: 1,
        elevation: 0.4

    },
    iconImage: {
        width: 18,
        height: 18,
    },
    bottomSection: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        width: '90%',
    },
    itemDetails: {
        borderRightWidth: 2,
        borderRightColor: Colors.brandBlue,
        paddingRight: 10,
    },
    weightDetails: {
        paddingLeft: 10,
    },
    itemText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    otpInput: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.textInputBorderColor,
        fontSize: 20,
        color: Colors.brandBlue,
        textAlign: 'center',
        height: 40,
        width: 40,
        paddingVertical: 0, // Remove vertical padding
        paddingHorizontal: 0, // Remove horizontal padding,
        borderBottomWidth: 1
    },
    inputCell: {
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorderColor,
    },
});

export default DestinationSection;


