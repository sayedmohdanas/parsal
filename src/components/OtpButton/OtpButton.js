import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import { mystyles } from '../../common/Mystyle'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'
import AppImages from '../../common/AppImages'

const OtpButton = (props) => {
    return (
        <TouchableHighlight style={[styles.container, mystyles.center]}>
            <View style={[mystyles.row, styles.buttonInnerContainer]}>
                <Image source={props.imgSrc} style={styles.imgStyle} resizeMode='contain' />
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </View>
        </TouchableHighlight>
    )
}

export default OtpButton

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(40),
        width: responsiveWidth(187),
        borderRadius: 10,
        backgroundColor: Colors.otpButtonColor,
    },
    imgStyle: {
        height: responsiveHeight(18),
        width: responsiveWidth(18),
    },
    buttonText: {
        fontWeight: '400',
        fontSize: responsiveFontSize(12),
        color: Colors.grey,
        // marginLeft:1
    },
    buttonInnerContainer: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // backgroundColor: 'red',
        width: '80%'
    }
})