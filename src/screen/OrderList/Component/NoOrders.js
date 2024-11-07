import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { mystyles } from '../../../common/Mystyle'
import BottomNav from '../../../components/BottomNav/BottomNav'
import AppImages from '../../../common/AppImages'

const NoOrders = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
            <View style={{ flex: 1, backgroundColor: Colors.homeBackground }}>
                <View style={{ margin: 17 }}>
                    <Text style={[styles.orderTextStyle]}>{'Orders'}</Text>
                </View>
                <View style={[{ flex: 1 }, mystyles.center]}>
                    <ImageBackground source={AppImages.boxbackgound} style={styles.boxBackstyle} >
                        <Image source={AppImages.emptyImage} style={styles.emptyboxStyle} resizeMode='contain' />
                    </ImageBackground>
                    <Text style={[styles.emptyTextStyle, { marginTop: 10 }]}>{'Order history limited to last 2 years'}</Text>
                    <Text style={styles.emptyTextStyle}>{'For older orders, contact our support team.'}</Text>

                    <View style={{ marginTop: 15 }}>
                        <CustomButton
                            buttonText={'Book Now'}
                            buttonWidth={153}
                            onPress={() => console.log('book now ')}
                        />
                    </View>
                </View>
            </View>
            <View style={{ marginBottom: 29, }}>
                <BottomNav order={true} />
            </View>
        </SafeAreaView>
    )
}

export default NoOrders

const styles = StyleSheet.create({
    orderTextStyle: {
        fontSize: responsiveFontSize(20),
        fontWeight: '700',
        color: Colors.black
    },
    emptyboxStyle: {
        height: responsiveHeight(169),
        width: responsiveWidth(169)
    },
    boxBackstyle: {
        height: responsiveHeight(133),
        width: responsiveWidth(277),
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyTextStyle: {
        fontSize: responsiveFontSize(13),
        fontWeight: '400',
        color: Colors.grey
    }
})