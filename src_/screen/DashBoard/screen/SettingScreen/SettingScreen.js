import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import BottomNav from '../../../../../navigation/BottomNav';// import { responsiveHeight, responsiveFontSize } from '../../common/metrices';
import Colors from '../../../../common/Colors';
import { responsiveFontSize, responsiveHeight } from '../../../../common/metrices';
import CustomHeader from '../../components/CustomHeader';

const SettingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header or Title */}
            <View >
                <CustomHeader screenName={"Setting"}/>
                {/* <Text style={styles.headerText}>Settings</Text> */}
            </View>

            {/* Settings Content */}
            <View style={styles.content}>
                <Text style={styles.settingOption}>Account</Text>
                <Text style={styles.settingOption}>Privacy</Text>
                <Text style={styles.settingOption}>Notifications</Text>
                <Text style={styles.settingOption}>Help</Text>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavContainer}>
                <BottomNav Setting={true} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.homeBackground,
        justifyContent: 'space-between',
    },
    header: {
        padding: responsiveHeight(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.brandBlue, // adjust the color to your app's theme
    },
    headerText: {
        fontSize: responsiveFontSize(18),
        fontWeight: '700',
        color: Colors.white,
    },
    content: {
        flex: 1,
        padding: responsiveHeight(15),
        justifyContent: 'flex-start',
    },
    settingOption: {
        fontSize: responsiveFontSize(16),
        marginVertical: responsiveHeight(10),
        color: Colors.black,
    },
    bottomNavContainer: {
        marginBottom: responsiveHeight(12),
    },
});

export default SettingScreen;
