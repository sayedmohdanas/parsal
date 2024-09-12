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
          <Image source={option?.image} style={styles.image} />
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
    height: 70,
    marginBottom: 16,
    borderRadius: 5,
    // backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // elevation: 1,
    borderWidth:0.25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    backgroundColor: '#007BFF',
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default VehicleTypeSelector;
