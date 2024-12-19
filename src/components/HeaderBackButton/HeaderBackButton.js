// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React from 'react';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../common/metrices';
// import Colors from '../../common/Colors';
// import AppImages from '../../common/AppImages';

// const HeaderBackButton = props => {
//   return (
//     <View
//       style={{
//         height: responsiveHeight(60),
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBlockColor: '#D8D8D8',
//         borderBottomWidth: 0.5,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//         }}>
//         <TouchableOpacity style={{position:"absolute"}} onPress={props.onPress}>
//           <Image
//             source={AppImages.previous}
//             resizeMode="contain"
//             style={{
//               height: responsiveHeight(28),
//               width: responsiveWidth(28),
//               marginLeft: responsiveWidth(10),
//             }}
//           />
//         </TouchableOpacity>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Text
//             style={{
//               color: Colors.black,
//               fontSize: responsiveFontSize(18),
//               fontWeight: '500',
//               marginLeft: responsiveWidth(10),
//             }}>
//             {props.headerText}
//           </Text>
//         </View>
//       </View>

//       <TouchableOpacity onPress={props.onButtonPress}>
//         <Text
//           style={{
//             color: Colors.black,
//             fontSize: responsiveFontSize(16),
//             fontWeight: '500',
//             marginRight: responsiveWidth(14),
//           }}>
//           {props.rightButton}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default HeaderBackButton;

// const styles = StyleSheet.create({});


import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';

const HeaderBackButton = props => {
  return (
    <View style={styles.container}>
      {/* Left Section (Back Button) */}
      <TouchableOpacity style={styles.backButton} onPress={props.onPress}>
        <Image
          source={AppImages.previous}
          resizeMode="contain"
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Center Section (Title) */}
      <View>

      <Text style={styles.headerText}>{props.headerText}</Text>
{props.middleHeaderText&&(
      <Text style={styles.middleHeaderText}> as on {props.middleHeaderText}</Text>

)}
      </View>

      {/* Right Section (Button or Icon) */}
      {props.rightButton ? (
        <TouchableOpacity
          style={styles.rightButtonContainer}
          onPress={props.onButtonPress}>
          {typeof props.rightButton === 'string' ? (
            <Text style={styles.rightButtonText}>{props.rightButton}</Text>
          ) : (
            <Image
              source={props.rightButton}
              resizeMode="contain"
              style={styles.rightIcon}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

export default HeaderBackButton;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(60),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    paddingHorizontal: responsiveWidth(10),
  },
  backButton: {
    padding: responsiveWidth(5),
  },
  backIcon: {
    height: responsiveHeight(28),
    width: responsiveWidth(28),
  },
  headerText: {
    // flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: '500',
  },
  middleHeaderText: {
    // flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
  },

  rightButtonContainer: {
    padding: responsiveWidth(5),
  },
  rightButtonText: {
    color: Colors.black,
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
  },
  rightIcon: {
    height: responsiveHeight(19),
    width: responsiveWidth(19),
    resizeMode:'contain'
  },
  placeholder: {
    width: responsiveWidth(28), // Placeholder for layout balance
  },
});
