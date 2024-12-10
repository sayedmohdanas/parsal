import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
} from 'react-native';
import Colors from '../../common/Colors';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Line from '../../components/Line/Line';
import BorderLine from '../../common/BorderLine.';
import DriverInformation from '../DashBoard/components/DriverInformation';

const LiveTripCustomCard = ({trip}) => {
  const [pickupHeight, setPickupHeight] = useState(0);
  const [dropHeight, setDropHeight] = useState(0);
  const [onCrossToggle,setOnCrossToggle]=useState(true)


  const handlePickupLayout = event => {
    const {height} = event.nativeEvent.layout;
    setPickupHeight(height);
  };

  const handleDropLayout = event => {
    const {height} = event.nativeEvent.layout;
    setDropHeight(height);
  };
  const handlecrossToggle =()=>{
    setOnCrossToggle(prev=>!prev)
  }

  // Calculate the length of the BorderLine based on the maximum height
  const borderLineLength = Math.max(pickupHeight, dropHeight) + 20; // Adding some padding
  return (
    <>
     {onCrossToggle &&(
   <TouchableOpacity  onPress={handlecrossToggle} style={{backgroundColor:Colors.white,alignSelf:'center',position:'absolute',top:-responsiveHeight(45),padding:8,borderRadius:responsiveHeight(20),alignItems:'center',justifyContent:'center'}}><Image source={AppImages.crossIcon}style={{width:responsiveWidth(16),height:responsiveHeight(16)}}/></TouchableOpacity>
     )}
    <View style={[styles.UserDetailMainContainer]}>
      
      <TouchableHighlight  onPress={()=>setOnCrossToggle(true)}
        underlayColor={'none'}
        >
      <DriverInformation selected_driver_data={trip} />
      </TouchableHighlight>
      {onCrossToggle &&(
        <>
      <Line marginH={18} />
      
      <View style={styles.statusDetail}>
        <Text style={styles.statusText}>Detail Status</Text>
        <Text style={styles.statusDate}>
          {new Date(trip?.order_date)?.toDateString()}
        </Text>
      </View>

      <View style={styles.adressContainer}>
        <View style={styles.markerContainer}>
          <Image
            source={AppImages.pickupIcon}
            style={styles.pickupIcon}
            resizeMode="contain"
          />
          <BorderLine orientation={'vertical'} length={borderLineLength} margin={2} />

          <Image
            source={AppImages.dropupIcon}
            style={styles.pickupIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.PickAndDropConatiner}>
          <View style={styles.pickuContainer}>
            <Text style={styles.lable}>Picked</Text>
            <Text style={styles.PickedAdressText} onLayout={handlePickupLayout}>
              {trip?.pickup_address}
            </Text>
          </View>
          <View style={styles.dropContainer}>
            <Text style={styles.lable}>Delivery</Text>
            <Text style={styles.dropAdressText} onLayout={handleDropLayout}>
              {trip?.drop_address}
            </Text>
          </View>
        </View>
      </View>
      </>
      )}
      {/* <View style={styles.itemContainer}>
        <View style={styles.itemName}>
          <Text style={styles.itemHeading}>Item :</Text>
          <Text style={styles.itemNameText}>
            {trip?.m_good?.product_category}
          </Text>
        </View>
        <View>
          <Text style={{color: 'black', fontSize: responsiveFontSize(12)}}>
            {trip?.itemWeight}
          </Text>
        </View>
      </View> */}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  UserDetailMainContainer: {
    // padding: responsiveHeight(2),
    backgroundColor: Colors.white,
    borderRadius: responsiveHeight(20),
    marginBottom: responsiveHeight(5),
    elevation:5
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(18),
    paddingHorizontal: responsiveHeight(15),
  },
  manStyle: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(6),
    marginRight: responsiveWidth(3),
  },
  userNameAddress: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  address: {
    color: Colors.grey,
    fontSize: responsiveFontSize(12),
    marginTop: responsiveHeight(0.5),
  },
  statusDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveHeight(18),
  },

  statusText: {
    color: Colors.black,
    fontSize: responsiveFontSize(12),
    fontWeight: '700',
  },
  statusDate: {
    color: '#000000',
    fontWeight: '500',
    fontSize: responsiveFontSize(10),
  },
  adressContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(12),
    paddingHorizontal: responsiveHeight(15),
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 5,
  },
  lable: {
    fontSize: responsiveFontSize(10),
    fontWeight: '600',
    lineHeight: 9.68,
    color: Colors.grey,
  },
  PickedAdressText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    lineHeight: 14.52,
    color: '#000000',
    // marginTop: responsiveHeight(2),
    // marginBottom: responsiveHeight(6)
  },
  dropContainer: {
    marginTop: responsiveHeight(15),
  },
  dropAdressText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    lineHeight: 14.52,
    color: '#000000',
    marginBottom: responsiveHeight(6),
    // marginTop: responsiveHeight(2)
  },
  itemContainer: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(12),
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveHeight(15),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  itemName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeading: {
    fontSize: responsiveFontSize(10),
    fontWeight: '700',
    lineHeight: 12.1,
    color: '#000000',
  },
  itemNameText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    lineHeight: 14.52,
    color: '#000000',
    marginLeft: responsiveHeight(4),
  },
  pickupIcon: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
  },
});

export default LiveTripCustomCard;
