import { Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React from 'react'
import AppImages from "../src/common/AppImages";
// import { responsiveHeight, responsiveWidth } from "../../common/metrices";
import Colors from "../src/common/Colors";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Badge } from "react-native-paper";
import { responsiveHeight, responsiveWidth } from "../src/common/metrices";

const BottomNav = (props) => {
    const navigation = useNavigation();
    const orderData = useSelector((state) => state.parsal_store?.orderData);
    console.log('order data ', orderData)
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.header_center} onPress={() => { navigation.navigate('Trip') }}>
                        <View style={[styles.header, { paddingTop: 5 }]}>
                            {
                                props.Trip
                                    ?
                                    <Image source={AppImages.TripIconB} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                    :
                                    <Image source={AppImages.TripIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                            }
                        </View>
                        <View style={[styles.header, { borderBottomWidth: props.home ? 0 : 0, borderColor: props.home ? Colors.brandBlue : null }]}>
                            <Text style={styles.menu_txt}>{'Trips'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => {
                            if (orderData) {
                                navigation.navigate('TripScreen')
                            } else {
                                navigation.navigate('OrderScreen')
                            }
                        }}>

                            <View style={[styles.header, { paddingTop: 5 }]}>
                                {
                                    props.order
                                        ?
                                        <>
                                            <View style={{ position: "relative" }}>
                                                {orderData && <TouchableOpacity onPress={() => {
                                                    navigation.navigate('TripScreen')
                                                }} style={{ position: "absolute", height: 8, width: 8, borderRadius: 5, backgroundColor: "red", zIndex: 1000, right: 0 }} />}
                                                <Image source={AppImages.activeOrder} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />

                                            </View>
                                        </>
                                        :
                                        <View style={{ position: "relative" }}>
                                            {orderData && <TouchableOpacity onPress={() => {
                                                navigation.navigate('TripScreen')
                                            }} style={{ position: "absolute", height: 8, width: 8, borderRadius: 5, backgroundColor: "red", zIndex: 1000, right: 0 }} />}
                                            <Image source={AppImages.OrderIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                                        </View>
                                }
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.job ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Order'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => { }}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                <Image source={AppImages.CoinIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.coin ? Colors.brandBlue : null }} />
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.company ? 3 : 0, borderColor: Colors.brandBlue, }]}>
                                <Text style={styles.menu_txt}>{'Coin'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => {navigation.navigate('Earning')}}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                {/* <Image source={AppImages.PaymentIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.payment ? Colors.brandBlue : null }} /> */}
                                {
                                    props.Earning
                                        ?
                                        <Image source={AppImages.EarningIconB} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                        :
                                        <Image source={AppImages.EarningIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                                }
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.profile ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Earning'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => { navigation.navigate('Setting') }}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                {
                                    props.Setting
                                        ?
                                        <Image source={AppImages.SettingIconB} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                        :
                                        <Image source={AppImages.SettingIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                                }
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.profile ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Setting'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default BottomNav

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(62),
        backgroundColor: Colors.white,
        marginHorizontal: responsiveWidth(16),
        borderRadius: 40,
        elevation: 7,
        shadowColor: Colors.black
    },
    menu_txt: {
        fontSize: 11,
        color: "#000000",
        // fontFamily: Font.txt_normal
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    header: {
        flex: 1,
        marginTop: 2
    },
    header_center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})