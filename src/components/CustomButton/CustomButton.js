import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'
import { mystyles } from '../../common/Mystyle'

const CustomButton = (props) => {

    const { grey, onPress, buttonText, buttonWidth } = props;


    const buttonStyle = grey ? { backgroundColor: Colors.buttonGrey } : { backgroundColor: Colors.brandBlue };
    const textStyle = grey ? { color: Colors.grey } : { color: Colors.white };
    const buttonWidthSet = buttonWidth ? { width: buttonWidth } : { width: responsiveWidth(335) }

    return (
        <>
            {
                grey === true
                    ?
                    <TouchableHighlight onPress={onPress} style={[styles.container, mystyles.center, buttonStyle, buttonWidthSet]} underlayColor={'none'}>
                        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
                    </TouchableHighlight>
                    :
                    <TouchableOpacity onPress={onPress} style={[styles.container, mystyles.center, buttonStyle, buttonWidthSet]}>
                        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
                    </TouchableOpacity>
            }
        </>
    );
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(56),

        borderRadius: 60,
        // backgroundColor: Colors.black,
        // width:'100%'
    },
    buttonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '400',
        color: Colors.white
    }
})