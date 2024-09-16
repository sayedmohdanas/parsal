import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, Text, TouchableOpacity, ScrollView, Button, TextInput, TouchableWithoutFeedback } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import VehicleTypeSelector from '../../components/VehicleTypeSelector/VehicleType';
import Heading from '../../components/Heading/Heading';
import DropdownComponent from '../../components/SelectCityDrpDown/CityDropDwn';
import SelectVehicleFuel from '../../components/VehicleFuel/SelectVehicleFuel';
import { useDispatch, useSelector } from 'react-redux';
import { addVehicle, setParentId, } from '../../redux/HitApis/HitApiSlice';
import PageButtons from '../../components/TempBtn/TempBtn';
import { useIsFocused } from '@react-navigation/native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import { successToast } from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VehicleDetailScreen = ({ navigation }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [rcUploaded, setRcUploaded] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [showVehicleOptions, setShowVehicleOptions] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [showVehicleBodyType, setShowVehicleBodyType] = useState(true);
  const [showEditOption, setShowEditOption] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFuelType,setSelectedFuelType] =useState(0)

  const dispatch = useDispatch();
  const vehicleOptions = [
    { value: 3, label: 'Truck', image: AppImages.truckImage },
    { value: 2, label: '3W', image: AppImages.threeWheelerImage },
    { value: 1, label: '2W', image: AppImages.twoWheelerImage },
  ];
  const partnerId = useSelector(state => state?.parsalPartner?.partnerId)
  useEffect(() => {
    const pId = async () => {
      // await AsyncStorage.removeItem('partner_id');
      const parent_id = await AsyncStorage.getItem('partner_id')
      console.log('parent id in login', parent_id)
      dispatch(setParentId(parent_id))
    }
    pId()
  }, [])

  const bodyTypeOptions = [
    { value: 'Scooter', label: 'Scooter', image: AppImages.scooterImage },
    { value: 'Bike', label: 'Bike', image: AppImages.twoWheelerImage },
  ];
  const selectedVehicleModel = 'Toyota Corolla';
  const selectedVehicleColor = 'Blue';
  const selectedVehicleName = 'Corolla';
  const selectedVehicleCapacity = 5;

  const toggleBottomSheet = () => {
    setIsVisible(prev => !prev); 
  }; 

