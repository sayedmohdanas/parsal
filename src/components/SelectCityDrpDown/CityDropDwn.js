import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Lucknow', value: 'Lucknow' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Kolkata', value: 'Kolkata' },
  { label: 'Chennai', value: 'Chennai' },
  // Add more cities as needed
];

const DropdownComponent = ({ selectedCity, onSelect }) => {
  const [value, setValue] = useState(selectedCity || 'Lucknow');

  return (
    <View >
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select city"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
          onSelect(item.value); // Notify parent of selection change
        }}
        renderItem={({ label }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{label}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderBottomColor: 'gray',
    // borderBottomWidth: 0.5,
    padding:8
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'red', // Placeholder text color
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black', // Search input text color
  },
  itemContainer: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    color: 'black', // Item text color
  },
});
