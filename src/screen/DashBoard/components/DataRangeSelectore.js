import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import AppImages from '../../../common/AppImages';

const data = [
  {label: 'This Week Earning', value: 'week'},
  {label: "Today's Earning", value: 'today'},
];

const DateRangeSelector = ({selectedRange, setSelectedRange}) => {
  const [value, setValue] = useState();

  return (
    // <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        renderRightIcon={() => (
          <Image source={AppImages.dropbtn}  style={{height:responsiveHeight(7),width:responsiveWidth(7)}} resizeMode='contain'/>  // Custom dropdown icon
        )}
        labelField="label"
        valueField="value"
        placeholder="Today's Earning"
        searchPlaceholder="Search..."
        value={selectedRange}
        onChange={item => {
          setSelectedRange(item.value);
        }}
        renderItem={({label}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{label}</Text>
          </View>
        )}
      />
    // </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: responsiveHeight(35),    
    // borderBottomWidth: 0.5,
    padding: 8,
    width: responsiveWidth(110),
    // backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 0.4,
    borderColor: '#D8D8D8',
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(11),
    color: Colors.grey, // Item text color
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(11),
    color: Colors.grey,
    fontWeight:'700'
    
    // Item text color
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: responsiveFontSize(11),
    color: Colors.grey, // Item text color
  },
  itemContainer: {
    padding: 10,
  },
  itemText: {
    fontSize: responsiveFontSize(9),
    color: Colors.grey, // Item text color
  },
});

export default DateRangeSelector;
