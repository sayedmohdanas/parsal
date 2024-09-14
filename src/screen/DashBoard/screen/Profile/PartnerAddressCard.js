import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';

const PartnerAddressCard = ({ address, mobileNumber, additionalData }) => {
    return (
        <View style={styles.card}>
            <View style={styles.section}>
                <Text style={styles.label}>Home Address:</Text>
                <Text style={styles.data}>{address}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Mobile Number:</Text>
                <Text style={styles.data}>{mobileNumber}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width:'100%',
        padding: 16,
        margin: 5,
       backgroundColor:Colors.white
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        color:Colors.grey
    },
    data: {
        
        fontSize: 16,
        color:Colors.black
    },
});

export default PartnerAddressCard;
