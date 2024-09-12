import { Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';

const ProfileTextInput = (props) => {

    const [secureText, setSecureText] = useState(props.secure);
    const [labelOpacity] = useState(new Animated.Value(0));
    const [labelTranslateY] = useState(new Animated.Value(20));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(labelOpacity, {
                toValue: props.showLabel ? 1 : 0,
                duration: props.showLabel ? 300 : 500,
                useNativeDriver: true,
            }),
            Animated.timing(labelTranslateY, {
                toValue: props.showLabel ? 0 : 25,
                duration: props.showLabel ? 300 : 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [props.showLabel]);

    const toggleSecureText = () => {
        setSecureText(!secureText);
    };

    return (
        <View style={[styles.inputContainer]}>
            {
                props.showLabel || labelOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) > 0 ? (
                    <Animated.Text
                        style={[
                            styles.inputTypeText,
                            {
                                opacity: labelOpacity,
                                transform: [{ translateY: labelTranslateY }]
                            },
                        ]}
                    >
                        {props.InputTypeText}
                    </Animated.Text>


                ) : (
                    <Animated.Text
                        style={[
                            styles.inputTypeText,
                            { opacity: labelOpacity, transform: [{ translateY: labelTranslateY }] },
                        ]}
                    >
                        {''}
                    </Animated.Text>
                )}

            <View style={[styles.textInputContainerStyle]}>
                <TextInput
                    placeholder={props.PlaceholderText}
                    style={[styles.TextInputStyle]}
                    placeholderTextColor={Colors.grey}
                    secureTextEntry={secureText}
                    value={props.Value}
                    onChangeText={props.OnChangeText}
                    keyboardType={props.numeric == true ? 'numeric' : 'default'}
                    maxLength={props.maxLength}
                    
                />
                {
                    props.needSecure == true
                    &&
                    <TouchableOpacity onPress={toggleSecureText}>
                        <Image
                            source={secureText ? AppImages.eyeOpen : AppImages.eyeClose}
                            style={styles.textInputImg}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                }
                {
                    props.needSecure == false
                    &&
                    props.InputImg &&
                    <Image
                        source={props.InputImg}
                        style={styles.textInputImg}
                        resizeMode='contain'
                    />
                }
            </View>
        </View>
    );
};

export default ProfileTextInput;

const styles = StyleSheet.create({
    inputContainer: {
        height: responsiveHeight(49),
        marginHorizontal: responsiveWidth(15),
        // backgroundColor: 'red'
    },
    inputTypeText: {
        fontSize: responsiveFontSize(12),
        fontWeight: '500',
        color: Colors.grey,
        marginHorizontal: responsiveWidth(1),
    },
    TextInputStyle: {
        flex: 1,
        color: Colors.black,
        fontSize: responsiveFontSize(18),
        fontWeight: '500',
        height: responsiveHeight(40),
        paddingVertical: 0, // Added line to remove padding
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorderColor,
        flex: 1
        // backgroundColor:'red'
    },
    textInputImg: {
        marginHorizontal: responsiveWidth(10),
    },
});
