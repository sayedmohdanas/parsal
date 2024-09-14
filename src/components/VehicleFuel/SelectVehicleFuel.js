import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import BorderLine from '../../common/BorderLine.';
import { errorToast, successToast } from '../../common/CommonFunction';
import Heading from '../Heading/Heading';


const data = [
  { label: 'EV', value: 'EV' },
  { label: 'Petrol', value: 'Petrol' },
];

const SelectVehicleFuel = ({ isVisible, setIsVisible, setSelectedFuelType }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const bottomSheetRef = useRef(null);

  const snapPoints = ['34%'];

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleContinue = () => {
    if (selectedOption) {
      
      setSelectedFuelType(selectedOption);
      setSelectedOption('');
      bottomSheetRef.current?.close(); 
    } else {
      errorToast('Selection Required','Please choose an option before proceeding.');
    }
  };

  // Ensure BottomSheet visibility syncs with `isVisible`
  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isVisible) {
        bottomSheetRef.current.snapToIndex(0);
      } else {
        bottomSheetRef.current.close();
      }
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Initial closed state
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) {
          setIsVisible(false); // Ensure visibility state is synced
        }
      }}
      enablePanDownToClose
    >
      <View style={styles.sheetContent}>
        <Heading text="Select the vehicle fuel type" isRequired={false} />  
        <BorderLine color='black' thickness={1} length='100%' margin={5} />
        {data.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[styles.option, selectedOption === item.value && styles.selectedOption]}
            onPress={() => handleSelect(item.value)}
          >
            <Text style={styles.optionText}>{item.label}</Text>
            {selectedOption === item.value && (
              <Image source={AppImages.check} style={styles.checkIcon} resizeMode='contain' />
            )}
          </TouchableOpacity>
        ))}
       
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    padding: 5,
    paddingHorizontal:15
  },
  sheetTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  option: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  selectedOption: {
    backgroundColor: Colors.lightGray, // Highlight selected option
  },
  optionText: {
    fontSize: 16,
    color:Colors.grey
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  continueButton: {
    backgroundColor: Colors.brandBlue,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default SelectVehicleFuel;
