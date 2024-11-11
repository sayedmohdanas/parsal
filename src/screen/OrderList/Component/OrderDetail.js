// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../common/metrices';
// import Colors from '../../../common/Colors';
// import {mystyles} from '../../../common/Mystyle';
// import Line from '../../../components/Line/Line';
// import AppImages from '../../../common/AppImages';
// import {useNavigation} from '@react-navigation/native';
// import {getimage} from '../../../config/url';

// const OrderDetail = props => {
//   const navigation = useNavigation();
//   return (
//     <TouchableOpacity
//       onPress={() => {
//         navigation.navigate('orderinfo', {
//           id: props.orderDetails?.id,
//         })
//       }}>
//       <View style={[styles.container]}>
//         <View style={[styles.section1]}>
//           <View>
//             <Text style={[styles.parsalNumber]}>{props.parsalNumber}</Text>
//             <Text style={[styles.parsalName]}>{props.parsalName}</Text>
//           </View>
//           <View>
//             <View
//               style={[
//                 styles.parsalStatus,
//                 mystyles.center,
//                 {backgroundColor: props.parsalStatusTextColor},
//               ]}>
//               <Text style={[styles.parsalStatusText, {color: props.textColor}]}>
//                 {props.parsalStatusText}
//               </Text>
//             </View>
//             <Text style={[styles.name, {fontSize: responsiveFontSize(12)}]}>
//               {props.orderDate}
//             </Text>
//           </View>
//         </View>
//         <Line marginH={1} />
//         <View style={[styles.section2]}>
//           <View style={[styles.LocationMainContainer]}>
//             <View style={[styles.fromLocation]}>
//               <Text style={[styles.citystart]}>
//                 {`${props.citystart.split(' ').slice(0, 2).join(' ')}...`}
//               </Text>
//               {/* <Text style={[styles.statestart]}>{props.statestart}</Text> */}
//             </View>

//             <Image
//               source={AppImages.arrowRight}
//               resizeMode="contain"
//               style={styles.rightArrowStyle}
//             />

//             <View style={[styles.toLocation]}>
//               <Text style={[styles.cityend]}>
//                 {`${props.cityend.split(' ').slice(0, 2).join(' ')}...`}
//               </Text>
//               {/* <Text style={[styles.stateend]}>{props.stateend}</Text> */}
//             </View>
//           </View>

//           <View style={[styles.UserDetailMainContainer]}>
//             <View style={styles.userDetail}>
//               <Image
//                 source={{
//                   uri: getimage(
//                     `partners_img/${props.partnerId}/drivers/${props.driverId}_${props.profilePic}`,
//                   ),
//                 }}
//                 style={styles.manStyle}
//               />
//               <View style={styles.userNameAddress}>
//                 <Text style={[styles.name, {fontSize: responsiveFontSize(14)}]}>
//                   {props.name}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.name,
//                     {color: 'grey', fontSize: responsiveFontSize(12)},
//                   ]}>
//                   {props.vNo}
//                 </Text>
//                 {/* <Text style={[styles.address]}>{props.address}</Text> */}
//               </View>
//             </View>

//             <View>
//               <Text style={[styles.name, {fontWeight: '700'}]}>
//                 {'₹ ' + props.tripCost}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default OrderDetail;