console.log('partnerId',partnerId);


  const handleSubmit = async () => {

    const payload = {
      partner_id: partnerId,
      driver_id: null,
      vehicle_number: vehicleNumber,
      vehicle_type: selectedVehicleType ? selectedVehicleType.value : 'v-type',
      vehicle_model: selectedVehicleModel,
      vehicle_color: selectedVehicleColor,
      fuel_type: selectedFuelType === "Petrol" ? 2 : selectedFuelType === "EV" ? 1 : null,
      vehicle_name: selectedVehicleName,
      vehicle_capacity: selectedVehicleCapacity || 5,
      operational_city: selectedCity ? selectedCity : 'london',
      vehicle_docs: [
        {
          partner_id: partnerId,
          doc_id: 3,
          img_name: `${vehicleNumber}_rc.png`,
          img_src: rcUploaded?.base64 || ''
        }
      ]
    };
    if (
      payload.vehicle_number &&
      payload.vehicle_docs[0].img_src &&
      payload.vehicle_type &&
      payload.fuel_type &&
      payload.vehicle_model
    ) {

      try {
        console.log('payload',payload);
       
        
        const resultAction = await dispatch(addVehicle(payload));
        // if (resultAction.meta.requestStatus === 'fulfilled') {
          if (addVehicle.fulfilled.match(resultAction)) {
          // Alert.alert('Submitted');
          successToast('Submitted',"Vehicle details have been submitted")

          navigation.navigate('MyVehicles');
        
        } else {
          Alert.alert('Error', resultAction.payload?.message || 'An error occurred while submitting.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
        console.error('here is error', error);
      }
      successToast('Submitted',"Vehicle details have been submitted")

      // Alert.alert('Submitted', 'Vehicle details have been submitted.');

    } else {
      Alert.alert('Error', 'Please fill  all fields.');
    }
  
  };

  const handleOptionEdit = () => {
    setShowVehicleOptions(true);
    setShowVehicleBodyType(true);
  };

  const handleBodyTypeEdit = () => {
    setShowVehicleBodyType(true);
    setShowEditOption(false);
  };

  const handleVehicleSelect = (value) => {
    const selectedOption = vehicleOptions.find(option => option.value === value);
    setSelectedVehicleType(selectedOption);
    setShowVehicleOptions(false);

  };

  const handleBodyTypeSelect = (value) => {
    const selectedOption = bodyTypeOptions.find(option => option.value === value);
    setSelectedBodyType(selectedOption);
    setShowVehicleBodyType(false);
    setShowEditOption(true);
  };

  const isEnabled = vehicleNumber && rcUploaded && selectedVehicleType && selectedBodyType;

  return ( 
    <>
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Heading text="Add RC Details" isRequired={false} />

        <CustomTextInput
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="Vehicle Number"
          label="Vehicle Number"
          isRequired={true}
        />

        <ImagePicker
          labelText="Vehicle RC"
          uploaded={rcUploaded}
          onImagePick={setRcUploaded}
          useCamera={false}
        />

        <Heading text="Select the city of Operation" isRequired={false} />

        <View style={styles.cityDripDownCard}>
          <DropdownComponent
            selectedCity={selectedCity}
            onSelect={setSelectedCity}
          />
        </View>
        <Heading text="Select Vehicle Type" isRequired={false} />
        {showVehicleOptions ? (
          <VehicleTypeSelector
            options={vehicleOptions}
            selectedOption={selectedVehicleType ? selectedVehicleType.value : null}
            onSelect={handleVehicleSelect}
          />
        ) : (
          selectedVehicleType && (
            <View>
              <View style={styles.fullWidthCard}>
                <Image source={selectedVehicleType.image} style={styles.fullWidthImage} />
                <Text style={styles.vehicleLabel}>{selectedVehicleType.label}</Text>
                <TouchableOpacity onPress={handleOptionEdit}>
                  <View style={{ padding: 3 }}>
                    <Image
                      source={AppImages.editPen}

                    />
                  </View>

                </TouchableOpacity>
              </View>

              <Heading text="Select the vehicle body type" isRequired={false} />
              {showVehicleBodyType ? (
                <View style={styles.bodyTypeCardFullWidth}>
                  {bodyTypeOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.bodyTypeCard,
                        selectedBodyType?.value === option.value && styles.selectedBodyTypeCard,
                      ]}
                      onPress={() => handleBodyTypeSelect(option.value)}
                    >
                      <Image source={option.image} style={styles.fullWidthImage} />
                      <Text style={styles.vehicleLabelBodyType}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                selectedBodyType && (
                  <>
                    <View>
                      <View style={styles.fullWidthCard}>
                        <Image source={selectedBodyType.image} style={styles.fullWidthImage} />
                        <Text style={styles.vehicleLabel}>{selectedBodyType.label}</Text>
                        {showEditOption && (
                          <TouchableOpacity onPress={handleBodyTypeEdit}>
                            <View style={{ padding: 3 }}>
                              <Image
                                source={AppImages.editPen}

                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>

                    </View>
                    <View> 
                      <Heading text="Select the vehicle fuel type" isRequired={false} />  
                      <TouchableWithoutFeedback onPress={toggleBottomSheet}>
                      <View style={styles.selectFuel}>
                        <TextInput
                        placeholder='Select the vehicle fuel type'
                        cursorColor={'transparent'}
                        placeholderTextColor={'black'}
                        value={selectedFuelType}
                        style={{color:Colors.black,fontSize:14,fontWeight:'400'}}

                        />
                        <TouchableOpacity
                        // onPress={toggleBottomSheet}
                        >
                        <Image source={AppImages.down} style={{width:20,height:20}} resizeMode='contain'/>

                        </TouchableOpacity>
                        </View> 
                        </TouchableWithoutFeedback>

                    </View>
                  </>
                )
              )}
            </View>
          )
        )}
      </ScrollView>
      <SubmitCard onPress={handleSubmit} isEnabled={isEnabled} />
      {/* <PageButtons nextScreenName={'MyVehicles'} /> */}


    </View>
     <SelectVehicleFuel isVisible={isVisible}  setIsVisible={setIsVisible} setSelectedFuelType={setSelectedFuelType}/>
     </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.homeBackground 
  },
  formContainer: {
    // flex: 1,
    paddingBottom: 100,
  },
  cityDripDownCard: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // borderWidth: 0.2,
    marginBottom: 16,
  },
  selectFuel: {
    padding: 8,
    borderRadius: 5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    // backgroundColor: 'white',
    backgroundColor: Colors.white,
    marginBottom: 90,
  },
  fullWidthCard: {
    height: 70,
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white
  },
  fullWidthImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  vehicleLabel: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    marginLeft: 16,
  },
  vehicleLabelBodyType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  bodyTypeCardFullWidth: {
    height: 90,
    padding: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyTypeCard: {
    width: '49%',
    height: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.white
  
  },
  selectedBodyTypeCard: {
    // backgroundColor: 'red',
  },
  editButton: {
    fontSize: 16,
    marginRight: 5,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default VehicleDetailScreen;

