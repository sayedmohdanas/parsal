import { Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React from 'react'
import AppImages from "../../common/AppImages";
import { responsiveHeight, responsiveWidth } from "../../common/metrices";
import Colors from "../../common/Colors";
import { useNavigation } from "@react-navigation/native";

const BottomNav = (props) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.header_center} onPress={() => {navigation.navigate('HomeScreen')}}>
                        <View style={[styles.header, { paddingTop: 5 }]}>
                            {
                                props.home
                                    ?
                                    <Image source={AppImages.activeHome} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                    :
                                    <Image source={AppImages.homeIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                            }
                        </View>
                        <View style={[styles.header, { borderBottomWidth: props.home ? 0 : 0, borderColor: props.home ? Colors.brandBlue : null }]}>
                            <Text style={styles.menu_txt}>{'Home'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => {navigation.navigate('OrderScreen')}}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                {
                                    props.order
                                        ?
                                        <Image source={AppImages.activeOrder} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                        :
                                        <Image source={AppImages.OrderIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                                }
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.job ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Order'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.header}>
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
                </View>
                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => { }}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                <Image source={AppImages.PaymentIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.payment ? Colors.brandBlue : null }} />
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.profile ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Payment'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.header}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_center} onPress={() => {navigation.navigate('ProfileScreen')}}>
                            <View style={[styles.header, { paddingTop: 5 }]}>
                                {
                                    props.user
                                        ?
                                        <Image source={AppImages.activeUser} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? '' : '' }} />
                                        :
                                        <Image source={AppImages.UserIcon} resizeMode={'contain'} style={{ height: 24, width: 24, tintColor: props.home ? ' ' : '' }} />
                                }
                            </View>
                            <View style={[styles.header, { borderBottomWidth: props.profile ? 3 : 0, borderColor: Colors.brandBlue }]}>
                                <Text style={styles.menu_txt}>{'Account'}</Text>
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
        elevation:7,
        shadowColor:Colors.black
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