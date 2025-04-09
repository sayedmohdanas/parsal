import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { addVehicle, setParentId } from '../../redux/HitApis/HitApiSlice';
import PageButtons from '../../components/TempBtn/TempBtn';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import { errorToast, successToast } from '../../common/CommonFunction';
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
import { getimage } from '../../config/url';
import { FontSizes } from '../../common/Theme';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Line from '../../components/Line/Line';

const VehicleDetailScreen = ({ route }) => {
  const { UpdatedVehicleData } = route.params || {};
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(
    UpdatedVehicleData?.vehicle_number || '',
  );
  const [vehicleDocs, setVehicleDocs] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState({});

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
  const fuelTypeMap = {
    0: 'Petrol',
    1: 'Diesel',
    2: 'CNG',
    3: 'Electric',
  };
  const [selectedFuelType, setSelectedFuelType] = useState(
    fuelTypeMap[UpdatedVehicleData?.fuel_type] || ''
  );
  
  // const [selectedFuelType, setSelectedFuelType] = useState( UpdatedVehicleData?.fuel_type === 2 ? 'Petrol' : UpdatedVehicleData?.fuel_type === 1  ? 'EV' : 0,);
  const [selectedVehicleModel, setSelectedVehicleModel] = useState(
    UpdatedVehicleData?.vehicle_model || 'Toyota Corolla',
  );
  const [selectedVehicleColor, setSelectedVehicleColor] = useState(
    UpdatedVehicleData?.vehicle_color || '',
  );
  const [selectedVehicleName, setSelectedVehicleName] = useState(
    UpdatedVehicleData?.vehicle_name || '',
  );
  const [selectedVehicleCapacity, setSelectedVehicleCapacity] = useState(
    UpdatedVehicleData?.vehicle_capacity || 5,
  );

  // console.log("UpdatedVehicleData===>",UpdatedVehicleData?.documents);

  const fetchVehicleDocs = async () => {
    try {
      const response = await hitGetDoctypes({ type: 0 });

      if (response?.success) {
        setVehicleDocs(response.data);
      }
    } catch (error) {
      console.error('Error fetching vehicle docs:', error);
    }
  };


  const dispatch = useDispatch();

  const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
  // const partnerId =4

  useEffect(() => {
    const pId = async () => {
      const parent_id = await AsyncStorage.getItem('partner_id');

      dispatch(setParentId(parent_id));

    };
    pId();
    fetchVehicleDocs()
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
        status: 0,
        vehicle_color: selectedVehicleColor,
        // fuel_type:
        //   selectedFuelType === 'Petrol'
        //     ? 2
        //     : selectedFuelType === 'EV'
        //       ? 1
        //       : null,
        fuel_type:
  Object.keys(fuelTypeMap).find(key => fuelTypeMap[key] === selectedFuelType) ?? null,

        vehicle_name: selectedVehicleName,
        vehicle_capacity: selectedVehicleCapacity || 5,
        operational_city: selectedCity ? selectedCity : 'london',
        mg_src: pollutionUploaded?.base64 || '-',

        vehicle_docs: uploadData


      };
      // console.log(uploadData);

      hitEditParnterVehicle(payload)
        .then(res => {
          if (res?.status) {
            successToast('Submitted', 'Vehicle details have been Updated');
            navigation.navigate('MyVehicles');
            // navigation.navigate('OwnerDashboard');
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
        status: 0,

        // fuel_type:
        //   selectedFuelType === 'Petrol'
        //     ? 2
        //     : selectedFuelType === 'EV'
        //       ? 1
        //       : null,
        fuel_type:
  Object.keys(fuelTypeMap).find(key => fuelTypeMap[key] === selectedFuelType) ?? null,

        vehicle_name: selectedVehicleName,
        vehicle_capacity: selectedVehicleCapacity || 5,
        operational_city: selectedCity ? selectedCity : 'london',

        vehicle_docs: uploadData,
      };

      if (
        payload.vehicle_number &&
        // payload.vehicle_docs[0].img_src &&
        payload.vehicle_type_id &&
        payload.fuel_type &&
        payload.vehicle_model
      ) {
        try {
        console.log('anas=======log===>>',payload);
        
          const resultAction = await dispatch(addVehicle(payload));
          console.log('resultAction=======log===>>',resultAction);

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
      setselected_vehicle(selected?.id || 1);
    } else {
      setselected_vehicle(1);
    }
  }, [UpdatedVehicleData, vehicle_sub_cat]);
  const isEnabled = UpdatedVehicleData
    ? true
    : vehicleNumber && vehicle_sub_cat && selected_vehicle;
  const [uploadData, setuploadData] = useState([])
  useEffect(() => {
    const initialDocs = {};
    UpdatedVehicleData?.documents.forEach((doc) => {
      if (doc) {
        initialDocs[doc.doc_id] = {
          img_name: doc.doc_pic,
          img_src: `path/to/images/${doc.doc_pic}`,
        };
      }
    });

    setUploadedDocs(initialDocs);
  }, [UpdatedVehicleData?.documents]);

  const handleImagePick = (docId, image) => {
    const doc = vehicleDocs.find((d) => d.id === docId);
    const imgName = `${vehicleNumber}_${doc.doc_name.toLowerCase()}.png`;
    const { base64, uri } = image;

    // Update uploadedDocs state
    setUploadedDocs((prevState) => ({
      ...prevState,
      [docId]: {
        partner_id: partnerId,
        doc_id: docId,
        img_name: imgName,
        img_src: base64 || uri,
      },
    }));

    // Update uploadData array
    setuploadData((prevUploadData) => {
      const newUploadData = [...prevUploadData];
      const index = newUploadData.findIndex((item) => item.doc_id === docId);
      const newDoc = {
        partner_id: partnerId,
        doc_id: docId,
        img_name: imgName,
        img_src: base64 || uri,
      };
      if (index >= 0) {
        newUploadData[index] = newDoc;
      } else {
        newUploadData.push(newDoc);
      }
      return newUploadData;
    });
  };

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
       <View  >

          <CustomTextInput
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            placeholder="Vehicle Number"
            label="Vehicle Number"
            isRequired={true}
            autoCapitalize="characters"
          />
       </View>

          {vehicleDocs.map((doc) => (
            <ImagePicker
              key={doc.id}
              labelText={doc.doc_name}
              uploaded={uploadedDocs[doc.id]?.img_src}
              onImagePick={(image) => handleImagePick(doc.id, image)}
              useCamera={false}
            />
          ))}
          <Line marginH={0} />
          <Heading text="Select the city of Operation" isRequired={false} />

          <View style={styles.cityDripDownCard}>
            <DropdownComponent
              selectedCity={selectedCity}
              onSelect={setSelectedCity}
            />

          </View>

          <CustomTextInput
            value={selectedVehicleName}
            onChangeText={setSelectedVehicleName}
            placeholder="Vehicle Name"
            label="Vehicle Name"
            isRequired={true}
          />
               {/* <View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ flex: 1 }}>
    <CustomTextInput
      value={vehicleNumber}
      onChangeText={setVehicleNumber}
      placeholder="Vehicle Number"
      label="Vehicle Number"
      isRequired={true}
      autoCapitalize="characters"
    />
  </View>

  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
    <Dropdown
      style={{ height: 45, borderBottomColor: 'black', padding: 8 }}
      placeholderStyle={{ fontSize: 16, color: 'black' }}
      selectedTextStyle={{ fontSize: 16, color: 'black' }}
      inputSearchStyle={{ height: 40, fontSize: 16, color: 'black' }}
      data={colorOptions}
      labelField="label"
      valueField="value"
      placeholder="Color"
      value={selectedColor}
      onChange={(item) => setSelectedColor(item.value)}
    />
  </View>
</View> */}

          <Heading text="Select Vehicle Type" isRequired={false} />
          <VehicleTypeSelector
            options={all_vehicle_type}
            selectedOption={vehicle_sub_cat}
            onSelect={item => {
              handleVehicleSelectlive(item, all_vehicle_type);
            }}
          />
          <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
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
                        source={{ uri: getimage('common/' + item?.vehicle_pic) }}
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
                      style={{ width: 16, height: 16 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </ScrollView>
        <SubmitCard onPress={handleSubmit} isEnabled={isEnabled} />
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
    paddingHorizontal: responsiveWidth(15),
    paddingBottom:responsiveHeight(55),
    backgroundColor: Colors.homeBackground,
  },
  selected_vehicle: { borderWidth: 1, borderColor: Colors.brandBlue },
  formContainer: {
    paddingBottom: responsiveHeight(100),
  },
  cityDripDownCard: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: responsiveHeight(8),
  },
  selectFuel: {
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: responsiveHeight(90),
  },
  fullWidthCard: {
    paddingVertical: responsiveHeight(20),
    padding: 6,
    borderRadius: 5,
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
  },
  editButton: {
    fontSize: FontSizes.semiLarge,
    marginRight: 5,
    color: '#007BFF',
    fontWeight: '700',
  },
});

export default VehicleDetailScreen;
