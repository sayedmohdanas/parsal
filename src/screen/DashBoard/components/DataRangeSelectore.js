import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  
];

const DateRangeSelector = ({selectedRange, setSelectedRange }) => {
    const [value, setValue] = useState();

  return (
    <View >
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
       
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Today"
        searchPlaceholder="Search..."
        value={selectedRange}
        onChange={item => {
            // setValue(item.value);
            setSelectedRange(item.value);
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

const styles = StyleSheet.create({
    dropdown: {
      height: 40,
      borderBottomColor: 'gray',
      // borderBottomWidth: 0.5,
      padding:8,
      width:130,
      backgroundColor:'white',
      borderRadius:8,
      borderWidth:0.5,
      borderColor:'grey'
    },
    placeholderStyle: {
      fontSize: 16,
      color: 'black', // Placeholder text color
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

export default DateRangeSelector;
