import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import Colors from '../../common/Colors';
import { responsiveFontSize } from '../../common/metrices';

const CustomTextInput = ({  value, 
  onChangeText, 
  placeholder, 
  label, 
  isRequired, 
  type = 'text',  // Default to 'text' if type is not provided
  maxLength }) => {
  const labelAnimation = useRef(new Animated.Value(0)).current;

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 2],
    outputRange: [6, -23], 
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [17, 15], 
  });



  const handleChange = (text) => {
    if (type === 'number') {
      text = text.replace(/[^0-9]/g, ''); 
    }

    if (maxLength && text.length > maxLength) {
      text = text.slice(0, maxLength);
    }

    onChangeText(text);
    Animated.timing(labelAnimation, {
      toValue: text?.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const triggerLabelAnimation = (text) => {
    Animated.timing(labelAnimation, {
      toValue: text?.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    // Trigger animation when value changes (such as when checkbox is checked)
    triggerLabelAnimation(value);
  }, [value]);

  return (
    <View style={styles.card}>
      <View style={styles.inputContainer}>
        <Animated.Text style={[styles.label, { top: labelTop, fontSize: labelFontSize }]}>
          {label}{isRequired && <Text style={styles.redAsterisk}>*</Text>}
        </Animated.Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          cursorColor={'transparent'}
          placeholderTextColor="transparent"
          keyboardType={type === 'number' ? 'numeric' : 'default'}
          maxLength={maxLength} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    paddingBottom:0,
    borderBottomWidth:1,
    borderColor: Colors.textInputBorderColor,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
  },
  inputContainer: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 0,
    color: '#333',
    marginLeft: 4,
  },
  input: {
    fontSize:responsiveFontSize(16),
    color: 'black',
  },
  redAsterisk: {
    color: 'red',
  },
});

export default CustomTextInput;
