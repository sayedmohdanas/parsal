{/* <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    zoomEnabled={true}
                    scrollEnabled={true} // Disable scrolling for static view
                >
                    <MapViewDirections
                        origin={{
                            latitude: 26.8535, // Aminabad Latitude
                            longitude: 80.9462  // Aminabad Longitude
                        }}
                        destination={{
                            latitude: 26.8500, // Hazratganj Latitude
                            longitude: 80.9462  // Hazratganj Longitude
                        }}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={4}
                        strokeColor={Colors.brandBlue}
                    />
                    <Marker
                        coordinate={{
                            latitude: 26.8535, // Aminabad Latitude
                            longitude: 80.9462  // Aminabad Longitude
                        }}
                        title="Pick-up Location"
                    >
                        <Image
                            source={AppImages.Bike}
                            style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
                        />
                    </Marker>
                    <Marker
                        coordinate={{
                            latitude: 26.8500, // Hazratganj Latitude
                            longitude: 80.9462  // Hazratganj Longitude
                        }}
                        title="Drop-off Location"
                    >
                        <Image
                            source={AppImages.location}
                            style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
                        />
                    </Marker>
                </MapView> */}




import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Line from '../../../../components/Line/Line';
import Colors from '../../../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../common/metrices';
import { hitGetOrderDetails } from '../../../../config/api/api';
import CustomHeader from '../../components/CustomHeader';
import Loading from '../../../../components/Loading/Loading';
import AppImages from '../../../../common/AppImages';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Fonts, FontSizes } from '../../../../common/Theme';

