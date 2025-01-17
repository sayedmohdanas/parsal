import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../common/metrices';
const uplodedImage = require('../../assets/images/uploded.png');
const ImagePickerComponent = ({ labelText, uploaded, onImagePick, useCamera = false,required=true ,isForProfile=false}) => {
  const pickImage = async () => {
    try {
      const response = useCamera
        ? await ImagePicker.openCamera({ cropping: true })
        : await ImagePicker.openPicker({
          width: isForProfile ? responsiveWidth(400) : responsiveHeight(600), // Smaller width for profile images
          height: isForProfile ? responsiveWidth(400) : responsiveHeight(600),// Smaller height for profile images
          cropping: true,
          cropperToolbarTitle: 'Crop Your Image', 
          cropperCircleOverlay: isForProfile ? true : false, // Circular crop for profile images
          compressImageQuality: 0.7, // Compress quality
          compressImageMaxWidth:isForProfile ? responsiveWidth(400) : responsiveHeight(600), // Maximum width for profile
          compressImageMaxHeight: isForProfile ? responsiveWidth(400) : responsiveHeight(600), // Maximum height for profile
          includeBase64: true,
          freeStyleCropEnabled: true, // Restricts free cropping to maintain aspect ratio
          showCropFrame:false

        })

      if (response) {
        // const base64Data = response.data;
        // const base64Data = response.data;
        const base64Data = `data:${response.mime};base64,${response.data}`;
        const imagePath = response.path;
        // Pass the image data including base64
        onImagePick({
          uri: imagePath,
          base64: base64Data,
          mime: response.mime,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.card}>
      <View style={styles.uploadContainer}>
        <View style={styles.uploadLabelContainer}>
          <Text style={styles.uploadLabel}>
            {labelText}
            {required &&(
            <Text style={styles.redAsterisk}>*</Text>
)}
          </Text>
          {uploaded &&
            <View style={styles.uplodedIConView}>
              <Image source={uplodedImage} resizeMode='contain' style={{height:responsiveHeight(15),width:responsiveWidth(15)}} />
              <Text style={styles.uploadedText}>Uploaded</Text>
            </View>
          }
        </View>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.uploadButton}
        >
          {!uploaded ? (
            <View style={{
              flexDirection: 'row', gap: 3, justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image
                source={AppImages.cameraImage}
                style={{
                  height: responsiveWidth(16),
                  width: responsiveWidth(16),
           
                }}
                resizeMode='contain'
              />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </View>
          ) : (
            <Image
              source={AppImages.editPen}
              resizeMode='contain'
              style={{ height: 20, width: 20 }}
           
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginBottom: responsiveHeight(12),
    flexDirection: 'row',
    paddingVertical: responsiveHeight(12),
    borderRadius: 5,
    padding: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
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
    fontSize: responsiveFontSize(15),
    color: '#333',
    marginBottom: responsiveHeight(4),
    fontWeight: '500'
  },
  redAsterisk: {
    color: 'red',
  },
  uploadButton: {
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(15),
    borderRadius: 4,
  },
  uploadButtonText: {
    color: Colors.brandBlue,
    fontSize: responsiveFontSize(16),
  },
  editButtonText: {
    color: 'blue',
    fontSize: responsiveFontSize(16),
  },
  uplodedIConView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  uploadedText: {
    color: 'green',
    fontSize: responsiveFontSize(12),
    fontWeight: '500',
    marginLeft: responsiveWidth(5),
  },
});
export default ImagePickerComponent;