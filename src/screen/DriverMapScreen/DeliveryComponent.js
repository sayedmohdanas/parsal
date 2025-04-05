import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import { Spacing } from '../../common/Theme';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';

const DeliveryModal = ({ visible, address, onDelivered, onCancel, onClose, deliver_modal_loader }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.arrivedContainer}>
              <Text style={styles.arrivedText}>I'm Arrived</Text>
              <TouchableOpacity onPress={onCancel} style={styles.crossButton}>
                <Image style={styles.crossIcon} source={AppImages.crossIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.stopLabelContainer}>
              <Text style={styles.stopLabel}>Stop</Text>
            </View>
            <View style={styles.addressRow}>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Section with Delivered Here and Cancel Buttons */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.deliveredButton} onPress={onDelivered} disabled={deliver_modal_loader}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Delivered Here</Text>
                {deliver_modal_loader && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Add this style to your styles object



const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: responsiveWidth(10)
  },
  topSection: {
    // Additional styling if needed
  },
  arrivedContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: responsiveHeight(10)
  },
  arrivedText: {
    color: 'red',
    textAlign: 'center',
    fontSize: responsiveFontSize(16),
    fontWeight: '600'
  },
  crossButton: {
    position: 'absolute',
    right: 0,  // Adjust as needed
    top: 0,     // Adjust as needed
    padding: 10, // Ensures the touch area is large enough
  },
  crossIcon: {
    height: responsiveHeight(15),
    width: responsiveWidth(15)
  },

  stopLabelContainer: {
    marginLeft: responsiveWidth(14),
    marginTop: responsiveHeight(6)
  },
  stopLabel: {
    color: '#000000',
    fontWeight: '500',
    fontSize: responsiveFontSize(16)
  },
  addressRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(10),
    marginTop: Spacing.small
  },
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(20)
  },
  addressText: {
    color: Colors.black,
    fontSize: responsiveFontSize(14),
    fontWeight: '400',
    lineHeight: 16.96
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: responsiveHeight(10)
  },
  deliveredButton: {
    backgroundColor: Colors.green || 'green',
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(15),
    borderRadius: 5,
    flex: 1,
    marginRight: responsiveWidth(5),
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginLeft: 10, // Adjust spacing between text and loader
  },
  cancelButton: {
    backgroundColor: Colors.red || 'red',
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(15),
    borderRadius: 5,
    flex: 1,
    marginLeft: responsiveWidth(5),
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default DeliveryModal;
