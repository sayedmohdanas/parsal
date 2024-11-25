
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
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
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
import {Fonts, FontSizes, Spacing} from '../../common/Theme';
import Colors from '../../common/Colors';
const AddHelpAndSupport = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isTextInputFocus, setIsTextInputFocus] = useState(false);
  const [images, setImages] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [isTicketSubmitted, setIsTicketSubmitted] = useState(false);
  const maxLength = 150; // Maximum character limit
  const [description, setDescription] = useState(''); // Default to empty string

  const remainingCount = maxLength - description.length; // Calculate

  const helpSupportOptions = [
    {label: 'Frequently Asked Questions', value: 'Frequently Asked Questions'},
    {label: 'Contact Customer Support', value: 'Contact Customer Support'},
    {label: 'Provide Feedback', value: 'Provide Feedback'},
    {label: 'Terms of Service', value: 'Terms of Service'},
    {
      label: 'Privacy and Data Protection Policy',
      value: 'Privacy and Data Protection Policy',
    },
    {label: 'Submit a Support Request', value: 'Submit a Support Request'}, // New option
    {label: 'Access Live Support Chat', value: 'Access Live Support Chat'}, // New option
    {
      label: 'Browse Help Center Articles',
      value: 'Browse Help Center Articles',
    }, // New option
    {label: 'Report an Issue', value: 'Report an Issue'}, // New option
    {label: 'Track Your Support Ticket', value: 'Track Your Support Ticket'}, // New option
  ];

  const handleHelpSupportOption = value => {
    switch (value) {
      case 'faq':
        console.log('Navigate to FAQ');
        break;
      case 'contact_support':
        console.log('Navigate to Contact Support');
        break;
      case 'feedback':
        console.log('Navigate to Feedback');
        break;
      case 'terms_conditions':
        console.log('Navigate to Terms and Conditions');
        break;
      case 'privacy_policy':
        console.log('Navigate to Privacy Policy');
        break;
      default:
        console.log('No action for this option');
    }
  };

  useEffect(() => {
    if (isTicketSubmitted) {
      setTimeout(() => {
        setIsTicketSubmitted(false);

        navigation.navigate('HelpAndSupport');
      }, 2000);
    }
    
  }, [isTicketSubmitted]);

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
        // navigation.goBack('');
        setIsTicketSubmitted(true);
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
  const [imagesarray, setimagesarray] = useState([]);
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      // multiple: true,
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    })
      .then(selectedImages => {
        if (imagesarray.length >= 3) {
          console.log('Maximum limit of 3 images reached.');
          return;
        }
        const imagePaths = selectedImages.path;
        const postImages = selectedImages.data;
        setImages(imagePaths);
        setPostImages(postImages);
        const imageObject = {
          id: imagesarray?.length + 1, // Generate a unique ID for each image
          path: imagePaths,
        };
        setimagesarray([...imagesarray, imageObject]);
      })
      .catch(error => {
        console.log('Error picking images:', error);
      });
  };

  // Function to remove an image from the array
  const handleDeleteImage = id => {
    setimagesarray(imagesarray.filter(image => image.id !== id));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderBackButton
        headerText="Help & Support"
        onPress={() => navigation.goBack()}
        rightButton={'VIEW TICKET'}
        rightButtonColor={'#3D40D1'}
        rightButtonFontSize={12}
        onButtonPress={() => {
          navigation.navigate('HelpAndSupportMain');
        }}
      />

      {isTicketSubmitted == true ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: responsiveHeight(96),
              width: responsiveHeight(96),
              backgroundColor: '#88C94133',
              borderRadius: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={AppImages.ticketSubmitted}
              style={{
                height: responsiveHeight(74),
                width: responsiveWidth(74),
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: responsiveFontSize(16),
              color: '#777777',
              marginTop: 15,
              fontWeight: '500',
            }}>
            Ticket Submitted !
          </Text>
        </View>
      ) : (
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={AppImages.helpSupport}
              style={{
                height: responsiveHeight(220),
                width: responsiveWidth(250),
                marginBottom: Spacing.small,
              }}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              marginHorizontal: responsiveWidth(16),
            }}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: '#3D40D1'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={{
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                // marginTop:10
              }}
              itemTextStyle={{
                color: '#232323',
                fontWeight: '500',
                borderBottomWidth: 1,
                fontSize: FontSizes.medium,

                paddingBottom: 10,
                borderColor: '#F3F3F3',
              }}
              iconStyle={styles.iconStyle}
              data={helpSupportOptions}
              maxHeight={responsiveHeight(350)}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Type' : '...'}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
                handleHelpSupportOption(item.value);
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
              placeholderTextColor="#777777"
              onFocus={() => setIsTextInputFocus(true)}
              onBlur={() => setIsTextInputFocus(false)}
              maxLength={maxLength}
            />
            <Text style={styles.remainingCount}>
              {remainingCount} / {maxLength}
            </Text>
          </View>

          {images != null && images != undefined && images != '' &&imagesarray?.length !=0? (
            <View style={styles.imageGridContainer}>
              {imagesarray?.map(item => {
                return (
                  <>
                    <View style={{marginHorizontal: responsiveWidth(4)}}>
                      <Image
                        source={{uri: item?.path}}
                        style={styles.gridImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleDeleteImage(item?.id)}>
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
                  </>
                );
              })}
              {imagesarray?.length != 3 && (
                <View style={styles.imagePickerContainer2}>
                  <TouchableOpacity
                    onPress={handleImagePicker}
                    style={styles.imagePickerButton2}>
                    <Text style={styles.imagePickerButtonText}>
                      {'+ Add Image'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity
                onPress={handleImagePicker}
                style={styles.imagePickerButton}>
                <Text style={styles.imagePickerButtonText}>
                  {'+ Add Image'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
        </View>
      )}
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
    height: responsiveHeight(50),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: FontSizes.medium,
    color: Colors.grey,
    fontWeight: Fonts.semilarge,
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
    position: 'relative',
  },
  largeTextInput: {
    height: responsiveHeight(150),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(10),
    textAlignVertical: 'top',
    fontSize: FontSizes.medium,
    backgroundColor: '#fff',
    color: '#000',
    letterSpacing: 0.3,
    lineHeight: 20,
    paddingRight: responsiveWidth(40),
  },
  remainingCount: {
    position: 'absolute',
    bottom: responsiveHeight(12),
    right: responsiveWidth(16),
    fontSize: FontSizes.small,
    color: '#777777',
  },
  imagePickerContainer: {
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerContainer2: {
    marginLeft: responsiveWidth(2),
    // backgroundColor:'red'
    // marginVertical:responsiveHeight(19),
    // marginTop: responsiveHeight(20),
    // backgroundColor:'yellow',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  imagePickerButton2: {
    // backgroundColor: '#333',
    borderRadius: Spacing.small,
    height: responsiveHeight(100),
    width: responsiveWidth(85),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  imagePickerButton: {
    // backgroundColor: '#333',
    padding: 10,
    borderRadius: Spacing.small,
    // height: responsiveHeight(100),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // borderStyle: 'dotted',
    borderColor: '#D8D8D8',
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
    marginTop: responsiveHeight(20),
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows images to wrap to the next line
    // justifyContent: 'space-between', // Space images evenly
    // paddingHorizontal: responsiveWidth(16),
    borderWidth: 1,
    borderStyle: 'dotted',
    padding: 10,
    marginHorizontal: responsiveWidth(16),
    borderRadius: 10,
  },
  gridImage: {
    width: responsiveWidth(85), // Set the width of each image
    height: responsiveHeight(100), // Set the height of each image
    borderRadius: 8,

    // marginBottom: responsiveHeight(10), // Adds spacing between rows
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    // padding: 2,
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
