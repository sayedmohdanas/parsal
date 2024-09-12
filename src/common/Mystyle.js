import { Platform, StyleSheet } from 'react-native';
// import { SmallPhone, responsiveFontSize, responsiveHeight, responsiveWidth } from './metrices';
export const mystyles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flex1: {
        flex: 1
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    alignCenter: {
        alignItems: 'center'
    },
    vertical12: {
        marginVertical: 12
    },
    row: {
        flexDirection: 'row'
    },
    flag: {
        // height: responsiveHeight(24),
        // width: responsiveWidth(24),
        height: 24,
        width: 24,
    },
    number: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginRight: 18,
    },
});