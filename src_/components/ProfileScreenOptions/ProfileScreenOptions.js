import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'
import AppImages from '../../common/AppImages'

const ProfileScreenOptions = (props) => {
    return (
        <TouchableHighlight>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image source={props.Icon} style={styles.iconStyle} resizeMode='contain' />
                    <Text style={styles.optionName}>{props.optionName}</Text>
                </View>
                <View>
                    <Image source={AppImages.optionRightArrow} style={styles.iconStyle} resizeMode='contain' />
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default ProfileScreenOptions

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(52),
        backgroundColor: Colors.white,
        borderRadius: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:5
    },
    iconStyle: {
        height: responsiveHeight(28),
        width: responsiveWidth(28)
    },
    optionName: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        color: Colors.black,
        marginLeft: responsiveWidth(10)
    }
})