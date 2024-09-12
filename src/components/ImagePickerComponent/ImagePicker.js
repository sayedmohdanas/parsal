import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AppImages from '../../common/AppImages';
import Colors from '../../common/Colors';

const uplodedImage = require('../../assets/images/uploded.png');


const ImagePickerComponent = ({ labelText, uploaded, onImagePick, useCamera = false }) => {

  const pickImage = async () => {
    try {
      const response = useCamera
        ? await ImagePicker.openCamera({ cropping: true })
        : await ImagePicker.openPicker({
          width: 800,
          height: 800,
          cropping: true,
          includeBase64: true
        })

      // if (response) {
      //    const imagePath = response.path;
      // const base64Data = `data:${response.mime};base64,${response.data}`;
      //   console.log(response?.path, 'image sqsqwdqedpicker test');
      //   onImagePick(response); // Pass the actual image response
      // }
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
      // Alert.alert('Error', 'An error occurred while picking the image.');
      console.error(error);
    }
  };


  return (
    <View style={styles.card}>
      <View style={styles.uploadContainer}>
        <View style={styles.uploadLabelContainer}>
          <Text style={styles.uploadLabel}>
            {labelText}
            <Text style={styles.redAsterisk}>*</Text>
          </Text>
          {uploaded &&
            <View style={styles.uplodedIConView}>
              <Image source={uplodedImage} style={styles.image} />

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
                  // position: 'absolute',
                  height: 16,
                  width:16,
                  // right: responsiveWidth(43),
                  // top: responsiveHeight(27)
              }}
              resizeMode='contain'
              />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </View>


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
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 5,
    padding: 16,
    borderWidth: 0.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '600'
  },
  redAsterisk: {
    color: 'red',
  },
  uploadButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  uploadButtonText: {
    color: Colors.brandBlue,
    fontSize: 16,
    // fontWeight:'600'
    fontWeight:'300'

  },
  editButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  uplodedIConView: {
    flexDirection: 'row',
    alignItems: 'center'


  },
  uploadedText: {
    color: 'green',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,

  },
});

export default ImagePickerComponent;
