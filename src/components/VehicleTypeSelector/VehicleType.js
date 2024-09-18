import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const VehicleTypeSelector = ({ options, onSelect, selectedOption }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option?.value}
          style={[
            styles.card,
            selectedOption?.value === option?.value && styles.selectedCard,
          ]}
          onPress={() => onSelect(option.value)} // Passing only the value to the onSelect function
        >
          <Image resizeMode='contain' source={option?.image} style={styles.image} />
          <Text style={styles.text}>{option?.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  card: {
    width: '30%',
    // height: 30,
    marginBottom: 16,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.white
  },
  selectedCard: {
    backgroundColor: '#007BFF',
  },
  image: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
});

export default VehicleTypeSelector;
