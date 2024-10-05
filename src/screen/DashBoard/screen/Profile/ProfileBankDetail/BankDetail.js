import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../../../common/Colors';
import BorderLine from '../../../../../common/BorderLine.';
const BankDetailCard = ({bankAccount}) => {
    console.log(bankAccount,'frombnkcard===>')
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.heading}>Current Bank Details</Text>
                <TouchableOpacity onPress={() => alert('Edit Details pressed')}>
                    <Text style={styles.editText}> {bankAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                    </Text>
                </TouchableOpacity>
            </View>

            <BorderLine color="gray" thickness={1} length="100%" orientation="horizontal" margin={1} />

            <View style={{
                width: '85%', marginTop: 4,         padding: 16,
            }}>
                <View style={styles.detailContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.detail}>Account Number</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.number}>:{bankAccount?.account_no}</Text>
                    </View>
                </View>

                <View style={styles.detailContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.detail}>IFSC Code</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.number}>:{bankAccount?.ifsc_code}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
        container: {
            width: '100%',
            backgroundColor: Colors.white,
            // marginVertical: 5
            // marginBottom:12,
            marginTop:12
        },
    headerRow: {
        // padding: 8,
        // paddingHorizontal: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 12,
    },
    heading: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.black,
    },
    editText: {
        fontSize: 16,
        fontWeight:'600',
        color: Colors.brandBlue, 
    },
    detail: {
        fontSize: 16,
        color: Colors.grey,
        fontWeight: '600',
    },
    number: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        // textAlign: 'right',
    },
    detailContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 10,
    },
});

export default BankDetailCard;
