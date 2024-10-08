import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import ArriveButton from './path-to-your/ArriveButton'; // Adjust the import path
import { responsiveHeight, responsiveFontSize, responsiveWidth } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import ArriveButton from '../components/ArriveButton';

const AmountCollectScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.upperHalf}>
                <Text style={styles.amountText}>₹50</Text>
                <View style={{paddingHorizontal:responsiveWidth(80),justifyContent:'center',alignItems:'center'}}>

                <Text style={styles.label}>Chinmaya Nand to pay in cash</Text>
                </View>
            </View>

            <View style={styles.lowerHalf}>
                <ArriveButton buttonText={'Cash Collected'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.homeBackground,
    },
    upperHalf: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#089550',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    lowerHalf: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    amountText: {
        fontSize: responsiveFontSize(60),
        fontWeight: '700',
        // fontFamily:'inter',
        color: Colors.white,
        lineHeight:72.61,
        textAlign:'center'
    },
    label: {
        fontSize: responsiveFontSize(24),
        fontWeight: '700',
        color: Colors.white,
        marginTop: responsiveHeight(50),
        textAlign:'center'
    },
});

export default AmountCollectScreen;
