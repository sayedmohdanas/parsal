import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import VehicleTypeSelector from '../../components/VehicleTypeSelector/VehicleType';
import Heading from '../../components/Heading/Heading';
import DropdownComponent from '../../components/SelectCityDrpDown/CityDropDwn';
import SelectVehicleFuel from '../../components/VehicleFuel/SelectVehicleFuel';
import {useDispatch, useSelector} from 'react-redux';
import {addVehicle, setParentId} from '../../redux/HitApis/HitApiSlice';
import PageButtons from '../../components/TempBtn/TempBtn';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import {errorToast, successToast} from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import {
  hitEditParnterVehicle,
  hitGetAllVehicleTypeApi,
  hitGetDoctypes,
} from '../../config/api/api';
import {getimage} from '../../config/url';
import {FontSizes} from '../../common/Theme';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Line from '../../components/Line/Line';

const VehicleDetailScreen = ({route}) => {
  const {UpdatedVehicleData} = route.params || {};
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(
    UpdatedVehicleData?.vehicle_number || '',
  );
  const [rcUploaded, setRcUploaded] = useState(
    UpdatedVehicleData?.rc_image || '',
  );
  const [insuranceUploaded, setInsuranceUploaded] = useState(
    UpdatedVehicleData?.insurance_image || '',
  );
  const [pollutionUploaded, setPollutionUploaded] = useState(
    UpdatedVehicleData?.pollution_image || '',
  );
  const [fitnessUploaded, setFitnessUploaded] = useState(
    UpdatedVehicleData?.fitness_image || '',
  );

  const [selectedCity, setSelectedCity] = useState(
    UpdatedVehicleData?.operational_city || 'Lucknow',
  );
  const [selectedFuelType, setSelectedFuelType] = useState(
    UpdatedVehicleData?.fuel_type === 2
      ? 'Petrol'
      : UpdatedVehicleData?.fuel_type === 1
      ? 'EV'
      : 0,
  );
  const [selectedVehicleModel, setSelectedVehicleModel] = useState(
    UpdatedVehicleData?.vehicle_model || 'Toyota Corolla',
  );
  const [selectedVehicleColor, setSelectedVehicleColor] = useState(
    UpdatedVehicleData?.vehicle_color || 'Blue',
  );
  const [selectedVehicleName, setSelectedVehicleName] = useState(
    UpdatedVehicleData?.vehicle_name || 'Corolla',
  );
  const [selectedVehicleCapacity, setSelectedVehicleCapacity] = useState(
    UpdatedVehicleData?.vehicle_capacity || 5,
  );

  //  const fetchVechileDoc=async()=>{
  //   const response =await hitGetDoctypes({type:1})

  //   console.log('response=========>>>',response);
    
  //  }

  const dispatch = useDispatch();

  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  // const partnerId =4

  useEffect(() => {
    const pId = async () => {
      const parent_id = await AsyncStorage.getItem('partner_id');

      dispatch(setParentId(parent_id));

    };
    pId();
    // fetchVechileDoc()
  }, [navigation]);

  const toggleBottomSheet = () => {
    setIsVisible(prev => !prev);
  };

  const handleSubmit = async () => {
    if (UpdatedVehicleData) {
      const payload = {
        partner_id: partnerId,
        vehicle_id: UpdatedVehicleData?.id,
        driver_id: UpdatedVehicleData?.driver_id,
        vehicle_number: vehicleNumber,
        vehicle_type_id: selected_vehicle,
        vehicle_model: selectedVehicleModel,
        vehicle_color: selectedVehicleColor,
        fuel_type:
          selectedFuelType === 'Petrol'
            ? 2
            : selectedFuelType === 'EV'
            ? 1
            : null,
        vehicle_name: selectedVehicleName,
        vehicle_capacity: selectedVehicleCapacity || 5,
        operational_city: selectedCity ? selectedCity : 'london',
        vehicle_docs: [
          {
            partner_id: partnerId,
            doc_id: 3,
            img_name: `${vehicleNumber}_rc.png`,
            img_src: rcUploaded?.base64 || '-',
          },
          {
            partner_id: partnerId,
            doc_id: 5,
            img_name: `${vehicleNumber}_insurance.png`,
            img_src: insuranceUploaded?.base64 || '-',
          },
          {
            partner_id: partnerId,
            doc_id: 10,
            img_name: `${vehicleNumber}_pollution.png`,
            img_src: pollutionUploaded?.base64 || '-',
          },
          {
            partner_id: partnerId,
            doc_id: 9,
            img_name: `${vehicleNumber}_fitness.png`,
            img_src: fitnessUploaded?.base64 || '-',
          },
        ],
      };
      hitEditParnterVehicle(payload)
        .then(res => {
          if (res?.status) {
            successToast('Submitted', 'Vehicle details have been Updated');
            // navigation.navigate('MyVehicles');
            navigation.navigate('OwnerDashboard');
          } else {
            errorToast('Error', 'An error occurred while submitting.');
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      const payload = {
        partner_id: partnerId,
        driver_id: null,
        vehicle_number: vehicleNumber,
        vehicle_type_id: selected_vehicle,
        vehicle_model: selectedVehicleModel,
        vehicle_color: selectedVehicleColor,
        fuel_type:
          selectedFuelType === 'Petrol'
            ? 2
            : selectedFuelType === 'EV'
            ? 1
            : null,
        vehicle_name: selectedVehicleName,
        vehicle_capacity: selectedVehicleCapacity || 5,
        operational_city: selectedCity ? selectedCity : 'london',
        vehicle_docs: [
          {
            partner_id: partnerId,
            doc_id: 4,
            img_name: `${vehicleNumber}_rc.png`,
            img_src: rcUploaded?.base64 || '',
          },
          {
            partner_id: partnerId,
            doc_id: 5,
            img_name: `${vehicleNumber}_insurance.png`,
            img_src: rcUploaded?.base64 || '',
          },
          {
            partner_id: partnerId,
            doc_id: 10,
            img_name: `${vehicleNumber}_pollution.png`,
            img_src: rcUploaded?.base64 || '',
          },
          {
            partner_id: partnerId,
            doc_id: 9,
            img_name: `${vehicleNumber}_fitness.png`,
            img_src: rcUploaded?.base64 || '',
          },
        ],
      };

      if (
        payload.vehicle_number &&
        payload.vehicle_docs[0].img_src &&
        payload.vehicle_type_id &&
        payload.fuel_type &&
        payload.vehicle_model
      ) {
        try {
          const resultAction = await dispatch(addVehicle(payload));
          // if (resultAction.meta.requestStatus === 'fulfilled') {
          if (addVehicle.fulfilled.match(resultAction)) {
            // Alert.alert('Submitted');
            successToast('Submitted', 'Vehicle details have been submitted');
            navigation.goBack('');

            // navigation.navigate('MyVehicles');
          } else {
            errorToast('Error', 'An error occurred while submitting.');
          }
        } catch (error) {
          Alert.alert('Error', 'An unexpected error occurred.');
          console.error('here is error', error);
        }
        successToast('Submitted', 'Vehicle details have been submitted');

        // Alert.alert('Submitted', 'Vehicle details have been submitted.');
      } else {
        Alert.alert('Error', 'Please fill  all fields.');
      }
    }
  };

  // console.log(JSON.stringify(groupedVehicles, null, 2));
  const [all_vehicle_type, setall_vehicle_type] = useState([]);
  useEffect(() => {
    hitGetAllVehicleTypeApi()
      .then(res => {
        const groupedVehicles = res?.data?.reduce((acc, vehicle) => {
          let existingGroup = acc.find(
            group => group.vehicle_type_id === vehicle.vehicle_type_id,
          );

          if (!existingGroup) {
            existingGroup = {
              vehicle_type_id: vehicle.vehicle_type_id,
              vehicle_type_cat_name: vehicle.vehicle_type_cat_name,
              vehicle_img:
                vehicle.vehicle_type_id == 2
                  ? AppImages.two_wheels
                  : vehicle?.vehicle_type_id == 3
                  ? AppImages.three_wheels
                  : AppImages.four_wheels,
              vehicle_cat_name: vehicle.vehicle_cat_name, 
              list: [],
            };
            acc.push(existingGroup);
          }

          existingGroup.list.push({
            id: vehicle.id,
            vehicle_cat_name: vehicle.vehicle_cat_name,
            vehicle_capacity: vehicle.vehicle_capacity,
            vehicle_pic: vehicle.vehicle_pic,
            loading_time: vehicle.loading_time,
            is_open: vehicle.is_open,
            status: vehicle.status,
          });

          return acc;
        }, []);
        setall_vehicle_type(groupedVehicles);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  const handleVehicleSelectlive = (id, arr) => {
    const sub_cat = arr.filter(item => {
      return item?.vehicle_type_id == id;
    });
    setVehicleSubCat(sub_cat);
  };

  const [selected_vehicle, setselected_vehicle] = useState(1);
  const [vehicle_sub_cat, setVehicleSubCat] = useState([]);

  useEffect(() => {
    if (UpdatedVehicleData) {
      const filteredVehicles = all_vehicle_type.filter(
        item => item?.vehicle_type_id === UpdatedVehicleData?.vehicle_type_id,
      );
      setVehicleSubCat(filteredVehicles);
    } else {
      setVehicleSubCat([]); 
    }
  }, [UpdatedVehicleData, all_vehicle_type]);

  useEffect(() => {
    if (UpdatedVehicleData && vehicle_sub_cat.length > 0) {
      const selected = vehicle_sub_cat[0]?.list?.find(
        item => item?.vehicle_cat_name === UpdatedVehicleData?.vehicle_cat_name,
      );
      setselected_vehicle(selected?.id || 1); // Set to the found id or default to 1
    } else {
      setselected_vehicle(1); // Reset to default if no match
    }
  }, [UpdatedVehicleData, vehicle_sub_cat]);
  const isEnabled = UpdatedVehicleData
    ? true
    : vehicleNumber && rcUploaded && vehicle_sub_cat && selected_vehicle;

  return (
    <>
      <HeaderBackButton
        headerText={'Add Vehicle'}
        onPress={() => {
          navigation.goBack('');
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.formContainer}>
          {/* <Heading text="Add RC Details" isRequired={false} /> */}

          <CustomTextInput
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            placeholder="Vehicle Number"
            label="Vehicle Number"
            isRequired={true}
            autoCapitalize="characters"
          />

          <ImagePicker
            labelText="Vehicle RC"
            uploaded={rcUploaded}
            onImagePick={setRcUploaded}
            useCamera={false}
          />
             <ImagePicker
            labelText="Insurance"
            uploaded={insuranceUploaded}
            onImagePick={setInsuranceUploaded}
            useCamera={false}
          />
            <ImagePicker
            labelText="Pollution"
            uploaded={pollutionUploaded}
            onImagePick={setPollutionUploaded}
            useCamera={false}
          />

           <ImagePicker
            labelText="Fintness"
            uploaded={fitnessUploaded}
            onImagePick={setFitnessUploaded}
            useCamera={false}
            required={false}
          />
          <Line marginH={0}/>
          <Heading text="Select the city of Operation" isRequired={false} />

          <View style={styles.cityDripDownCard}>
            <DropdownComponent
              selectedCity={selectedCity}
              onSelect={setSelectedCity}
            />
          </View>
          <Heading text="Select Vehicle Type" isRequired={false} />
          <VehicleTypeSelector
            options={all_vehicle_type}
            selectedOption={vehicle_sub_cat}
            onSelect={item => {
              handleVehicleSelectlive(item, all_vehicle_type);
            }}
          />
          <View style={{flexDirection: 'row', flex: 1, width: '100%'}}>
            {vehicle_sub_cat[0]?.list?.length > 0 &&
              vehicle_sub_cat[0]?.list?.map(item => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setselected_vehicle(item?.id);
                      }}
                      style={[
                        styles.fullWidthCard,
                        selected_vehicle == item?.id
                          ? styles.selected_vehicle
                          : null,
                      ]}>
                      <Image
                        source={{uri: getimage('common/' + item?.vehicle_pic)}}
                        style={styles.fullWidthImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.vehicleLabel}>
                        {item.vehicle_cat_name}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              })}
          </View>
          {/* {showVehicleOptions ? (
            <VehicleTypeSelector
              options={vehicleOptions}
              selectedOption={
                selectedVehicleType ? selectedVehicleType.value : null
              }
              onSelect={handleVehicleSelect}
            />
          ) : (
            selectedVehicleType && (
              <View>
                <View style={styles.fullWidthCard}>
                  <Image
                    source={selectedVehicleType.image}
                    style={styles.fullWidthImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.vehicleLabel}>
                    {selectedVehicleType.label}
                  </Text>
                  <TouchableOpacity onPress={handleOptionEdit}>
                    <View style={{padding: 3}}>
                      <Image source={AppImages.editPen} />
                    </View>
                  </TouchableOpacity>
                </View>

                <Heading
                  text="Select the vehicle body type"
                  isRequired={false}
                />
                {showVehicleBodyType ? (
                  <View style={styles.bodyTypeCardFullWidth}>
                    {bodyTypeOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.bodyTypeCard,
                          selectedBodyType?.value === option.value &&
                            styles.selectedBodyTypeCard,
                        ]}
                        onPress={() => handleBodyTypeSelect(option.value)}>
                        <Image
                          source={option.image}
                          resizeMode="contain"
                          style={styles.fullWidthImage}
                        />
                        <Text style={styles.vehicleLabelBodyType}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  selectedBodyType && (
                    <>
                      <View>
                        <View style={styles.fullWidthCard}>
                          <Image
                            source={selectedBodyType.image}
                            style={styles.fullWidthImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.vehicleLabel}>
                            {selectedBodyType.label}
                          </Text>
                          {showEditOption && (
                            <TouchableOpacity onPress={handleBodyTypeEdit}>
                              <View style={{padding: 3}}>
                                <Image source={AppImages.editPen} />
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                    </>
                  )
                )}
              </View>
            )
          )} */}
          {vehicle_sub_cat[0]?.list?.length > 0 && (
            <View>
              <Heading text="Select the vehicle fuel type" isRequired={false} />
              <TouchableWithoutFeedback onPress={toggleBottomSheet}>
                <View style={styles.selectFuel}>
                  <TextInput
                    placeholder="Select the vehicle fuel type"
                    cursorColor={'transparent'}
                    placeholderTextColor={'black'}
                    value={selectedFuelType}
                    style={{
                      color: Colors.black,
                      fontSize: 14,
                      fontWeight: '400',
                    }}
                  />
                  <TouchableOpacity
                  // onPress={toggleBottomSheet}
                  >
                    <Image
                      source={AppImages.down}
                      style={{width: 16, height: 16}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </ScrollView>
        <SubmitCard onPress={handleSubmit} isEnabled={isEnabled} />
        {/* <PageButtons nextScreenName={'MyVehicles'} /> */}
      </View>
      <SelectVehicleFuel
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        setSelectedFuelType={setSelectedFuelType}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:responsiveWidth(15),
    backgroundColor: Colors.homeBackground,
  },
  selected_vehicle: {borderWidth: 1, borderColor: Colors.brandBlue},
  formContainer: {
    // flex: 1,
    paddingBottom: responsiveHeight(100),
  },
  cityDripDownCard: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // borderWidth: 0.2,
    marginBottom: responsiveHeight(8),
  },
  selectFuel: {
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'white',
    backgroundColor: Colors.white,
    marginBottom: responsiveHeight(90),
  },
  fullWidthCard: {
    paddingVertical: responsiveHeight(20),
    padding: 6,
    borderRadius: 5,
    // alignItems: 'center',
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: responsiveWidth(5),
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  fullWidthImage: {
    width: responsiveFontSize(30),
    height: responsiveFontSize(30),
    // resizeMode: 'contain',
    marginLeft: 8,
  },
  vehicleLabel: {
    fontSize: responsiveFontSize(16),
    color: '#333',
    flex: 1,
    marginLeft: responsiveWidth(16),
    fontWeight: '500',
  },
  vehicleLabelBodyType: {
    fontSize: responsiveFontSize(14),
    fontWeight: '500',
    color: '#333',
    marginTop: responsiveHeight(6),
  },
  bodyTypeCardFullWidth: {
    height: responsiveHeight(90),
    padding: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyTypeCard: {
    width: '49%',
    height: responsiveHeight(80),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.white,
  },
  selectedBodyTypeCard: {
    // backgroundColor: 'red',
  },
  editButton: {
    fontSize: FontSizes.semiLarge,
    marginRight: 5,
    color: '#007BFF',
    fontWeight: '700',
  },
});

export default VehicleDetailScreen;
