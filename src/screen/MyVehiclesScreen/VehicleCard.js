// VehicleCard.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  TouchableHighlight,
} from 'react-native';
import Colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import { formatVehicleNumber } from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getDriverDetails, setDriverId } from '../../redux/HitApis/HitApiSlice';
import AppImages from '../../common/AppImages';
import { responsiveHeight, responsiveWidth } from '../../common/metrices';
import { Spacing } from '../../common/Theme';

const VehicleCard = ({
  vehicle,
  onPress,
  partnerData,
  setVerifyVisibleCard,
  setselected_vehicle,
  selected_vehicle,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const hasDriver = !!vehicle?.driver?.driver_name; // Check if driver_name exists and convert to a boolean
  const error_data = vehicle?.documents?.filter(item => item?.status == 2);
  const driver_error_data = vehicle?.driver?.isApproved_driving_license == 2;
  const partner_error_data = partnerData?.documents?.filter(
    item => item?.status == 2,
  );
  const vehicleStatusData = {
    vehicleStatus: vehicle?.vehicle_status,
    mDriverStatus: vehicle?.driver?.m_driver_status,
    driverVehicleStatus: vehicle?.driver?.driver_vehicle_status,
  };
  const isAllStatusesTrue =
    vehicleStatusData.vehicleStatus === 1 &&
    vehicleStatusData.mDriverStatus === 1 &&
    vehicleStatusData.driverVehicleStatus === 1;

  

  const handleDriverDetails = async () => {
    // Store driver data in AsyncStorage
    await AsyncStorage.setItem('driver_data', JSON.stringify(vehicle));

    // If vehicle has a driver, get driver details
    if (hasDriver) {
      // console.log('anssssssssaaaaa======>>>>>>', vehicle?.driver_id);

      // // Dispatch the action to fetch driver details
      // const resultAction = await dispatch(
      //   getDriverDetails({ids: [vehicle?.driver_id]}),
      // );
      // console.log(resultAction, 'Driver details fetched');

      // // Navigate to the Dashboard
      if (vehicle) {
        if (
          error_data?.length > 0 ||
          partner_error_data?.length > 0 ||
          driver_error_data
        ) {
          setVerifyVisibleCard(true);
          setselected_vehicle({ vehicle: vehicle, partner_data: partnerData });
          return;
        }
        navigation.navigate('UpdateDriver', { vehicle: { ...vehicle } });
      } else {
        console.log('Vehicle data is undefined or null');
      }
    } else {
      // If no driver, navigate to DriverDetail screen

      onPress(vehicle?.id);
      // navigation.navigate('DriverDetail', { vehicleId: vehicle?.id });
    }

    // Optionally dispatch the driver ID to the store
    dispatch(setDriverId(vehicle));
  };

  return (
    <TouchableHighlight underlayColor={'none'} onPress={handleDriverDetails}>
      <View style={styles.card}>
        <View style={styles.topSection}>
          <View style={{flexDirection:'row'}}>
          <View style={{marginRight:Spacing.small}}>
          <Image
              source={
                vehicle?.vehicle_type_id == 1&& AppImages.Bike||
                vehicle?.vehicle_type_id == 2&& AppImages.Bike||
                vehicle?.vehicle_type_id == 3&& AppImages.AutoImg||          
                vehicle?.vehicle_type_id == 4&& AppImages.TruckImg
                
                }
              resizeMode="contain"
              style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
            />

          </View>
          <View style={styles.leftSection}>

            <Text style={styles.vehicleNumber}>
              {formatVehicleNumber(vehicle?.vehicle_number) || 'N/A'}
            </Text>
            <View style={styles.contactContainer}>
              <Text style={styles.name}>
                {vehicle?.driver?.driver_name
                  ? `${vehicle.driver.driver_name
                    .charAt(0)
                    .toUpperCase()}${vehicle.driver.driver_name.slice(1)},`
                  : 'No Driver Assigned'}
              </Text>

              <Text style={styles.contact}>
                {vehicle?.driver?.phone || ' | N/A'}
              </Text>
            </View>
          </View>
          </View>
          {hasDriver ? (
            error_data?.length > 0 ||
              partner_error_data?.length > 0 ||
              driver_error_data ? (
              <View style={styles.errorSection}>
                <Text style={styles.errorText}>ERROR</Text>
              </View>
            ) : (
              <View style={[styles.rightSection, { backgroundColor: isAllStatusesTrue ? 'green' : '#FFAE42' }]}>

                <Text style={styles.status}>{isAllStatusesTrue ? 'Verified' : 'Verifying'}</Text>
              </View>
            )
          ) : (
            <TouchableOpacity
              onPress={handleDriverDetails}
              style={styles.addDriver}>
              <Text style={styles.status}>Add Driver</Text>
            </TouchableOpacity>
          )}
        </View>

        {hasDriver && (
          <View style={styles.bottomSection}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Partner training pending</Text>
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/coach.png')}
              style={styles.image}
            />
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  errorSection: {
  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 5,
    margin: 16,
    marginVertical: 7,
    backgroundColor: 'white',
    flex: 1,
    elevation: 0.5,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    padding: 16,
  },
  leftSection: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  contact: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: '#FFAE42',
    marginVertical: 10,
  },
  addDriver: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.brandBlue,
    marginVertical: 10,
  },
  status: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0.2,
  },
  linkText: {
    fontSize: 12,
    color: '#FFFFFF', 
    },
  image: {
    width: responsiveWidth(20), 
    height:responsiveHeight(20),
  },
});

export default VehicleCard;
