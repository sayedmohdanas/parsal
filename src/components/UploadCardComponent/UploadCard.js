// UploadCardComponent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AppImages from '../../common/AppImages';
// import Icon from 'react-native-vector-icons/FontAwesome';

const UploadCardComponent = ({ labelText, uploaded, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.uploadContainer}>
        <View style={styles.uploadLabelContainer}>
          <Text style={styles.uploadLabel}>
            {labelText}
            <Text style={styles.redAsterisk}>*</Text>
          </Text>
          {uploaded && (
            <Text style={styles.uploadedText}>Uploaded</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={styles.uploadButton}
        >
          {!uploaded ? (
            <Text style={styles.uploadButtonText}>Upload</Text>
          ) : (
            <Image
                source={AppImages.editPen}
              // style={{
              //     position: 'absolute',
              //     height: responsiveHeight(35),
              //     width: responsiveWidth(42),
              //     right: responsiveWidth(43),
              //     top: responsiveHeight(27)
              // }}
              // resizeMode='contain'
              />
            // <Text style={styles.editButtonText}>Edit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadLabelContainer: {
    flex: 1,
  },
  uploadLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  redAsterisk: {
    color: 'red',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  uploadButtonText: {
    color: 'red',
    fontSize: 16,
  },
  editButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  uploadedText: {
    color: 'green',
    fontSize: 16,
  },
});

export default UploadCardComponent;
