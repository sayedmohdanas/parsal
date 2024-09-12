import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../common/Colors'
import { responsiveWidth } from '../../common/metrices'

const Line = (props) => {
    return (
        <View style={{
            height: 1,
            backgroundColor: '#D8D8D8',
            marginHorizontal: responsiveWidth(props.marginH),
            marginVertical:8
        }}>
        </View>
    )
}

export default Line

const styles = StyleSheet.create({})