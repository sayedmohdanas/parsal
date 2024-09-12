// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import BottomSheet from 'reanimated-bottom-sheet';

// const options = [
//   { label: 'Petrol', value: 'Petrol' },
//   { label: 'EV', value: 'EV' },
// ];

// const SelectVehicleFuel = ({ selectedFuel, onSelect }) => {
//   const [value, setValue] = useState(selectedFuel || 'Petrol');
//   const [isSheetVisible, setSheetVisible] = useState(false);

//   const handleSelect = (item) => {
//     setValue(item.value);
//     onSelect(item.value);
//     setSheetVisible(false);
//   };

//   const renderContent = () => (
//     <View style={styles.bottomSheetContent}>
//       {options.map(option => (
//         <TouchableOpacity
//           key={option.value}
//           style={styles.option}
//           onPress={() => handleSelect(option)}
//         >
//           <Text style={styles.optionText}>{option.label}</Text>
//         </TouchableOpacity>
//       ))}
//       <TouchableOpacity
//         style={styles.continueButton}
//         onPress={() => setSheetVisible(false)}
//       >
//         <Text style={styles.continueButtonText}>Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View>
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setSheetVisible(true)}
//       >
//         <Text style={styles.selectedTextStyle}>{value}</Text>
//       </TouchableOpacity>

//       <BottomSheet
//         snapPoints={[300, 0]}
//         borderRadius={10}
//         renderContent={renderContent}
//         initialSnap={1}
//         enabledGestureInteraction={true}
//         onCloseEnd={() => setSheetVisible(false)}
//       />
//     </View>
//   );
// };

// export default SelectVehicleFuel;

// const styles = StyleSheet.create({
//   dropdown: {
//     height: 50,
//     borderBottomColor: 'gray',
//     borderBottomWidth: 0.5,
//     padding: 8,
//     justifyContent: 'center',
//     backgroundColor: 'white', // Match background color with dropdown
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: 'black',
//   },
//   bottomSheetContent: {
//     backgroundColor: 'white',
//     padding: 16,
//     height: 300,
//   },
//   option: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   optionText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   continueButton: {
//     padding: 15,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   continueButtonText: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//   },
// });



import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Petrol', value: 'Petrol' },
  { label: 'EV', value: 'EV' },
];

const SelectVehicleFuel = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const snapPoints = ['25%', '50%'];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
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
        placeholder="Select Fuel"
        searchPlaceholder="Search..."
        value={selectedOption}
        onChange={item => handleSelect(item.value)}
        renderItem={({ label }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{label}</Text>
          </View>
        )}
      />
      
      <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Open Bottom Sheet</Text>
      </TouchableOpacity>
      
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        onClose={() => setIsVisible(false)}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Select Fuel Type</Text>
          {data.map(item => (
            <TouchableOpacity key={item.value} style={styles.option} onPress={() => handleSelect(item.value)}>
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    padding: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'red',
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
    color: 'black',
  },
  itemContainer: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  sheetTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default SelectVehicleFuel;
