import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, Image, StyleSheet } from 'react-native';
import AppImages from '../../../common/AppImages';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import { Fonts } from '../../../common/Theme';

const DateRangeModal = ({ isVisible, onClose, onSelectDateRange }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('today');
                onClose();
              }}
            >
              <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
              <Text style={styles.modalText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('last7Days');
                onClose();
              }}
            >
              <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
              <Text style={styles.modalText}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('lastMonth');
                onClose();
              }}
            >
              <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
              <Text style={styles.modalText}>Last Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('last3Months');
                onClose();
              }}
            >
              <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
              <Text style={styles.modalText}>Last 3 Months</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: responsiveHeight(10),
    padding: responsiveWidth(5),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  modalIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    marginRight: responsiveWidth(10),
  },
  modalText: {
    fontSize: responsiveFontSize(14),
    fontFamily: Fonts.medium,
    color: 'black',
  },
});

export default DateRangeModal;
