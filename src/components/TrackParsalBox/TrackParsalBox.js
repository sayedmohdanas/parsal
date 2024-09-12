import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import Colors from '../../common/Colors'
import AppImages from '../../common/AppImages'

const TrackParsalBox = (props) => {
    return (
        <LinearGradient
            colors={['#333333', '#434343']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >
            <View style={{
                flex: 2,
                // backgroundColor: 'red',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ marginTop: responsiveHeight(10), marginLeft: responsiveWidth(15) }} >
                    <Text style={{
                        fontSize: responsiveFontSize(22),
                        fontWeight: '500',
                        color: Colors.white
                    }}>
                        {'Track your Parsal'}
                    </Text>
                    <Text style={{
                        fontSize: responsiveFontSize(14),
                        fontWeight: '500',
                        color: Colors.buttonGrey
                    }}>
                        {'Enter your parcel tracking number'}
                    </Text>
                </View>

                <Image
                    source={AppImages.TrackParsalImg}
                    style={{
                        height: responsiveHeight(80),
                        width: responsiveWidth(70),
                    }}
                    resizeMode='contain'
                />
            </View>

            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: responsiveHeight(20) }}>
                <View style={{
                    height: responsiveHeight(50),
                    width: responsiveWidth(226),
                    borderRadius: 10,
                    backgroundColor: '#606060',
                    // marginBottom: responsiveHeight(50),
                    justifyContent: 'center'
                }}>
                    <TextInput
                        placeholder='Your Tracking number'
                        placeholderTextColor={Colors.trackingBoxPlaceholderColor}
                        style={{
                            marginLeft: responsiveWidth(15),
                            // marginBottom:20
                        }}
                    />
                </View>

                <TouchableHighlight>
                    <View style={{
                        height: responsiveHeight(50),
                        width: responsiveWidth(70),
                        backgroundColor: Colors.brandBlue,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: responsiveFontSize(16), fontWeight: '400', color: Colors.white }}>{'Track'}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </LinearGradient>
    )
}

export default TrackParsalBox

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(152),
        marginHorizontal: responsiveWidth(23),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // flex:1
    }
})
