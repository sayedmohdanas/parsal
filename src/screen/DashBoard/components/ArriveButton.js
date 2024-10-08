import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '../../../common/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';
import { mystyles } from '../../../common/Mystyle';
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
// import Colors from '../../common/Colors'
// import { mystyles } from '../../common/Mystyle'

const ArriveButton = (props) => {
    const { grey, onPress, buttonText, buttonWidth, disabled } = props;

    const buttonStyle = grey
        ? { backgroundColor: Colors.buttonGrey }
        : { backgroundColor: Colors.black };
    
    const textStyle = grey
        ? { color: Colors.white }
        : { color: Colors.white };
    
    const disabledStyle = disabled
        ? { backgroundColor: "#D1D1D1" } 
        : buttonStyle;
    
    const disabledTextStyle = disabled
        ? { color: Colors.black } 
        : textStyle;

    const buttonWidthSet = buttonWidth
        ? { width: buttonWidth }
        : { width: "88%" };

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

export default ArriveButton;

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(50),
        borderRadius: 30,
    },
    buttonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '400',
        color: Colors.white
    }
});
