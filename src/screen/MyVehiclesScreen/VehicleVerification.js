import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Line from '../../components/Line/Line';
import ImagePickerComponent from '../../components/ImagePickerComponent/ImagePicker';
import {hitUpdateDocsApi} from '../../config/api/api';

const VehicleVerificationCard = ({
  verifyVisibleCard,
  setVerifyVisibleCard,
  reject_Data,
  selected_vehicle,
  refreshData
}) => {
  const [onCrossToggle, setOnCrossToggle] = useState(true);

  const handleCrossToggle = () => {
    setVerifyVisibleCard(false); // Close the card when cross icon is clicked
  };

  // const handleVerifyAgain = () => {
  //   console.log('Verify Again button clicked!');
  //   // Add your "Verify Again" logic here
  // };

  if (!verifyVisibleCard) return null; // If toggled off, don't render anything
  const [uploadedImages, setUploadedImages] = useState({}); // Object to store images for each doc
  const handleImagePick = (docId, image) => {
    setUploadedImages(prev => ({
      ...prev,
      [docId]: image, // Update the image for the specific doc
    }));
  };
  // console.log("uploadedImages",uploadedImages);
  const handleVerifyAgain = () => {
    const outputData = Object.keys(uploadedImages).map(key => ({
      id: parseInt(key, 10), // Convert the key to an integer for id
      img_src: uploadedImages[key].base64, // Use the base64 data as img_src
      img_name: uploadedImages[key].uri.split('/').pop(), // Extract the file name from the URI
    }));
    const param = {
      vehicle_id: selected_vehicle?.id,
      vehicle_docs: outputData,
    };

    hitUpdateDocsApi(param)
      .then(res => {
       if(res?.status){
        handleCrossToggle()
        refreshData()
       }
      })
      .catch(err => {
        console.error(err);
      });
  };
  return (
    <View style={styles.container}>
      {/* Cross Icon */}
      <TouchableOpacity
        onPress={handleCrossToggle}
        style={styles.crossIconContainer}>
        <Image source={AppImages.crossIcon} style={styles.crossIcon} />
      </TouchableOpacity>

      {/* Main Card */}
      <View style={styles.UserDetailMainContainer}>
        <Text style={styles.cardTitle}>
          {selected_vehicle?.vehicle_number},{' '}
          {selected_vehicle?.driver?.driver_name || ''}
        </Text>
        <Text style={styles.cardTitle}>Update the following Document</Text>
        <Line marginH={18} />
        <View style={{backgroundColor: Colors.homeBackground}}>
          <View style={styles.statusDetail}>
            <Text style={styles.statusText}>
              There were some issues with the following document. Please
              re-upload the documents to verify again.
            </Text>
          </View>
          {/* {reject_Data?.map(item => (
            <>
              <View key={item?.id} style={styles.adressContainer}>
                <ImagePickerComponent
                  labelText={item?.doc_name}
                  uploaded={uploadedImages[item?.id]} // Pass the uploaded image for this doc
                  onImagePick={image => handleImagePick(item?.id, image)} // Update state with the picked image
                  useCamera={false}
                />
              </View>
            </>
          ))} */}
          {reject_Data?.map(item => {
            return (
              <>
                <View key={item?.id} style={styles.adressContainer}>
                  <ImagePickerComponent
                    labelText={item?.doc_name}
                    uploaded={uploadedImages[item?.id]} // Pass the uploaded image for this doc
                    onImagePick={image => handleImagePick(item?.id, image)} // Update state with the picked image
                    useCamera={false}
                  />
                </View>
              </>
            );
          })}
        </View>

        {/* Verify Again Button */}
        <View style={{backgroundColor: 'white'}}>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyAgain}>
            <Text style={styles.verifyButtonText}>Verify Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  crossIconContainer: {
    backgroundColor: Colors.white,
    alignSelf: 'center',
    position: 'absolute',
    top: -responsiveHeight(35),
    padding: 8,
    borderRadius: responsiveHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  crossIcon: {
    width: responsiveWidth(16),
    height: responsiveHeight(16),
  },
  UserDetailMainContainer: {
    backgroundColor: Colors.white,
    elevation: 5,
    padding: responsiveHeight(10),
    borderTopLeftRadius: responsiveHeight(20), // Rounded corner for the top-left
    borderTopRightRadius: responsiveHeight(20), // Rounded corner for the top-right
    marginTop: responsiveHeight(20),
    elevation: 0.6,
  },
  vehcileNumber: {
    fontSize: responsiveFontSize(12),
    // fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    // padding: responsiveHeight(8),
  },
  cardTitle: {
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    padding: responsiveHeight(8),
  },
  statusDetail: {
    marginTop: responsiveHeight(12),
    paddingHorizontal: responsiveHeight(18),
  },
  statusText: {
    color: Colors.black,
    fontSize: responsiveFontSize(12),
    fontWeight: '700',
    textAlign: 'center',
  },
  adressContainer: {
    marginTop: responsiveHeight(12),
    paddingHorizontal: responsiveHeight(15),
  },
  verifyButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.homeBackground,
    paddingVertical: responsiveHeight(16),
    paddingHorizontal: responsiveWidth(18),
    borderRadius: responsiveHeight(5),
    marginTop: responsiveHeight(10),
  },
  verifyButtonText: {
    fontSize: responsiveFontSize(12),
    color: Colors.grey,
    fontWeight: 'bold',
  },
});

export default VehicleVerificationCard;
