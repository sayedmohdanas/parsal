import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../common/Colors';

const VehicleTypeSelector = ({options, onSelect, selectedOption}) => {
  return (
    <View style={styles.container}>
      {options.map(option => {
        return (
          <TouchableOpacity
            key={option?.vehicle_type_id}
            style={[
              styles.card,
              selectedOption[0]?.vehicle_type_id == option?.vehicle_type_id &&
                styles.selectedCard,
            ]}
            onPress={() => onSelect(option.vehicle_type_id)} // Passing only the value to the onSelect function
          >
            <Image
              resizeMode="contain"
              source={option?.vehicle_img}
              style={[
                styles.image,
                {
                  tintColor:
                    selectedOption[0]?.vehicle_type_id ==
                    option?.vehicle_type_id
                      ? Colors.white
                      : Colors.black,
                },
              ]}
            />
            <Text
              style={[
                styles.text,
                {
                  color:
                    selectedOption[0]?.vehicle_type_id ==
                    option?.vehicle_type_id
                      ? Colors.white
                      : Colors.black,
                },
              ]}>
              {option?.vehicle_type_cat_name}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    backgroundColor: Colors.white,
  },
  selectedCard: {
    backgroundColor: Colors.brandBlue,
    // borderWidth: 2,
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
});

export default VehicleTypeSelector;
