import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../../../common/Colors';
import { responsiveHeight, responsiveWidth } from '../../../../../common/metrices';
import { CommonStyles, Fonts, FontSizes, Spacing } from '../../../../../common/Theme';
import Line from '../../../../../components/Line/Line';
import { useNavigation } from '@react-navigation/native';

const BankDetailCard = ({ bankAccount }) => {

    const navigation =useNavigation()
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.heading}>Current Bank Details</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("AddBank")}>
                    <Text style={styles.editText}>
                        {bankAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                    </Text>
                </TouchableOpacity>
            </View>
            {bankAccount ? (
                    <>
            <Line marginH={1} />
          
            <View style={styles.contentContainer}>
               
                        <View style={styles.detailContainer}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.detail}>Account Number</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.number}>: {bankAccount?.account_no}</Text>
                            </View>
                        </View>

                        <View style={styles.detailContainer}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.detail}>IFSC Code</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.number}>: {bankAccount?.ifsc_code}</Text>
                            </View>
                        </View>
                
            </View>
            </>
                ) : (
                    null
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        marginTop: responsiveHeight(12),
    },
    headerRow: {
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heading: {
        fontSize: FontSizes.semiLarge,
        fontWeight: Fonts.bold,
        color: Colors.black,
    },
    editText: {
        fontSize: FontSizes.semiLarge,
        fontWeight: Fonts.medium,
        color: Colors.brandBlue,
    },
    contentContainer: {
        width: '85%',
        marginTop: responsiveHeight(4),
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
    },
    detailContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.small,
        gap: Spacing.small,
    },
    detail: {
        fontSize: FontSizes.medium,
        fontWeight: Fonts.medium,
        color: Colors.grey,
    },
    number: {
        fontSize: FontSizes.medium,
        fontWeight: Fonts.medium,
        color: Colors.black,
    },
    noData: {
        fontSize: FontSizes.medium,
        color: Colors.red,
        // textAlign: 'center',
        marginLeft:responsiveWidth(60),
        marginTop: Spacing.large,
    },
});

export default BankDetailCard;
