import {StyleSheet, View, Text, Image, TouchableHighlight} from 'react-native';
import {responsiveFontSize,responsiveHeight,responsiveWidth} from '../../common/metrices';
import Colors from '../../common/Colors';
import {getimage} from '../../config/url';
import AppImages from '../../common/AppImages';

const DriverDetails = ({details, onPress, selectedDriver}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={'none'}
      style={[
        styles.UserDetailMainContainer,
        {
          backgroundColor:
            selectedDriver?.driver_id == details?.driver_id
              ? '#D8D9FF'
              : Colors.white,
        },
      ]}>
      <View style={styles.userDetail}>
        <View
          style={{
            borderWidth: 0.4,
            borderColor: Colors.grey,
            borderRadius: responsiveHeight(20),
            marginLeft: responsiveHeight(6),
            resizeMode: 'contain',

          }}>
          {details?.driver_name == 'All' ? (
            <Image
              source={AppImages.driversList}
              style={{
                height: responsiveHeight(20),
                width: responsiveHeight(20),
                resizeMode: 'contain',
              }}
            />
          ) : (
            <Image
              source={{
                uri: getimage(
                  'partners_img/' +
                    details?.partner_id +
                    '/drivers/' +
                    details?.driver_id +
                    '_' +
                    details?.profilePic ,
                ),
              }}
              style={styles.manStyle}
            />
          )}
        </View>
        {/* <Image source={AppImages.profileImage} style={styles.manStyle} /> */}
        <View style={styles.userNameAddress}>
          <Text
            style={[
              styles.name,
              {
                fontSize: responsiveFontSize(12),
                fontWeight:'600',
                color:
                  selectedDriver?.driver_id == details?.driver_id
                    ? Colors.brandBlue
                    : Colors.black,
                    
              },
              
            ]}
            numberOfLines={1} 
            ellipsizeMode="tail" 
            >
              
            {details?.driver_name}
          </Text>
          {details?.vehicleName && (
            <Text
              style={[
                styles.name,
                {
                  color:
                    selectedDriver?.driver_id == details?.driver_id
                      ? Colors.brandBlue
                      : Colors.grey,
                      fontWeight:'600',

                  fontSize: responsiveFontSize(10),
                },
              ]}>
              {/* {details?.vehicles[0]?.vehicle_number} */}
              {details?.vehicleName}
            </Text>
          )}
          {/* <Text style={[styles.address]}>{props.address}</Text> */}
        </View>
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  UserDetailMainContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: responsiveHeight(10),
    paddingVertical: responsiveHeight(6),
    width:responsiveWidth(112),     
    alignItems: 'center',
    marginRight: responsiveWidth(6),
    marginBottom: responsiveHeight(10),
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manStyle: {
    height: responsiveHeight(30),
    width: responsiveHeight(30),
    borderWidth: 0.4,
    borderColor: Colors.grey,
    borderRadius: responsiveHeight(15),
    resizeMode: 'contain',
  },

  userNameAddress: {
    marginLeft: responsiveWidth(6),
    paddingRight: responsiveWidth(18),
    width: responsiveWidth(90),
  },
  name: {
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    color: Colors.black,
    width: '100%',
      },
  address: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: Colors.grey,
  },
});
export default DriverDetails;
