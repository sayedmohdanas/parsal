import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';

const FloatingLabelInput = ({ label, value, onChangeText, placeholder }) => {
  const labelAnimation = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -24], // Adjust these values as needed
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12], // Adjust these values as needed
  });

  const handleFocus = () => {
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (value.length === 0) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    Animated.timing(labelAnimation, {
      toValue: text.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, { top: labelTop, fontSize: labelFontSize }]}>
        {label}<Text style={styles.redAsterisk}>*</Text>
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor="transparent" // Make the placeholder text transparent
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 0,
    color: '#333',
    backgroundColor: '#f9f9f9', // Matches the card background
    marginLeft: 4,
    zIndex: 1, // Ensure label is above the input
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingVertical: 12,
    paddingTop: 20, // Space for the floating label
    color: 'black',
  },
  redAsterisk: {
    color: 'red',
  },
});

export default FloatingLabelInput;
