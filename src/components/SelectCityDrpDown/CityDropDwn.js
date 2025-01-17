// import React, { useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const data = [
//   { label: 'Lucknow', value: 'Lucknow' },
//   { label: 'Delhi', value: 'Delhi' },
//   { label: 'Mumbai', value: 'Mumbai' },
//   { label: 'Kolkata', value: 'Kolkata' },
//   { label: 'Chennai', value: 'Chennai' },
//   // Add more cities as needed
// ];
// const DropdownComponent = ({ selectedCity, onSelect }) => {
//   console.log('aas-----',selectedCity)

//   const [value, setValue] = useState(selectedCity || 'Lucknow');

//   return (
//     <View >
//       <Dropdown
//         style={styles.dropdown}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         inputSearchStyle={styles.inputSearchStyle}
//         iconStyle={styles.iconStyle}
//         data={data}
//         search
//         maxHeight={300}
//         labelField="label"
//         valueField="value"
//         placeholder="Select city"
//         searchPlaceholder="Search..."
//         value={value}
//         onChange={item => {
//           setValue(item.value);
//           onSelect(item.value); // Notify parent of selection change
//         }}
//         renderItem={({ label }) => (
//           <View style={styles.itemContainer}>
//             <Text style={styles.itemText}>{label}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default DropdownComponent;

// const styles = StyleSheet.create({
//   dropdown: {
//     height: 45,
//     borderBottomColor: 'gray',
//     // borderBottomWidth: 0.5,
//     padding:8
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: 'red', // Placeholder text color
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: 'black',
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//     color: 'black', // Search input text color
//   },
//   itemContainer: {
//     padding: 10,
//   },
//   itemText: {
//     fontSize: 16,
//     color: 'black', // Item text color
//   },
// });








import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { hitGetAllCities } from '../../config/api/api';

const DropdownComponent = ({ selectedCity, onSelect }) => {
  const [data, setData] = useState([]); // State to store dropdown data
  const [value, setValue] = useState(selectedCity || null); // Default value
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await hitGetAllCities();
        // console.log('API Response:', response);

        if (Array.isArray(response?.cities)) {
          const formattedData = response?.cities?.map(item => ({
            label: item.city_name,
            value: item.city_name,
          }));
          setData(formattedData);
        } else {
          console.error('Invalid API response format:', response);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginVertical: 20 }} />
      ) : (
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
            if (onSelect) onSelect(item.value); // Notify parent of selection change
          }}
          renderItem={({ label }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{label}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    borderBottomColor: 'gray',
    padding: 8,
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
