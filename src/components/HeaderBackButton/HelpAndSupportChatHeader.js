import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';

const HelpAndSupportChatHeader = props => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={props.onPress} style={styles.backButton}>
        <Image
          source={AppImages.previous}
          resizeMode="contain"
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Header Text */}
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>Help and Support</Text>
        <Text style={styles.subHeaderText}>Ticket ID: {props.ticketId}</Text>
      </View>

      {/* Optional Right Button */}
      {props.rightButton && (
        <TouchableOpacity onPress={props.onButtonPress}>
          <Text style={styles.rightButton}>{props.rightButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.5,
    paddingVertical: responsiveHeight(10),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: responsiveWidth(6),
  },
  backIcon: {
    height: responsiveHeight(28),
    width: responsiveWidth(28),
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(10),
    marginLeft: responsiveWidth(10),
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.black,
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
  },
  subHeaderText: {
    color: Colors.grey,
    fontSize: responsiveFontSize(14),
    marginTop: responsiveHeight(2),
  },
  rightButton: {
    color: Colors.black,
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    marginRight: responsiveWidth(14),
  },
});

export default HelpAndSupportChatHeader;
