import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Colors from '../../common/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import SoundPlayer from 'react-native-sound-player';
const CircularProgressComponent = ({ timer, setModalVisible }) => {
    const fill = (timer / 15) * 100;
    const isLastThreeSeconds = timer <= 3;
    useEffect(() => {
        if (isLastThreeSeconds) {
            playNotificationSound();
        }
    }, [timer]);
    const playNotificationSound = () => {
        try {
            SoundPlayer.playSoundFile('notification', 'mp3');
        } catch (e) {
            console.log('Cannot play the sound file', e);
        }
    };
    return (
        <View style={styles.container}>
            <AnimatedCircularProgress
                size={70}
                width={4}
                fill={fill}
                tintColor={isLastThreeSeconds ? Colors.red : Colors.brandBlue} // Change color based on timer
                backgroundColor=""
                rotation={-2}
            >
                {() => (
                    <Text style={[styles.text, { color: isLastThreeSeconds ? Colors.red : Colors.brandBlue }]}>
                        {timer}
                    </Text>
                )}
            </AnimatedCircularProgress>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(242, 242, 242, 0.8)',
        alignSelf: 'center',
        justifyContent: 'center',
        width: responsiveWidth(62),
        height: responsiveHeight(62),
        borderRadius: 50,
        alignItems: 'center',
        marginTop: responsiveHeight(24),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    text: {
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        fontSize: responsiveFontSize(34),
        fontWeight: '500',
    },
});


export default CircularProgressComponent