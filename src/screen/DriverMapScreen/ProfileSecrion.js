import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

const ProfileSection = () => {
    const navigation = useNavigation()
    const [loading, setLoadig] = useState(false)
    const [otp, setOtp] = useState('');
    const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
    const update_order = useSelector(state => state?.parsalPartner?.update_order || null);
    console.log(orderData?.newOrder?.driver_id, 'driver_id===>')

    const dispatch = useDispatch()

    useEffect(() => {

        socket = io(socketUrl);

        socket.emit('registerUser', { userId: orderData?.newOrder?.driver_id, role: 'driver' });

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        socket.on("order_canceled", (data) => {
            navigation.goBack()
            // Handle cancellation on the frontend (e.g., notify user, redirect, etc.)
        });
        return () => {
            if (socket) {
                // socket.disconnect();
                console.log('Socket disconnected');
            }
        };
    }, []);

    const handleOtpSubmit = async () => {

        try {
            // if (otp !== orderData?.otp || orderData?.Otp < 4) {
            //     errorToast('Invalid Input', 'Incorrect Otp');
            //     return;
            // }
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
    const handleCancelRequest = async () => {
        try {
            setLoadig(true)
            Alert.alert(
                "Cancel Order",
                "Are you sure you want to cancel this order?",
                [
                  {
                    text: "No", // Do nothing on "No"
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: async() => {
                      // Handle the order cancellation logic here
                      successToast("Successfull", 'Order Cancel')
                      dispatch(setupdate_order(null))
                      const param = {
                          order_id: orderData?.newOrder?.id
                      }
                      const res = await hitCancelOrder(param)
                      if (res) {
                          socket.emit("cancel_order", {
                              userId: orderData?.newOrder?.cust_id,
                              orderId: "order789",
                              role: "driver",
                              reason: "Customer requested cancellation",
                          });
                          navigation.goBack()
                          console.log('Request cancelled');
                      }
          
                      // Call API to cancel the order or update state
                    },
                  },
                ],
                { cancelable: false } // Prevent closing the alert by tapping outside
              );
            
        } catch (error) {
            Alert.alert('Error', 'Something wwent wrong')
            console.error(error)
        } finally {
            setLoadig(false)
        }
    };

    return (
        <>
            <View style={styles.profileContainer}>

                {!update_order?.is_arrived_pickup &&
                    <View style={{ width: '100%', }}>
                        <View style={styles.otpSection}>
                            <Text style={styles.otpLabel}>Enter OTP:</Text>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                placeholderTextColor={'black'}
                                onChangeText={setOtp}
                                maxLength={6}
                                placeholder="Enter OTP"
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.otpButton} onPress={handleOtpSubmit}>
                                <Text style={styles.otpButtonText}>Submit OTP</Text>
                            </TouchableOpacity>
                        </View>
                        <BorderLine color="#1E0000" thickness={0.4} length="100%" orientation="horizontal" margin={4} />
                    </View>
                }





                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, alignItems: 'center', backgroundColor: Colors.white }}>

                    <View style={styles.ProfileView}>
                        <Image source={AppImages.profileImage} style={styles.profileImage} resizeMode='contain' />
                        <View style={{ backgroundColor: 'red,', alignItems: 'center' }}>
                            <Text style={styles.name}>kllu</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                                <Image source={AppImages.starImage} style={styles.starImg} />
                                <Text style={{ color: 'grey', fontSize: 10 }}>4.9</Text>
                            </View>
                        </View>

                    </View>


                    <View style={styles.actions}>

                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={AppImages.messegeImage} style={styles.iconImage} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Image source={AppImages.callImage} style={styles.iconImage} />
                        </TouchableOpacity>
                    </View>
                </View>



                <View style={{ width: "100%", backgroundColor: Colors.white }}>
                    <View style={{ flex: 1, flexDirection: "row", margin: 4 }}>
                        <View style={{ marginLeft: 10 }}>
                            <Image source={AppImages.location} style={{ height: 25, width: 25, margin: 5 }} resizeMode='contain' />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 6, justifyContent: "center" }}>

                            <Text style={{ fontSize: 14, color: Colors.black, fontWeight: "400" }}>
                                {orderData?.newOrder?.pickup_address?.length > 40
                                    ? `${orderData.newOrder.pickup_address.slice(0, 40)}...`
                                    : orderData?.newOrder?.pickup_address}
                            </Text>

                        </View>
                    </View>

                    <Divider style={{ marginVertical: 5, marginHorizontal: 30 }} />
                    <View style={{ flex: 1, flexDirection: "row", margin: 4 }}>
                        <View style={{ marginLeft: 10 }}>

                            <Image source={AppImages.location} style={{ height: 25, width: 25, margin: 5 }} resizeMode='contain' />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 6, justifyContent: "center" }}>
                            <Text style={{ fontSize: 14, color: Colors.black, fontWeight: "400" }}>
                                {orderData?.newOrder?.drop_address?.length > 40
                                    ? `${orderData.newOrder.drop_address.slice(0, 40)}...`
                                    : orderData?.newOrder?.drop_address}
                            </Text>

                        </View>
                    </View>
                    <Divider style={{ marginVertical: 5, marginHorizontal: 30 }} />

                    <View style={{ flex: 1, flexDirection: "row", margin: 4 }}>
                        <View >
                            <Image source={AppImages.Bike} style={{ height: 50, width: 50, margin: 5 }} resizeMode='contain' />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <Text style={{ color: "#C8C7CC", fontSize: 13, fontWeight: "400" }}>{"DISTANCE"}</Text>
                                <Text style={{ color: "#C8C7CC", fontSize: 13, fontWeight: "400" }}>{"TIME"}</Text>
                                <Text style={{ color: "#C8C7CC", fontSize: 13, fontWeight: "400" }}>{"PRICE"}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "flex-start" }}>
                                <Text style={{ fontSize: 14, color: Colors.black, fontWeight: "600" }}>{orderData?.newOrder?.expected_distance + 'km'}</Text>
                                <Text style={{ fontSize: 14, color: Colors.black, fontWeight: "600" }}>{parseInt(orderData?.newOrder?.expected_time) + 'min'}</Text>
                                <Text style={{ fontSize: 14, color: Colors.black, fontWeight: "600" }}>{`₹ ${orderData?.newOrder?.paid_amount}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* </View> */}

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.button} onPress={handleCancelRequest}>
                        <Text style={styles.buttonText}>Cancel Request</Text>
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
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginTop: 3,
        marginBottom: 3,

    },
    button: {
        backgroundColor: Colors.grey,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    otpLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'black',
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
        padding: 10,
        borderRadius: 5,
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
        width: 40,
        height: 40,
        borderRadius: 35,
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
});

export default ProfileSection;


