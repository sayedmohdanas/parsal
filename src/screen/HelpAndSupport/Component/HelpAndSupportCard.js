import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices'
import AppImages from '../../../common/AppImages'

const HelpAndSupportCard = ({ topic, status, description, createdAt, onPress }) => {

    const statusInfo = {
        text: status === 1 ? "Open" : "Closed",
        textColor: status === 1 ? '#567D40' : '#7D4040',
        backgroundColor: status === 1 ? '#E5F6E6' : '#F6E5E5',
    }

    return (
        <TouchableHighlight onPress={onPress} underlayColor={'none'}>
            <View style={{
                marginHorizontal: responsiveWidth(16),
                backgroundColor: 'white',
                // elevation: 1,
                marginVertical: responsiveHeight(4),
                borderRadius: responsiveHeight(10),
                padding: 10,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems:'center'
                }}>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Image source={AppImages.helpAndSupportWatch} resizeMode='contain' style={{
                            height: responsiveHeight(25),
                            width: responsiveWidth(25),
                            marginTop:responsiveHeight(2)
                        }} />
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.ticketIdText}>{topic}</Text>

                            {/* Status View */}

                        </View>
                    </View>
                    <Text style={styles.dateText}>{createdAt}</Text>
                </View>
                <View style={[
                    styles.parsalStatus,
                    { backgroundColor: statusInfo.backgroundColor }
                ]}>
                    <Text style={[
                        styles.parsalStatusText,
                        { color: statusInfo.textColor }
                    ]}>{statusInfo.text}</Text>
                </View>
                {/* <View style={{ marginTop: responsiveHeight(1) }}>
                <Text style={styles.descriptionText}>{description}</Text>
            </View> */}
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    parsalStatus: {
        height: responsiveHeight(20),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 13,
        width: responsiveWidth(55),
        marginLeft:responsiveWidth(40),
        marginTop:responsiveHeight(10)
    },
    parsalStatusText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
    },
    ticketIdText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '600',
        color: 'black',
        marginRight: responsiveWidth(10),
        marginLeft: responsiveWidth(15)
    },
    dateText: {
        color: 'grey',
        fontSize: responsiveFontSize(12),
    },
    descriptionText: {
        marginTop: responsiveHeight(4),
        color: 'grey',
    }
})

export default HelpAndSupportCard