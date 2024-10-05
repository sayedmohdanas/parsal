import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import PageButtons from '../../components/TempBtn/TempBtn';
import Loading from '../../components/Loading/Loading';
import { createPartner } from '../../redux/HitApis/HitApiSlice';
import { errorToast, generateRandomPhoneNumber, successToast } from '../../common/CommonFunction';
import Colors from '../../common/Colors';
import { responsiveFontSize, responsiveHeight } from '../../common/metrices';

const OwnerDetailScreen = ({ navigation, route }) => {
  const { partner_id, email } = route.params;
console.log(route.params);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.parsalPartner.loading);
  const [name, setName] = React.useState('');
  const [aadharCardUploaded, setAadharCardUploaded] = React.useState(null);
  const [panCardUploaded, setPanCardUploaded] = React.useState(null);
  const [selfieUploaded, setSelfieUploaded] = React.useState(null);


  const handleSubmit = async () => {

    if (name && aadharCardUploaded && panCardUploaded && selfieUploaded) {
      const payload = {

        partnerId: partner_id,
        partner_name: name,
        email: email,
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
            doc_id: '1',
            img_name: 'aadhar.png',
            img_src: aadharCardUploaded?.base64 || '',
          },
          {
            doc_id: '2',
            img_name: 'pan.png',
            img_src: panCardUploaded?.base64 || '',
          }
        ]
      };

      try {

        const resultAction = await dispatch(createPartner(payload));
        if (createPartner.fulfilled.match(resultAction)) {
          successToast('Submitted', 'Your details have been submitted.');
          navigation.navigate('VehicleDetail');
        } else {
          errorToast('Not Created', 'Something went wrong.');

        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
        console.error('error', error);
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields and upload all documents.');
    }
  };


  const isEnabled = name && aadharCardUploaded && panCardUploaded && selfieUploaded;

  return (
    <>
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
    </View>

<Loading loading={loading} />

</>

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
    paddingBottom: responsiveHeight(80),
  },
  headinglabel: {
    fontSize: responsiveFontSize(18),
    color: 'black',
    marginVertical: 20,
    fontWeight: '600',
  },
  redAsterisk: {
    color: 'red',
  },
});

export default OwnerDetailScreen;


