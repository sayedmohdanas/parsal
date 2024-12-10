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
        <View style={{borderWidth:0.4,borderColor:Colors.grey,borderRadius:responsiveHeight(20),  marginLeft: responsiveWidth(6),
}}>
        <Image
          source={{
            uri: getimage(
              'partners_img/' +
                details?.partner_id +
                '/drivers/' +
                details?.driver_id +
                '_' +
                details?.profile_pic,
            ),
          }}
          style={styles.manStyle}
        />
        </View>
        {/* <Image source={AppImages.profileImage} style={styles.manStyle} /> */}
        <View style={styles.userNameAddress}>
          <Text
            style={[
              styles.name,
              {
                fontSize: responsiveFontSize(10),
                color:
                  selectedDriver?.driver_id == details?.driver_id
                    ? Colors.white
                    : Colors.black,
              },
            ]}>
            {details?.driver_name}
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
            {details?.vehicles[0]?.vehicle_number}
          </Text>
          {/* <Text style={[styles.address]}>{props.address}</Text> */}
        </View>
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  UserDetailMainContainer: {
    // flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 15,
    borderRadius: responsiveHeight(20),
    paddingVertical: responsiveHeight(6),
    // padding:responsiveHeight(10),
    // width:responsiveWidth(112),
    // paddingHorizontal:-responsiveWidth(30),
    marginRight: responsiveWidth(5),
    alignItems: 'center',
    // borderWidth: 0.5,
    // borderColor: Colors.buttonGrey,
    
    marginRight: responsiveWidth(6),
    marginBottom: responsiveHeight(10),
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'green',
    // marginHorizontal:responsiveWidth(8)
    // justifyContent:'center'
  },
  manStyle: {
    height: responsiveHeight(30),
    width: responsiveHeight(30), 
    borderWidth:0.4,
    borderColor:Colors.grey,
    borderRadius: responsiveHeight(15), 
    // marginLeft: responsiveWidth(8),
    resizeMode: 'cover'
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
    // marginTop: 2
  }, 
});
export default DriverDetails;
