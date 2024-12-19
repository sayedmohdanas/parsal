import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import { Fonts } from '../../../common/Theme';

const DateRangeModal = ({ isVisible, onClose, onSelectDateRange, selectedKey }) => {
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
            {/* Top centered "Filter" text */}
            <Text style={styles.modalHeader}>Filter</Text>

            {/* Options */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('today');
                onClose();
              }}
            >
              <View style={styles.circle}>
                {selectedKey === 'today' && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.modalText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('last7Days');
                onClose();
              }}
            >
              <View style={styles.circle}>
                {selectedKey === 'last7Days' && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.modalText}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('lastMonth');
                onClose();
              }}
            >
              <View style={styles.circle}>
                {selectedKey === 'lastMonth' && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.modalText}>Last Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onSelectDateRange('last3Months');
                onClose();
              }}
            >
              <View style={styles.circle}>
                {selectedKey === 'last3Months' && <View style={styles.innerCircle} />}
              </View>
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
  },
  modalHeader: {
    textAlign: 'center',
    fontSize: responsiveFontSize(20),
    fontWeight:'500',
    paddingVertical:responsiveHeight(8),
    color: Colors.black,
    borderBottomWidth:0.4,
    borderBottomColor:Colors.grey
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
    borderRadius: responsiveHeight(5),
    backgroundColor: Colors.white,
    marginHorizontal:responsiveWidth(8)
  },
  circle: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    borderWidth: 1,
    borderColor: Colors.grey,
    marginRight: responsiveWidth(10),
    alignItems: 'center', // Center the inner circle
    justifyContent: 'center', // Center the inner circle
    backgroundColor: Colors.white,
  },
  innerCircle: {
    width: responsiveWidth(10), // Smaller than the main circle
    height: responsiveWidth(10), // Smaller than the main circle
    borderRadius: responsiveWidth(5),
    backgroundColor: Colors.brandBlue, // Blue color
  },
  modalText: {
    fontSize: responsiveFontSize(14),
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
});

export default DateRangeModal;
