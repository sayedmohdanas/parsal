import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react'
import { responsiveHeight, responsiveWidth } from '../../common/metrices';
import Colors from '../../common/Colors';

const CustomRadioButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.radioButtonContainer}>
            <Text style={[styles.radioButtonText, props.selected ? { color: Colors.brandBlue } : { color: 'black' }]}>
                {props.label}
            </Text>
            <View style={styles.radioButton}>
                {props.selected && <View style={styles.radioButtonSelected} />}
            </View>
        </TouchableOpacity>
    )
}

export default CustomRadioButton

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: responsiveWidth(335),
        height: responsiveHeight(52),
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        justifyContent: 'space-between',
        borderColor: '#D8D8D8'
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        height: 15,
        width: 15,
        borderRadius: 10,
        backgroundColor: 'green',
    },
    radioButtonText: {
        fontSize: 18,
        fontWeight: '500'
    },
});