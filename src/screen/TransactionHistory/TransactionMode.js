import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../../common/Colors';
import { responsiveFontSize } from '../../common/metrices';

const TransactionMode = props => {
    return (
        <View style={styles.container}>
            <Text style={styles.number}> ₹{props.number}</Text>
            <Text style={styles.dataName}>{props.dataName}</Text>
        </View>
    );
};

export default TransactionMode;

const styles = StyleSheet.create({
    number: {
        fontSize: responsiveFontSize(16),
        fontWeight: '500',
        color: Colors.black,
        textAlign: 'center',
    },
    dataName: {
        fontSize: responsiveFontSize(14),
        fontWeight: '400',
        color: Colors.grey,
        textAlign: 'center',
    },
});
