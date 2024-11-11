import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
// import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import {Dropdown} from 'react-native-element-dropdown';
import CustomButton from '../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {hitHelpAndSupport} from '../../config/api/api';
import {errorToast, successToast} from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const AddHelpAndSupport = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isTextInputFocus, setIsTextInputFocus] = useState(false);
  const [images, setImages] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [description, setDescription] = useState();
  const helpSupportOptions = [
    {label: 'Frequently Asked Questions', value: 'faq'},
    {label: 'Contact Customer Support', value: 'contact_support'},
    {label: 'Provide Feedback', value: 'feedback'},
    {label: 'Terms of Service', value: 'terms_conditions'},
    {label: 'Privacy and Data Protection Policy', value: 'privacy_policy'},
    {label: 'Submit a Support Request', value: 'submit_request'}, // New option
    {label: 'Access Live Support Chat', value: 'live_chat'}, // New option
    {label: 'Browse Help Center Articles', value: 'help_articles'}, // New option
    {label: 'Report an Issue', value: 'report_issue'}, // New option
    {label: 'Track Your Support Ticket', value: 'track_ticket'}, // New option
  ];

  const handleSubmit = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsed_user = JSON.parse(user);
      const randomString = Math.random().toString(36).substring(2, 10); // Generates a random string of 8 characters
      const timestamp = Date.now(); // Gets the current timestamp
      const imgName = `screenshot_${randomString}_${timestamp}.png`; // Example: screenshot_a1b2c3d4_1629292929292.png
      const payload = {
        topic: value,
        description: description,
        user_id:
          parsed_user?.payload?.owner_type == 1
            ? parsed_user?.payload?.partner_id
            : parsed_user?.payload?.driver_id,
        user_type: parsed_user?.payload?.owner_type == 1 ? 3 : 2,
        support_pic: [
          {
            img_name: imgName,
            img_src: `data:image/png;base64,${postImages}`,
          },
        ],
      };
      const response = await hitHelpAndSupport(payload);
      if (response.success) {
        successToast('Success', 'Your support ticket has been submitted.');
        setImages('');
        setPostImages('');
        setDescription('');
        navigation.goBack('');
      } else {
        errorToast(
          'Error',
          response.message || 'Failed to submit support ticket.',
        );
      }
    } catch (error) {
      console.log('Error submitting support ticket:', error);
      Alert.alert(
        'Error',
        'An error occurred while submitting the support ticket.',
      );
    }
  };

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      // multiple: true,
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    })
      .then(selectedImages => {
        console.log('selected images=>', selectedImages);
        const imagePaths = selectedImages.path;
        const postImages = selectedImages.data;
        setImages(imagePaths);
        setPostImages(postImages);
      })
      .catch(error => {
        console.log('Error picking images:', error);
      });
  };

  // Function to remove an image from the array
  const handleRemoveImage = () => {
    setImages('');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBackButton
        headerText="Help & Support"
        onPress={() => navigation.goBack()}
      />

      <ScrollView>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={AppImages.helpSupport}
            style={{
              height: responsiveHeight(200),
              width: responsiveWidth(200),
            }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            marginHorizontal: responsiveWidth(16),
            marginTop: responsiveHeight(5),
          }}>
          <Dropdown
            style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={{color: 'black'}}
            iconStyle={styles.iconStyle}
            data={helpSupportOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select an option' : '...'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
              // handleHelpSupportOption(item.value);
            }}
          />
        </View>

        <View style={styles.textInputContainer}>
          <TextInput
            style={[
              styles.largeTextInput,
              isTextInputFocus && {borderColor: 'blue'},
            ]}
            multiline
            value={description}
            onChangeText={e => setDescription(e)}
            placeholder="Describe your issue here..."
            placeholderTextColor="#999"
            onFocus={() => setIsTextInputFocus(true)}
            onBlur={() => setIsTextInputFocus(false)}
          />
        </View>

        <View style={styles.imagePickerContainer}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imagePickerButton}>
            <Text style={styles.imagePickerButtonText}>Pick Images</Text>
          </TouchableOpacity>
        </View>

        {
          // images.length > 0 && (
          //     <View style={styles.imageGridContainer}>
          //         {images.map((img, index) => (
          //             <View key={index} style={styles.imageContainer}>
          //                 <Image
          //                     source={{ uri: img }}
          //                     style={styles.gridImage}
          //                 />
          //                 {/* "X" Button to remove the image */}
          //                 <TouchableOpacity
          //                     style={styles.removeImageButton}
          //                     onPress={() => handleRemoveImage(index)}
          //                 >
          //                     <Text style={{ color: 'white', fontWeight: '900', fontSize: responsiveFontSize(12), }}>
          //                         X
          //                     </Text>
          //                 </TouchableOpacity>
          //             </View>
          //         ))}
          //     </View>
          // )
        }

        {images != null && images != undefined && images != '' ? (
          <View style={styles.imageGridContainer}>
            <View style={{}}>
              <Image source={{uri: images}} style={styles.gridImage} />
              {/* "X" Button to remove the image */}
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => handleRemoveImage()}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '900',
                    fontSize: responsiveFontSize(10),
                  }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: responsiveHeight(30),
            marginBottom: responsiveHeight(100),
          }}>
          <CustomButton
            buttonText={'Submit'}
            grey={false}
            onPress={() => {
              handleSubmit();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddHelpAndSupport;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    elevation: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  textInputContainer: {
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(20),
  },
  largeTextInput: {
    height: responsiveHeight(140),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  imagePickerContainer: {
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    // backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    height: responsiveHeight(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  imagePickerButtonText: {
    color: 'grey',
    fontSize: 16,
  },
  selectedImage: {
    marginTop: responsiveHeight(20),
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    borderRadius: 8,
    marginRight: 10, // Adds spacing between images
  },
  imageGridContainer: {
    marginTop: responsiveHeight(12),
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows images to wrap to the next line
    justifyContent: 'space-between', // Space images evenly
    paddingHorizontal: responsiveWidth(12),
    borderWidth: 1,
    borderStyle: 'dotted',
    paddingVertical: responsiveHeight(8),
    marginHorizontal: responsiveWidth(16),
    borderRadius: 10,
  },
  gridImage: {
    width: responsiveWidth(80), // Set the width of each image
    height: responsiveHeight(80), // Set the height of each image
    borderRadius: 8,
    marginBottom: responsiveHeight(5), // Adds spacing between rows
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 2,
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
