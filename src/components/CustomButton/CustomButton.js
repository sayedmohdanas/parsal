import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'
import { mystyles } from '../../common/Mystyle'

const CustomButton = (props) => {
    const { grey, onPress, buttonText, buttonWidth, disabled } = props;

    const buttonStyle = grey
        ? { backgroundColor: Colors.buttonGrey }
        : { backgroundColor: Colors.brandBlue };
    
    const textStyle = grey
        ? { color: Colors.grey }
        : { color: Colors.white };
    
    const disabledStyle = disabled
        ? { backgroundColor: "#d3d3d3" } 
        : buttonStyle;
    
    const disabledTextStyle = disabled
        ? { color: Colors.black } 
        : textStyle;

    const buttonWidthSet = buttonWidth
        ? { width: buttonWidth }
        : { width: responsiveWidth(335) };

    return (
        <>
            {
                grey === true
                    ?
                    <TouchableHighlight
                        onPress={disabled ? null : onPress}
                        style={[styles.container, mystyles.center, disabledStyle, buttonWidthSet]}
                        underlayColor={'none'}
                        disabled={disabled} 
                    >
                        <Text style={[styles.buttonText, disabledTextStyle]}>{buttonText}</Text>
                    </TouchableHighlight>
                    :
                    <TouchableOpacity
                        onPress={disabled ? null : onPress}
                        style={[styles.container, mystyles.center, disabledStyle, buttonWidthSet]}
                        disabled={disabled} 
                    >
                        <Text style={[styles.buttonText, disabledTextStyle]}>{buttonText}</Text>
                    </TouchableOpacity>
            }
        </>
    );
}

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(56),
        borderRadius: 60,
    },
    buttonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '400',
        color: Colors.white
    }
});
