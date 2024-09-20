// CustomNotificationModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Colors from '../../common/Colors';

const NotificationModal = ({ isVisible, onAccept, onReject, title, body, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonReject} onPress={onReject}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAccept} onPress={onAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 5, // Updated border radius
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:Colors.black
  },
  body: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color:Colors.black

  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonReject: {
    backgroundColor: Colors.grey,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonAccept: {
    backgroundColor: '#3D40D1', // Updated background color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Updated text color
    fontWeight: 'bold',
  },
});

export default NotificationModal;
