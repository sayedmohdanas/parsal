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
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import { Dropdown } from 'react-native-element-dropdown';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { hitHelpAndSupport } from '../../config/api/api';
import { errorToast, successToast } from '../../common/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { Fonts } from '../../common/Theme';

const HelpAndSupport = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isTextInputFocus, setIsTextInputFocus] = useState(false);
  const [images, setImages] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [description, setDescription] = useState('');
  const [isTicketSubmitted, setIsTicketSubmitted] = useState(false);

  const helpSupportOptions = [
    { label: 'FAQ', value: 'faq' },
    { label: 'Contact Support', value: 'contact_support' },
    { label: 'Feedback', value: 'feedback' },
    { label: 'Terms and Conditions', value: 'terms_conditions' },
    { label: 'Privacy Policy', value: 'privacy_policy' },
  ];

  const handleHelpSupportOption = (value) => {
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

  const handleSubmit = async () => {
    try {
      const getCustomerId = await AsyncStorage.getItem('customerId');
      const randomString = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now();
      const imgName = `screenshot_${randomString}_${timestamp}.png`;

      const payload = {
        topic: value,
        description: description,
        user_id: getCustomerId,
        user_type: 1,
        support_pic: [
          {
            img_name: imgName,
            img_src: `data:image/png;base64,${postImages}`,
          },
        ],
      };

      const response = await hitHelpAndSupport(payload);
      if (response.success) {
        setImages('');
        setPostImages('');
        setDescription('');
        setIsTicketSubmitted(true);
      } else {
        errorToast('Error', response.message || 'Failed to submit support ticket.');
      }
    } catch (error) {
      console.log('Error submitting support ticket:', error);
      Alert.alert('Error', 'An error occurred while submitting the support ticket.');
    }
  };

  useEffect(() => {
    if (isTicketSubmitted) {
      setTimeout(() => {
        setIsTicketSubmitted(false);
        navigation.navigate('HelpAndSupportMain');
      }, 1000);
    }
  }, [isTicketSubmitted]);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    })
      .then((selectedImage) => {
        setImages(selectedImage.path);
        setPostImages(selectedImage.data);
      })
      .catch((error) => {
        console.log('Error picking images:', error);
      });
  };

  const handleRemoveImage = () => {
    setImages('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderBackButton
        headerText="Help & Support"
        onPress={() => navigation.goBack()}
        rightButton="VIEW TICKET"
        rightButtonColor="#3D40D1"
        rightButtonFontSize={12}
        onButtonPress={() => navigation.navigate('HelpAndSupportMain')}
      />

      {isTicketSubmitted ? (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.ticketSubmittedContainer}>
            <Image
              source={AppImages.ticketSubmitted}
              style={styles.ticketSubmittedImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.ticketSubmittedText}>Ticket Submitted!</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={AppImages.helpSupport}
              style={{ height: responsiveHeight(245), width: responsiveWidth(300) }}
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
            placeholder={!isFocus ? 'Select Type' : '...'}
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
              style={[styles.largeTextInput, isTextInputFocus && { borderColor: 'blue' }]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your issue here..."
              placeholderTextColor="#999"
              onFocus={() => setIsTextInputFocus(true)}
              onBlur={() => setIsTextInputFocus(false)}
            />
          </View>

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerButtonText}>Pick Images</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  ticketSubmittedContainer: {
    height: responsiveHeight(96),
    width: responsiveHeight(96),
    backgroundColor: '#88C94133',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketSubmittedImage: {
    height: responsiveHeight(74),
    width: responsiveWidth(74),
  },
  ticketSubmittedText: {
    fontSize: responsiveFontSize(16),
    color: '#777777',
    marginTop: 15,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(20),
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
    fontSize: responsiveFontSize(12),
    color: '#777777',
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
  },
  largeTextInput: {
    height: responsiveHeight(150),
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
    height: responsiveHeight(50),
    width: responsiveWidth(200),
    backgroundColor: '#3D40D1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
