import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';
import Colors from '../../../common/Colors';
import {mystyles} from '../../../common/Mystyle';
import Line from '../../../components/Line/Line';
import AppImages from '../../../common/AppImages';
import {useNavigation} from '@react-navigation/native';
import {getimage} from '../../../config/url';

const OrderDetail = ({...props })=> {
  // console.log('console--check====>>>>>>',props.orderDetails);
  
  const navigation = useNavigation();
  return (
    <TouchableOpacity
   
      onPress={() => {
        navigation.navigate('orderinfo', {
          id: props.orderDetails?.id,
          prod_name:props.orderDetails?.m_good?.product_category
        });
      }}>
      <View style={[styles.container]}>
        <View style={[styles.section1]}>
          <View>
            <Text style={[styles.parsalNumber]}>{props?.parsalNumber}</Text>
            <Text style={[styles.parsalName]}>{props?.parsalName}</Text>
          </View>
          <View>
            <View
              style={[
                styles.parsalStatus,
                mystyles.center,
                {backgroundColor: props?.parsalStatusTextColor},
              ]}>
              <Text style={[styles.parsalStatusText, {color: props?.textColor}]}>
                {props?.parsalStatusText}
              </Text>
            </View>
          </View>
        </View>
        <Line marginH={0} />
        <View style={[styles.section2]}>
      
          <View style={[styles.LocationMainContainer]}>
            <View style={[styles.fromLocation]}>
              <Text style={[styles.citystart]}>
                {`${props?.citystart.split(' ').slice(0, 5).join(' ')}...`}
              </Text>
            </View>

            <Image
              source={AppImages.rightarrow}
              resizeMode="contain"
              style={styles.rightArrowStyle}
            />

            <View style={[styles.toLocation]}>
              <Text style={[styles.cityend]}>
                {`${props?.cityend.split(' ').slice(0, 5).join(' ')}...`}
              </Text>
            </View>
          </View>

          <View style={[styles.UserDetailMainContainer]}>
            <View style={styles.userDetail}>
              <View style={{borderWidth:0.4,borderColor:Colors.grey,borderRadius:responsiveHeight(30)}}>
              <Image
                source={{
                  uri: getimage(
                    `partners_img/${props?.partnerId}/drivers/${props?.driverId}_${props?.profilePic}`,
                  ),
                }}
                style={styles.manStyle}
              />
              </View>
              <View style={styles.userNameAddress}>
                <Text style={[styles.name, {fontSize: responsiveFontSize(14)}]}>
                  {props?.name}
                </Text>
                <Text
                  style={[
                    styles.name,
                    {color: 'grey', fontSize: responsiveFontSize(12)},
                  ]}>
                  {props?.vNo}
                </Text>
              </View>
            </View>

            <View>
              <Text style={[styles.name, {fontWeight: '700', fontSize: responsiveFontSize(16),alignSelf:"flex-end"}]}>
                {"₹"}{props?.tripCost}
              </Text>
              <Text
                style={[
                  styles.name,
                  {
                    fontSize: responsiveFontSize(12),
                    fontWeight: '400',
                    color: 'grey',
                  },
                ]}>
                {props?.orderDate}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
      // height: responsiveHeight(165),
      backgroundColor: Colors.white,
      marginHorizontal: responsiveWidth(16),
      borderRadius: responsiveHeight(10),
      paddingTop:responsiveHeight(6),
      paddingBottom:responsiveHeight(12),
      paddingHorizontal: responsiveWidth(12),
      marginVertical: responsiveHeight(8),
  },
  section1: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center'
  },
  section2: {
      flex: 2,
  },
  parsalNumber: {
      fontSize: responsiveFontSize(16),
      fontWeight: '600',
      color: Colors.black
  },
  parsalName: {
      fontSize: responsiveFontSize(14),
      fontWeight: '400',
      color: Colors.grey
  },
  parsalStatus: {
      backgroundColor: Colors.black,
      alignItems:'center',
      justifyContent:'center',
      paddingVertical: responsiveHeight(6),
      paddingHorizontal: responsiveWidth(8),
      borderRadius: responsiveHeight(12),
  },
  parsalStatusText: {
      fontSize: responsiveFontSize(10),
      color: Colors.black,
      lineHeight:10

  },
  LocationMainContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  UserDetailMainContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: responsiveHeight(10),
      alignItems: 'center',
  },
  fromLocation: {
      alignItems: 'flex-start',
      flex: 1.8,
      marginLeft:responsiveWidth(5)
  },
  toLocation: {
      alignItems: 'flex-start',
      flex: 1.8,

      // backgroundColor:'red',
      marginLeft:responsiveWidth(8)
  },
  citystart: {
      fontSize: responsiveFontSize(11),
      fontWeight: '500',
      color: '#000000'
  },
  statestart: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: Colors.grey,
      marginTop: 1
  },
  rightArrowStyle: {
      height: responsiveHeight(12),
      width: responsiveWidth(12),
      marginRight:responsiveWidth(15)
  },
  cityend: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: '#000000'
  },
  stateend: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: Colors.grey,
      marginTop: responsiveHeight(10),
  },
 
  manStyle: {
      height: responsiveHeight(30),
      width: responsiveHeight(30),
      borderRadius: responsiveHeight(30),
      resizeMode:'contain',
      borderWidth:0.4,
      borderColor:Colors.grey
  },
  userNameAddress: {
      marginLeft: responsiveWidth(10),
  },
  name: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: Colors.black
  },
  address: {
      fontSize: responsiveFontSize(10),
      fontWeight: '500',
      color: Colors.grey,
      marginTop: responsiveHeight(2)
  },
  userDetail: {
      flexDirection: 'row',
      alignItems: "center",
      // backgroundColor:'red'
  }
})