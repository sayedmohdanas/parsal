import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import {Fonts, FontSizes} from '../../common/Theme';
import {useNavigation} from '@react-navigation/native';
import Line from '../../components/Line/Line';
import BorderLine from '../../common/BorderLine.';
import {formatVehicleNumber} from '../../common/CommonFunction';
import {getimage} from '../../config/url';
import {
  hitAddDriverDetails,
  hitDeleteDriverDetails,
  hitDeleteVehicle,
} from '../../config/api/api';
import Loading from '../../components/Loading/Loading';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateDriver = ({route}) => {
  const {vehicle} = route?.params || {};
  // console.log('vehicle',vehicle);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
 
  const handleVehicleDelete = () => {
    Alert.alert(
      'Delete Vehcile',
      'Are you sure you want to delete this Vehcile ?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await hitDeleteVehicle({
                vehicle_id: vehicle?.id,
              });
              const user = await AsyncStorage.getItem('user');
              let parsedUser = JSON.parse(user);
              if (response) {
                if (
                  parsedUser?.payload?.owner_type == 2 ||
                  (parsedUser?.payload?.owner_type == 1 &&
                    vehicle?.driver_id == parsedUser?.payload?.driver_id)
                ) {
                  parsedUser.payload.owner_type = 1;
                  parsedUser.payload.driver_id = null;
                  parsedUser.payload.vehicle_type_id = null;
                  await AsyncStorage.setItem(
                    'user',
                    JSON.stringify(parsedUser),
                  );
                  navigation.goBack();
                }
              }
            } catch (error) {
              console.log(
                'Something went wrong while deleting vehcile===>',
                error,
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleVehicleEdit = () => {
    navigation.navigate('VehicleDetail', {
      UpdatedVehicleData: vehicle,
    });
  };
  const handleProfileDelete = () => {
    Alert.alert(
      'Delete Driver',
      'Are you sure you want to delete this driver profile?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await hitDeleteDriverDetails({
                driver_id: vehicle?.driver_id,
              });
              const user = await AsyncStorage.getItem('user');
              let parsedUser = JSON.parse(user);
              if (response) {
                if (
                  parsedUser?.payload?.owner_type == 2 ||
                  (parsedUser?.payload?.owner_type == 1 &&
                    vehicle?.driver_id == parsedUser?.payload?.driver_id)
                ) {
                  parsedUser.payload.owner_type = 1;
                  parsedUser.payload.driver_id = null;
                  parsedUser.payload.vehicle_type_id = null;
                  await AsyncStorage.setItem(
                    'user',
                    JSON.stringify(parsedUser),
                  );
                  navigation.goBack();
                }
              }
              console.log('Driver profile deleted:', vehicle?.driver_id);
            } catch (error) {
              console.log(
                'something went wrog while deletign driver==>>>',
                error,
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleProfileEdit = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    if (vehicle?.driver_id == parsedUser?.payload?.driver_id) {
      const updatedVehicle = {
        ...vehicle,
        owner_type: parsedUser?.payload?.owner_type,
      };
      navigation.navigate('DriverDetail', {
        updateDriverData: updatedVehicle,
      });
    } else {
      navigation.navigate('DriverDetail', {
        updateDriverData: vehicle,
      });
    }
  };
  const renderRightActions = (onEdit, onDelete) => (
    <View style={styles.leftActions}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: '#7CC1D7',
          padding: 10,
          flex: 1,
          alignItems: 'center',
        }}
        onPress={onEdit}>
        <Image
          source={AppImages.editPen}
          resizeMode="contain"
          style={styles.actionIcon}
          tintColor={'white'}
        />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.red,
          padding: 10,
          flex: 1,
          alignItems: 'center',
        }}
        onPress={onDelete}>
        <Image
          source={AppImages.trashIcon}
          resizeMode="contain"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  const VehicleCard = () => (
    <Swipeable
      renderRightActions={() =>
        renderRightActions(handleVehicleEdit, handleVehicleDelete)
      }>
      <View style={styles.card}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleNumber}>
            {formatVehicleNumber(vehicle?.vehicle_number)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveHeight(4),
            }}>
            <Image
              source={
                vehicle?.vehicle_type_id == 1&& AppImages.two_wheels||
                vehicle?.vehicle_type_id == 2&& AppImages.two_wheels||
                vehicle?.vehicle_type_id == 3&& AppImages.three_wheels||
                vehicle?.vehicle_type_id == 4&& AppImages.four_wheels
              }
              tintColor={Colors.brandBlue}
              resizeMethod='contain'
              style={[
                styles.actionIcon,
                {marginHorizontal: 0, marginRight: responsiveWidth(5)},
              ]}
            />

            <Text style={styles.vehicleType}>
              {vehicle?.vehicle_cat_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveHeight(4),
            }}>
            <Image
              source={vehicle?.fuel_type ===2? AppImages.Petrol:AppImages.EvIcon}
              style={[
                styles.actionIcon,
                {marginHorizontal: 0, marginRight: responsiveWidth(5)},
              ]}
              // tintColor={'#3D40D1'}
            />

            <Text style={styles.fuelType}>{vehicle?.fuel_type ===2?'Petrol':'Ev'}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileDetail', {
              image: getimage(
                'partners_img/' +
                  vehicle?.partner_id +
                  '/vehicles/' +
                  vehicle?.documents[0]?.doc_pic,
              ),
              name: vehicle?.vehicle_number,
              status: 1,
            })
           
          }
          style={{borderRadius:responsiveHeight(10),borderWidth:0.4,borderColor:Colors.grey}}
          >
          <Image
            source={{
              uri: vehicle?.documents
                ? getimage(
                    'partners_img/' +
                      vehicle?.partner_id +
                      '/vehicles/' +
                      vehicle?.documents[0]?.doc_pic +
                      '?=' +
                      new Date(),
                  )
                : null,
            }}
            style={styles.rcImage}
          />

          {/* <Image source={vehicledatadummy.rc_image} style={styles.rcImage} /> */}
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  // Driver card component
  const DriverCard = () => (
    <Swipeable
      renderRightActions={() =>
        renderRightActions(handleProfileEdit, handleProfileDelete)
      }>
      <View style={styles.card}>
        {/* <Image source={driverdummy.driver_profile} style={styles.profileImage} /> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileDetail', {
              image: vehicle?.driver?.driver_name
              ? getimage(
                  'partners_img/' +
                    vehicle?.partner_id +
                    '/drivers/' +
                    vehicle?.driver_id +
                    '_' +
                    vehicle?.driver?.profile_pic +
                    '?=' +
                    new Date(),
                )
              : getimage(
                  'partners_img/' +
                    vehicle?.id +
                    '/' +
                    vehicle?.driver?.profile_pic +
                    '?=' +
                    new Date(),
                ),
              name: vehicle?.driver?.driver_name,
              status: 1,
            })
           
          }
          style={{borderWidth:0.4,borderColor:Colors.grey, width: responsiveHeight(55),
            height: responsiveHeight(55),
            borderRadius: responsiveHeight(55),marginRight:responsiveWidth(8)}}
          >
        <Image
          source={{
            uri: vehicle?.driver?.driver_name
              ? getimage(
                  'partners_img/' +
                    vehicle?.partner_id +
                    '/drivers/' +
                    vehicle?.driver_id +
                    '_' +
                    vehicle?.driver?.profile_pic +
                    '?=' +
                    new Date(),
                )
              : getimage(
                  'partners_img/' +
                    vehicle?.id +
                    '/' +
                    vehicle?.driver?.profile_pic +
                    '?=' +
                    new Date(),
                ),
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{vehicle?.driver?.driver_name}</Text>
          <Text style={styles.driverPhone}>{vehicle?.driver?.phone}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <>
      <HeaderBackButton
        onPress={() => navigation.goBack('')}
        headerText={'Update Vehicle'}
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <>
            {/* <Text style={styles.title}>Update Driver</Text> */}
            <VehicleCard />
            <BorderLine thickness={0.6} color={'#D8D8D8'} margin={5} />
            <DriverCard />
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default UpdateDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(25),
    paddingVertical: responsiveHeight(21),
    // padding:20,
    // marginHorizontal:10,
    // borderWidth: 1,
    // borderBottomWidth:1,
    // backgroundColor: 'red',
    borderRadius: 10,
    // marginBottom: responsiveHeight(3),
  },
  rcImage: {
    width: responsiveWidth(75),
    height: responsiveHeight(75),
    // marginRight: 10,
    borderRadius: 10,
    
  },
  profileImage: {
    width: responsiveHeight(55),
    height: responsiveHeight(55),
    borderRadius: responsiveHeight(55),
    marginRight: responsiveHeight(10),
  },
  vehicleInfo: {
    flex: 1,
  },
  driverInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: responsiveFontSize(18),
    fontWeight: Fonts.bold,
    color: Colors.black,
  },
  vehicleType: {
    fontSize: FontSizes.medium,
    color: Colors.grey,
    fontWeight: Fonts.semilarge,
  },
  fuelType: {
    fontSize: FontSizes.medium,
    color: Colors.grey,
    fontWeight: Fonts.semilarge,
  },
  driverName: {
    fontSize: FontSizes.semiLarge,
    fontWeight: Fonts.semilarge,
    color: Colors.black,
  },
  driverPhone: {
    fontSize: FontSizes.xsmall,
    fontWeight: Fonts.semilarge,
    color: Colors.grey,
  },
  leftActions: {
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(12),
    borderRadius: responsiveHeight(10),

    // padding: 15,
  },
  actionIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    resizeMode:'contain'
  },
  actionText: {
    fontSize: responsiveFontSize(10),
    color: Colors.white,
    fontWeight: Fonts.semilarge,
    padding: 3,
  },
});