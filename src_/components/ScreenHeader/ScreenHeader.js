import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'

const ScreenHeader = (props) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headText}>{props.headText ? props.headText : null}</Text>
            <Text style={styles.bodyText}>{props.bodyText ? props.bodyText : null}</Text>
        </View>
    )
}

export default ScreenHeader

const styles = StyleSheet.create({
    headerContainer: {
        marginVertical: responsiveHeight(14),
        justifyContent: 'flex-start',
        marginHorizontal: 14
    },
    headText: {
        fontSize: responsiveFontSize(24),
        fontWeight: '700',
        color: Colors.black
    },
    bodyText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '400',
        color: Colors.grey,
        marginTop: responsiveHeight(10)
    }
})