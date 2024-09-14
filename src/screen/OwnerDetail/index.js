import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import PageButtons from '../../components/TempBtn/TempBtn';
import Loading from '../../components/Loading/Loading';
import { createPartner } from '../../redux/HitApis/HitApiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorToast, successToast } from '../../common/CommonFunction';
import Colors from '../../common/Colors';

const OwnerDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.parsalPartner.loading);
  const [name, setName] = React.useState('');
  const [aadharCardUploaded, setAadharCardUploaded] = React.useState(null);
  const [panCardUploaded, setPanCardUploaded] = React.useState(null);
  const [selfieUploaded, setSelfieUploaded] = React.useState(null);

  const fullData = useSelector(state => state?.parsalPartner)



  const handleSubmit = async () => {
    const generateRandomPhoneNumber = () => {
      const randomPhoneNumber = '9' + Math.floor(Math.random() * 9000000000 + 1000000000);
      return randomPhoneNumber;
    };

    if (name && aadharCardUploaded && panCardUploaded && selfieUploaded) {
      const payload = {
        partner_name: name,
        phone: generateRandomPhoneNumber(),
        address: '123, Main Street, Springfield',
        admin_remark: 'I am a new partner with id 3',
        profile_pic: [
          {
            img_name: 'profile.png',
            img_src: selfieUploaded?.base64 || '',
          }
        ],
        partner_docs: [
          {
            doc_id: '3',
            img_name: 'aadhar.png',
            img_src: aadharCardUploaded?.base64 || '',
          },
          {
            doc_id: '4',
            img_name: 'pan.png',
            img_src: panCardUploaded?.base64 || '',
          }
        ]
      };

      try {
      
        const resultAction = await dispatch(createPartner(payload));
        if (createPartner.fulfilled.match(resultAction)) {
          const partner_id = JSON.stringify(resultAction?.payload?.partner_id)
          await AsyncStorage.setItem('partner_id', partner_id);
          successToast('Submitted', 'Your details have been submitted.');
          // Alert.alert('Submitted', 'Your details have been submitted.');
          navigation.navigate('VehicleDetail');
        } else {
          
          // Alert.alert('Error', resultAction.payload?.message || 'An error occurred while submitting.');
          errorToast('Not Created', 'Something went wrong.');

        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
        console.error('aa',error);
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields and upload all documents.');
    }
  };


  const isEnabled = name && aadharCardUploaded && panCardUploaded && selfieUploaded;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          label="Name"
          isRequired={true}
        />

        <Text style={styles.headinglabel}>
          Upload the following<Text style={styles.redAsterisk}>*</Text>
        </Text>
        <ImagePicker
          labelText="Owner Aadhar Card"
          uploaded={aadharCardUploaded}
          onImagePick={setAadharCardUploaded}
          useCamera={false}
        />

        <ImagePicker
          labelText="Owner PAN Card"
          uploaded={panCardUploaded}
          onImagePick={setPanCardUploaded}
          useCamera={false}
        />

        <ImagePicker
          labelText="Owner Selfie"
          uploaded={selfieUploaded}
          onImagePick={setSelfieUploaded}
          useCamera={false}
        />
      </View>

      <SubmitCard onPress={handleSubmit} isEnabled={isEnabled} />

      <PageButtons nextScreenName={'VehicleDetail'} />

      {/* Show the Loading component */}
      <Loading loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.homeBackground,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  headinglabel: {
    fontSize: 18,
    color: 'black',
    marginVertical: 20,
    fontWeight: '600',
  },
  redAsterisk: {
    color: 'red',
  },
});

export default OwnerDetailScreen;


