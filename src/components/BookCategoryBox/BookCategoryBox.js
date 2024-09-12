import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices'
import AppImages from '../../common/AppImages'
import Colors from '../../common/Colors'

const BookCategoryBox = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                <View style={[styles.imageContainer,
                {
                    backgroundColor: props.imgbackground,


                }]}>
                    <Image
                        source={props.boxImg}
                        style={{
                            height: responsiveHeight(props.imgHeight),
                            width: responsiveWidth(props.imgWidth),
                            marginBottom: props.imgMarginBottom
                        }}
                        resizeMode='contain'
                    />
                    {
                        props.extraImg
                        &&
                        <Image
                            source={AppImages.boxImg}
                            style={{
                                position: 'absolute',
                                height: responsiveHeight(35),
                                width: responsiveWidth(42),
                                right: responsiveWidth(43),
                                top: responsiveHeight(27)
                            }}
                            resizeMode='contain'
                        />
                    }
                </View>

                <View style={styles.categoryName}>
                    <Text style={{
                        fontSize: responsiveFontSize(16),
                        fontWeight: '600',
                        color: Colors.black
                    }}>
                        {props.boxHeading}
                    </Text>

                    <Text style={{
                        fontSize: responsiveFontSize(11),
                        fontWeight: '400',
                        color: Colors.black
                    }}>
                        {props.boxSubHeading}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default BookCategoryBox

const styles = StyleSheet.create({
    container: {
        height: responsiveHeight(145),
        width: responsiveWidth(157),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.bookCategoryBorder
    },
    imageContainer: {
        flex: 2,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryName: {
        flex: 1.4,
        // backgroundColor: 'green'
        justifyContent: 'center',
        // alignItems:'center',
        paddingHorizontal: responsiveWidth(10),
        borderTopWidth: 1,
        borderColor: Colors.bookCategoryBorder
    }
})