const OrderInfo = ({ route }) => {
    const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';

    const navigation = useNavigation();
    const order_info = route.params?.id;
    const order_id = order_info;
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state added

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                const response = await hitGetOrderDetails({ order_id });
                if (response.status == 1) {
                    setOrderDetails(response?.orderDetails);
                } else {
                    setOrderDetails(null);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Stop loading
            }
            console.log('oderder====>>>', orderDetails);

        };
        fetchData();
    }, [navigation]);
    const region = {
        latitude: 26.8500, // Hazratganj Latitude
        longitude: 80.9462, // Longitude for Lucknow
        latitudeDelta: 0.009,   // Control zoom level (adjust as needed)
        longitudeDelta: 0.009,  // Control zoom level (adjust as needed)
    };

    let orderStatusText = '';
    let orderStatusColor = '';
    if (orderDetails?.order_status === 3) {
        orderStatusText = 'Delivered';
        orderStatusColor = 'green';
    } else if (orderDetails?.order_status === 5) {
        orderStatusText = 'Canceled';
        orderStatusColor = 'red';
    } else if (orderDetails?.order_status === 0) {
        orderStatusText = 'Pending';
        orderStatusColor = 'orange';
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Loading loading={loading} />
            <View style={[styles.section1]}>
                <CustomHeader screenName={"Order Information"} />



                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    zoomEnabled={true}
                    scrollEnabled={true} // Disable scrolling for static view
                >
                    <Polyline
                        coordinates={[
                            { latitude: 26.8535, longitude: 80.9462 }, // Aminabad
                            { latitude: 26.8500, longitude: 80.9462 }  // Hazratganj
                        ]}
                        strokeColor={Colors.brandBlue} // Customize line color
                        strokeWidth={4} // Customize line width
                        lineDashPattern={[10, 5]} // Creates a dotted line (10px dash, 5px gap)
                    />
                    <Marker
                        coordinate={{
                            latitude: 26.8535, // Aminabad Latitude
                            longitude: 80.9462  // Aminabad Longitude
                        }}
                        title="Pick-up Location"
                    >
                        <Image
                            source={AppImages.Bike}
                            style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
                        />
                    </Marker>
                    <Marker
                        coordinate={{
                            latitude: 26.8500, // Hazratganj Latitude
                            longitude: 80.9462  // Hazratganj Longitude
                        }}
                        title="Drop-off Location"
                    >
                        <Image
                            source={AppImages.location}
                            style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
                        />
                    </Marker>
                </MapView>
                                  
            </View>
            <View style={[styles.section2]}>
                {orderDetails ? (
                    <>
                        <View style={[styles.dateContainer]}>
                            <View>
                                <Text style={{ color: 'black', fontWeight: '600' }}>
                                    {`${new Date(orderDetails.order_date).toLocaleDateString('en-GB', {
                                        day: '2-digit'
                                    })}-${new Date(orderDetails.order_date).toLocaleDateString('en-GB', {
                                        month: 'short'
                                    })}-${new Date(orderDetails.order_date).toLocaleDateString('en-GB', {
                                        year: '2-digit'
                                    })} ${new Date(orderDetails.order_date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}`}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: 'black' }}>{`CRN84594670`}</Text>
                                    <Text
                                        style={{
                                            color: orderStatusColor,
                                            marginLeft: responsiveWidth(10)
                                        }}
                                    >
                                        {orderStatusText}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{ color: 'black', fontSize: FontSizes.semiLarge, fontWeight: Fonts.medium }}>
                                    {`₹ ${(parseFloat(orderDetails.transactions?.find(t => t.pay_head_name === 'TotalFare')?.amount) || 0).toFixed(2)}`}
                                </Text>
                            </View>
                        </View>
                        <Line marginH={8} />
                        <View style={[styles.selectionPicDrop]}>
                            <View style={[styles.timelineContainer]}>
                                <View style={styles.greenCircle}></View>
                                <View style={styles.line}></View>
                                <View style={{
                                    height: responsiveHeight(10),
                                    width: responsiveWidth(10),
                                    borderWidth: 0.5,
                                    borderColor: 'grey',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={styles.redCircle}></View>
                                </View>
                            </View>
                            <View style={[styles.textInputContainers]}>
                                <View style={styles.pickUpStyle}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={{ color: Colors.black, fontSize: responsiveFontSize(14), fontWeight: Fonts.semilarge, marginLeft: responsiveWidth(10) }}>
                                        {orderDetails.pickup_address}
                                    </Text>
                                </View>
                                <View style={styles.pickUpStyle}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={{ color: Colors.black, fontSize: responsiveFontSize(14), marginLeft: responsiveWidth(10), fontWeight: Fonts.semilarge }}>
                                        {orderDetails?.drop_address}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Line marginH={16} />
                        <View style={[styles.dateContainer]}>
                            <FlatList
                                data={orderDetails?.transactions}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                        <View>
                                            <Text style={{ color: 'black', fontWeight: '600' }}>{item.pay_head_name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: 'black' }}>{`₹ ${parseFloat(item.amount, 10).toFixed(2)}`}</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={AppImages.emptyImage}
                            style={styles.emptyboxStyle}
                            resizeMode="contain"
                        />
                        <Text>No data available for this order ID</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default OrderInfo;


const styles = StyleSheet.create({
    section1: {
        flex: 1,
        backgroundColor: Colors.buttonGrey
    },
    section2: {
        flex: 1.5,
        backgroundColor: 'white',
        elevation: 10
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: responsiveWidth(16),
        marginTop: responsiveHeight(10)
    },
    selectionPicDrop: {
        height: responsiveHeight(130),
        marginHorizontal: responsiveWidth(16),
        flexDirection: 'row',
    },
    timelineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputContainers: {
        flex: 9,
    },
    greenCircle: {
        height: responsiveHeight(10),
        width: responsiveWidth(10),
        backgroundColor: Colors.brandBlue,
        borderRadius: 20,
    },
    redCircle: {
        height: responsiveHeight(6),
        width: responsiveWidth(6),
        backgroundColor: 'black',
        borderRadius: 20,
    },
    line: {
        borderLeftWidth: 1,
        height: responsiveHeight(50),
        marginVertical: responsiveHeight(1),
    },
    locationMapContainer: {
        backgroundColor: Colors.brandBlue,
        height: responsiveHeight(600),
        marginTop: 30,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    selectionPicDropContainer: {
        backgroundColor: 'red',
        marginBottom: responsiveHeight(20),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: Colors.white,
        paddingBottom: responsiveHeight(25),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickUpStyle: {
        height: responsiveHeight(50),
        marginTop: responsiveHeight(10),
        justifyContent: 'center',
    },
    emptyboxStyle: {
        height: responsiveHeight(169),
        width: responsiveWidth(169),
    },
})




