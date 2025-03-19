import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices'
import AppImages from '../../../common/AppImages'
import { FontSizes } from '../../../common/Theme'
import Colors from '../../../common/Colors'

const HelpAndSupportCard = ({ topic, status, description, createdAt, onPress,ticketId }) => {
 console.log('status======>>>>',status);
 
    const statusInfo = {
        text: status === 0 ? "Open" : "Closed",
        textColor: status === 0 ? '#567D40' : '#7D4040',
        backgroundColor: status === 0 ? '#E5F6E6' : '#F6E5E5',
    }

    return (
        <TouchableHighlight onPress={onPress} underlayColor={'none'}>
            <View style={{
                marginHorizontal: responsiveWidth(8),
                backgroundColor: 'white',
                // elevation: 1,
                marginVertical: responsiveHeight(4),
                borderRadius: responsiveHeight(10),
                padding: 10,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // backgroundColor:'yellow',
                    // flex:1,
                    // width:'20%'
                }}>

                    <View style={{
                        flexDirection: 'row',
                        // backgroundColor:'pink',
                        // flex:1,'
                        width: '80%'

                    }}>
                        <Image source={AppImages.helpAndSupportWatch} resizeMode='contain' style={{
                            height: responsiveHeight(25),
                            width: responsiveWidth(25),
                            marginTop: responsiveHeight(2)
                        }} />
                        <View style={{
                            // flexDirection: 'row',
                            justifyContent: 'space-between',
                            // alignItems: 'center'
                        }}>
                            <Text style={styles.ticketIdText}>
                                {topic.split(' ').length > 7 ? `${topic.split(' ').slice(0, 7).join(' ')}...` : topic}
                            </Text>
                            <Text style={[styles.ticketIdText,{fontSize:FontSizes.small,color:Colors.grey}]}>{`Ticket ID ${ticketId}`}</Text>


                        </View>
                    </View>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                    <View style={[
                    styles.parsalStatus,
                    { backgroundColor: statusInfo.backgroundColor }
                ]}>
                    <Text style={[
                        styles.parsalStatusText,
                        { color: statusInfo.textColor }
                    ]}>{statusInfo.text}</Text>
                </View>
                    <Text style={styles.dateText}>{createdAt}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    parsalStatus: {
        borderRadius: responsiveHeight(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(10),
        paddingVertical:responsiveHeight(2),
        marginBottom:responsiveHeight(3)
    },
    parsalStatusText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
    },
    ticketIdText: {
        fontSize: responsiveFontSize(14),
        fontWeight: '500',
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