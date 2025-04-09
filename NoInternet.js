import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';
import { responsiveFontSize } from './src/common/metrices';
import AppImages from './src/common/AppImages';
import { errorToast } from './src/common/CommonFunction';
const NoInternet = () => {
    const handleRetry = async () => {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            // If we’ve regained connectivity, restart the app:
            RNRestart.Restart();
        } else {
            // Still offline—give user feedback
            // errorToast('Still no connection', 'Please check your internet and try again.');
            Alert.alert("Please check your internet and try again.")
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={AppImages.noInternet}
                style={styles.image}
            />
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.subtitle}>Please check your internet and try again.</Text>
            <TouchableHighlight onPress={handleRetry} underlayColor={'none'}>
                <Text style={{
                    color: 'blue',
                    fontSize: responsiveFontSize(18),
                    marginTop: 20
                }}>
                    Retry
                </Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}
export default NoInternet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});