import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../common/metrices';

const HelpAndSupportCard = ({
  topic,
  status,
  description,
  createdAt,
  onPress,
}) => {
  const statusInfo = {
    text: status === 1 ? 'Open' : 'Closed',
    textColor: status === 1 ? '#567D40' : '#7D4040',
    backgroundColor: status === 1 ? '#E5F6E6' : '#F6E5E5',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginHorizontal: responsiveWidth(16),
        backgroundColor: 'white',
        elevation: 1,
        marginVertical: 10,
        borderRadius: 10,
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.ticketIdText}>{topic}</Text>

          {/* Status View */}
          <View
            style={[
              styles.parsalStatus,
              {backgroundColor: statusInfo.backgroundColor},
            ]}>
            <Text
              style={[styles.parsalStatusText, {color: statusInfo.textColor}]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>{createdAt}</Text>
      </View>

      <View style={{marginTop: responsiveHeight(1)}}>
        <Text numberOfLines={2} style={styles.descriptionText}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  parsalStatus: {
    height: responsiveHeight(20),
    paddingHorizontal: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  parsalStatusText: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
  },
  ticketIdText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: 'black',
    marginRight: 10,
  },
  dateText: {
    color: 'grey',
    fontSize: responsiveFontSize(12),
  },
  descriptionText: {
    marginTop: 4,
    color: 'grey',
  },
});

export default HelpAndSupportCard;
