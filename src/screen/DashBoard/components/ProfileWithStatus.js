// import React from 'react';
// import { View, Image, StyleSheet } from 'react-native';

// const ProfileWithStatus = ({ isOnline ,profileImage}) => { 
  

//   return (
//     <View style={styles.container}>
//       {/* Use profileImage prop or fallback to default image */}
//       <Image 
//         // source={profileImage ? { uri: profileImage } : AppImages.profileImage} 
//         source={profileImage ? { uri: profileImage } : AppImages.profileImage} 

//         style={styles.profileImage} 
//       />
//       <View 
//         style={[
//           styles.statusContainer, 
//           { backgroundColor: isOnline ? 'green' : 'red' } // Online/offline status color
//         ]} 
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     alignItems: 'flex-end',
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 17.5,
//     marginRight: 10,
//   },
//   statusContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 10,
//     width: 10, // Adjust size as needed
//     height: 10, // Adjust size as needed
//     borderRadius: 5, // Make it a circle
//   },
// });

// export default ProfileWithStatus;





import React, { useState } from 'react';
import { View, Image, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import AppImages from '../../../common/AppImages'; // Import your default images

const ProfileWithStatus = ({ isOnline, profileImage }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      {/* Clickable profile image */}
      <TouchableWithoutFeedback onPress={toggleModal}>
        <Image 
          source={profileImage ? { uri: profileImage } : AppImages.profileImage} 
          style={styles.profileImage} 
        />
      </TouchableWithoutFeedback>
      
      {/* Status indicator */}
      <View 
        style={[
          styles.statusContainer, 
          { backgroundColor: isOnline ? 'green' : 'red' }
        ]} 
      />

      {/* Modal for full-size image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <Image 
              source={profileImage ? { uri: profileImage } : AppImages.profileImage} 
              style={styles.fullSizeImage} 
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: 300, // Adjust to desired size
    height: 300, // Adjust to desired size
    borderRadius: 10,
  },
});

export default ProfileWithStatus;
