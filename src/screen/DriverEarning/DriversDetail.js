import {StyleSheet, View, Text, Image, TouchableHighlight} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import {getimage} from '../../config/url';

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
              ? '#3D40D1'
              : Colors.white,
        },
      ]}>
      <View style={styles.userDetail}>
        <Image
          source={{
            uri: getimage(
              'partners_img/' +
                details?.partner_id +
                '/drivers/' +
                details?.driver_id +
                '_' +
                details?.driver?.profile_pic,
            ),
          }}
          style={styles.manStyle}
        />
        {/* <Image source={AppImages.profileImage} style={styles.manStyle} /> */}
        <View style={styles.userNameAddress}>
          <Text
            style={[
              styles.name,
              {
                fontSize: responsiveFontSize(12),
                color:
                  selectedDriver?.driver_id == details?.driver_id
                    ? Colors.white
                    : Colors.black,
              },
            ]}>
            {details?.driver?.driver_name}
          </Text>
          <Text
            style={[
              styles.name,
              {
                color:
                  selectedDriver?.driver_id == details?.driver_id
                    ? Colors.white
                    : Colors.grey,
                fontSize: responsiveFontSize(8),
              },
            ]}>
            {details?.vehicle_number}
          </Text>
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
    borderRadius: 20,
    paddingVertical: responsiveHeight(8),
    marginRight: responsiveWidth(8),
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.buttonGrey,
    marginRight: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manStyle: {
    height: responsiveHeight(30),
    width: responsiveWidth(30),
    borderRadius: 35,
    marginLeft: responsiveWidth(8),
  },
  userNameAddress: {
    marginLeft: responsiveWidth(6),
    paddingRight: responsiveWidth(18),
  },
  name: {
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    color: Colors.black,
  },
  address: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: Colors.grey,
  }, 
});
export default DriverDetails;