// const styles = StyleSheet.create({
//   container: {
//     // height: responsiveHeight(165),
//     backgroundColor: Colors.white,
//     marginHorizontal: responsiveWidth(16),
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     marginVertical: 5,
//   },
//   section1: {
//     flex: 1.1,
//     // backgroundColor: 'green',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   section2: {
//     flex: 2,
//     // backgroundColor: 'orange'
//   },
//   parsalNumber: {
//     fontSize: responsiveFontSize(16),
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   parsalName: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '400',
//     color: Colors.grey,
//   },
//   parsalStatus: {
//     backgroundColor: Colors.black,
//     height: responsiveHeight(27),
//     // paddingVertical: 10,
//     paddingHorizontal: 6,
//     borderRadius: 8,
//   },
//   parsalStatusText: {
//     fontSize: responsiveFontSize(12),
//     color: Colors.black,
//     fontWeight: '500',
//   },
//   LocationMainContainer: {
//     flex: 1,
//     // backgroundColor: 'yellow',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   UserDetailMainContainer: {
//     flex: 1,
//     // backgroundColor: 'pink',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   fromLocation: {
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   toLocation: {
//     alignItems: 'flex-end',
//     flex: 1,
//   },
//   citystart: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '500',
//     color: Colors.black,
//   },
//   statestart: {
//     fontSize: responsiveFontSize(12),
//     fontWeight: '500',
//     color: Colors.grey,
//     marginTop: 1,
//   },
//   rightArrowStyle: {
//     height: responsiveHeight(24),
//     width: responsiveWidth(20),
//     marginTop: responsiveHeight(10),
//   },
//   cityend: {
//     fontSize: responsiveFontSize(14),
//     fontWeight: '500',
//     color: Colors.black,
//   },
//   stateend: {
//     fontSize: responsiveFontSize(12),
//     fontWeight: '500',
//     color: Colors.grey,
//     marginTop: 1,
//   },
//   infoCircleStyle: {
//     height: responsiveHeight(28),
//     width: responsiveWidth(28),
//   },
//   manStyle: {
//     height: 35,
//     width: 35,
//     borderRadius: 35,
//   },
//   userNameAddress: {
//     marginLeft: responsiveWidth(10),
//   },
//   name: {
//     fontSize: responsiveFontSize(12),
//     fontWeight: '500',
//     color: Colors.black,
//   },
//   address: {
//     fontSize: responsiveFontSize(10),
//     fontWeight: '500',
//     color: Colors.grey,
//     marginTop: 2,
//   },
//   userDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

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

const OrderDetail = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('orderinfo', {
          id: props.orderDetails?.id,
        });
      }}>
      <View style={[styles.container]}>
        <View style={[styles.section1]}>
          <View>
            <Text style={[styles.parsalNumber]}>{props.parsalNumber}</Text>
            <Text style={[styles.parsalName]}>{props.parsalName}</Text>
          </View>
          <View>
            <View
              style={[
                styles.parsalStatus,
                mystyles.center,
                {backgroundColor: props.parsalStatusTextColor},
              ]}>
              <Text style={[styles.parsalStatusText, {color: props.textColor}]}>
                {props.parsalStatusText}
              </Text>
            </View>
          </View>
        </View>
        <Line marginH={1} />
        <View style={[styles.section2]}>
          {/* <View style={[styles.LocationMainContainer]}>
            <View style={[styles.fromLocation]}>
              <Text style={[styles.citystart]}>
                {`${props.citystart.split(' ').slice(0, 2).join(' ')}...`}
              </Text>
            </View>

            <Image
              source={AppImages.rightarrow}
              resizeMode="contain"
              style={styles.rightArrowStyle}
            />

            <View style={[styles.toLocation]}>
              <Text style={[styles.cityend]}>
                {`${props.cityend.split(' ').slice(0, 2).join(' ')}...`}
              </Text>
            </View>
          </View> */}
          <View style={[styles.LocationMainContainer]}>
            <View style={[styles.fromLocation]}>
              <Text style={[styles.citystart]}>
                {`${props.citystart.split(' ').slice(0, 2).join(' ')}...`}
              </Text>
              {/* <Text style={[styles.statestart]}>{props.statestart}</Text> */}
            </View>

            <Image
              source={AppImages.rightarrow}
              resizeMode="contain"
              style={styles.rightArrowStyle}
            />

            <View style={[styles.toLocation]}>
              <Text style={[styles.cityend]}>
                {`${props.cityend.split(' ').slice(0, 2).join(' ')}...`}
              </Text>
              {/* <Text style={[styles.stateend]}>{props.stateend}</Text> */}
            </View>
          </View>

          <View style={[styles.UserDetailMainContainer]}>
            <View style={styles.userDetail}>
              <Image
                source={{
                  uri: getimage(
                    `partners_img/${props.partnerId}/drivers/${props.driverId}_${props.profilePic}`,
                  ),
                }}
                style={styles.manStyle}
              />
              <View style={styles.userNameAddress}>
                <Text style={[styles.name, {fontSize: responsiveFontSize(14)}]}>
                  {props.name}
                </Text>
                <Text
                  style={[
                    styles.name,
                    {color: 'grey', fontSize: responsiveFontSize(12)},
                  ]}>
                  {props.vNo}
                </Text>
                {/* <Text style={[styles.address]}>{props.address}</Text> */}
              </View>
            </View>

            <View>
              <Text style={[styles.name, {fontWeight: '800', fontSize: 14,alignSelf:"flex-end"}]}>
                {"₹"}{props.tripCost}
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
                {props.orderDate}
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
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginVertical: 5,
  },
  section1: {
      flex: 1.1,
      // backgroundColor: 'green',
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  section2: {
      flex: 2,
      // backgroundColor: 'orange'
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
      height: responsiveHeight(27),
      // paddingVertical: 10,
      paddingHorizontal: 6,
      borderRadius: 8
  },
  parsalStatusText: {
      fontSize: responsiveFontSize(12),
      color: Colors.black,
      fontWeight: '500'
  },
  LocationMainContainer: {
      flex: 1,
      // backgroundColor: 'yellow',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  UserDetailMainContainer: {
      flex: 1,
      // backgroundColor: 'pink',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
      alignItems: 'center'
  },
  fromLocation: {
      alignItems: 'flex-start',
      flex: 1.8
  },
  toLocation: {
      alignItems: 'flex-end',
      flex: 2,
      // backgroundColor:'red',
      marginLeft:responsiveWidth(8)
  },
  citystart: {
      fontSize: responsiveFontSize(14),
      fontWeight: '500',
      color: Colors.black
  },
  statestart: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: Colors.grey,
      marginTop: 1
  },
  rightArrowStyle: {
      height: responsiveHeight(24),
      width: responsiveWidth(20),
      marginTop: responsiveHeight(10)
  },
  cityend: {
      fontSize: responsiveFontSize(14),
      fontWeight: '500',
      color: Colors.black
  },
  stateend: {
      fontSize: responsiveFontSize(12),
      fontWeight: '500',
      color: Colors.grey,
      marginTop: 1
  },
  infoCircleStyle: {
      height: responsiveHeight(28),
      width: responsiveWidth(28),
  },
  manStyle: {
      height: 35,
      width: 35,
      borderRadius: 35
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
      marginTop: 2
  },
  userDetail: {
      flexDirection: 'row',
      alignItems: "center"
  }
})