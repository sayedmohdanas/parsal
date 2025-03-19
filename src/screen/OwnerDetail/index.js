import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import SubmitCard from '../../components/SumbmitButton/SubmitButton';
import PageButtons from '../../components/TempBtn/TempBtn';
import Loading from '../../components/Loading/Loading';
import {createPartner, setParentId} from '../../redux/HitApis/HitApiSlice';
import {
  errorToast,
  generateRandomPhoneNumber,
  successToast,
} from '../../common/CommonFunction';
import Colors from '../../common/Colors';
import {responsiveFontSize, responsiveHeight} from '../../common/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { getMessaging } from '@react-native-firebase/messaging';
import { hitGetDoctypes } from '../../config/api/api';

const OwnerDetailScreen = ({navigation, route}) => {
  const {partner_id, email} = route.params;
  const dispatch = useDispatch();
  const loading = useSelector(state => state.parsalPartner.loading);
  const [name, setName] = React.useState('');
  const [aadharCardUploaded, setAadharCardUploaded] = React.useState(null);
  const [panCardUploaded, setPanCardUploaded] = React.useState(null);
  const [selfieUploaded, setSelfieUploaded] = React.useState(null);
  const [partnerDocs, setPartnerDocs] = useState([]);


  useEffect(() => {
    const fetchPartnerDocs = async () => {
      try {
        const response = await hitGetDoctypes({ type: 1 });
        console.log('partnerDocs====>>>', response.data);

        if (response?.success) {
          // Add an `uploaded` property to track image uploads
          const updatedDocs = response.data.map((doc) => ({
            ...doc,
            uploaded: null,
          }));
          setPartnerDocs(updatedDocs);
        }
      } catch (error) {
        console.error('Error fetching partner docs:', error);
      }
    };
    fetchPartnerDocs();
  }, []);


  
  // const handleSubmit = async () => {
  //   if (name && aadharCardUploaded && panCardUploaded && selfieUploaded) {
  //     const payload = {
  //       partnerId: partner_id,
  //       partner_name: name,
  //       // email: email,
  //       email: email.replaceAll(' ', '')?.toLocaleLowerCase(),
  //       phone: generateRandomPhoneNumber(),
  //       address: '123, Main Street, Springfield',
  //       admin_remark: 'I am a new partner with id 3',
  //       fcm_token: await getMessaging().getToken(),
  //       profile_pic: [
  //         {
  //           img_name: 'profile.png',
  //           img_src: selfieUploaded?.base64 || '',
  //         },
  //       ],
  //       partner_docs: [
  //         {
  //           doc_id: '1',
  //           img_name: 'aadhar.png',
  //           img_src: aadharCardUploaded?.base64 || '',
  //         },
  //         {
  //           doc_id: '2', 
  //           img_name: 'pan.png',
  //           img_src: panCardUploaded?.base64 || '',
  //         },
  //       ],
  //       status: 0,
  //     };

  //     try {
  //       const resultAction = await dispatch(createPartner(payload));
  //       const partnerId = JSON.parse(resultAction?.meta?.arg?.partnerId);
  //       if (createPartner.fulfilled.match(resultAction)) {
  //         let owner_type = 1;
  //         let user = {
  //           payload: {
  //             owner_type: 1,
  //             partner_id: partnerId,
  //           },
  //         };

  //         successToast('Submitted', 'Your details have been submitted.');
  //         await AsyncStorage.setItem('partner_id', String(partnerId));
  //         await dispatch(setParentId(partnerId));
  //         await AsyncStorage.setItem('user', JSON.stringify(user));
  //         await AsyncStorage.setItem('owner_type', JSON.stringify(owner_type));
  //         navigation.replace('MyVehicles', {
  //           login_user: 0,
  //         });
  //         successToast('Submitted', 'Your details have been submitted.');
  //         // navigation.navigate('VehicleDetail');
  //       } else {
  //         errorToast('Not Created', 'Something went wrong.');
  //       }
  //     } catch (error) {
  //       Alert.alert('Error', 'An unexpected error occurred.');
  //       console.error('error', error);
  //     }
  //   } else {
  //     Alert.alert(
  //       'Error',
  //       'Please fill out all fields and upload all documents.',
  //     );
  //   }
  // };
  const handleSubmit = async () => {
    if (name && selfieUploaded && partnerDocs.every((doc) => doc.id === 3 || doc.uploaded)) {
      ;
      const payload = {
        partnerId: partner_id,
        partner_name: name,
        email: email.replaceAll(' ', '')?.toLowerCase(),
        phone: generateRandomPhoneNumber(),
        address: '123, Main Street, Springfield',
        admin_remark: 'I am a new partner with id 3',
        fcm_token: await getMessaging().getToken(),
        profile_pic: [
          {
            img_name: 'profile.png',
            img_src: selfieUploaded?.base64 || '',
          },
        ],
        partner_docs: partnerDocs.map((doc) => ({
          doc_id: String(doc.id),
          img_name: `${doc.doc_name.toLowerCase().replace(' ', '_')}.png`,
          img_src: doc.uploaded?.base64 || '',
        })),
        status: 0,
      };

      try {
        const resultAction = await dispatch(createPartner(payload));
        const partnerId = JSON.parse(resultAction?.meta?.arg?.partnerId);
        if (createPartner.fulfilled.match(resultAction)) {
          const owner_type = 1;
          const user = {
            payload: {
              owner_type: 1,
              partner_id: partnerId,
            },
          };

          successToast('Submitted', 'Your details have been submitted.');
          await AsyncStorage.setItem('partner_id', String(partnerId));
          await dispatch(setParentId(partnerId));
          await AsyncStorage.setItem('user', JSON.stringify(user));
          await AsyncStorage.setItem('owner_type', JSON.stringify(owner_type));
          navigation.replace('MyVehicles', {
            login_user: 0,
          });
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
  const renderImagePickers = () =>
    partnerDocs
      .filter((doc) => doc.id !== 3) 
      .map((doc, index) => ( 
        <ImagePicker
          key={index}
          labelText={`Upload ${doc.doc_name}`}
          uploaded={doc.uploaded}
          onImagePick={(image) => {
            const updatedDocs = [...partnerDocs];
            updatedDocs[index].uploaded = image;
            setPartnerDocs(updatedDocs);
          }}
          useCamera={false}
        />
      ));
  
  // const isEnabled = name && selfieUploaded && partnerDocs.every((doc) => doc.uploaded);
  const isEnabled =
  name &&
  selfieUploaded &&
  partnerDocs.every((doc) => doc.id === 3 || doc.uploaded);
  return (
    <>
      <HeaderBackButton
        headerText={'Owner Details'}
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
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

          {renderImagePickers()}
          {/* {renderImagePickers()} */}

          <ImagePicker
            labelText="Owner Selfie"
            uploaded={selfieUploaded}
            onImagePick={setSelfieUploaded}
            useCamera={false}
            isForProfile={true}
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
