import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Line from '../../../../components/Line/Line';
import Colors from '../../../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import { hitGetOrderDetails } from '../../../../config/api/api';
import CustomHeader from '../../components/CustomHeader';
import Loading from '../../../../components/Loading/Loading';
import AppImages from '../../../../common/AppImages';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Fonts, FontSizes } from '../../../../common/Theme';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import { formatDate } from '../../../../common/CommonFunction';
const OrderInfo = ({ route }) => {
  const GOOGLE_API_KEY = 'AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48';
  const navigation = useNavigation();
  const order_info = route.params?.id;
  const order_id = order_info;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state added
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await hitGetOrderDetails({ order_id });
        if (response.status == 1) {
          setOrderDetails(response?.orderDetails);
        } else {
          setOrderDetails(null); // Handle case for no data
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchData();
  }, [navigation]);
  const region = {
    latitude: 26.85, 
    longitude: 80.9462, 
    latitudeDelta: 0.009, 
    longitudeDelta: 0.009,
  };
  const origin = {
    latitude: orderDetails?.pickup_lat
      ? Number(orderDetails?.pickup_lat)
      : 26.8535, // Aminabad Latitude
    longitude: orderDetails?.pickup_long
      ? Number(orderDetails?.pickup_long)
      : 80.9462, // Aminabad Longitude
  };

  const destination = {
    latitude: orderDetails?.drop_lat ? Number(orderDetails?.drop_lat) : 26.85, // Hazratganj Latitude
    longitude: orderDetails?.drop_long
      ? Number(orderDetails?.drop_long)
      : 80.9462, // Hazratganj Longitude
  };
  let orderStatusText = '';
  let orderStatusColor = '';
  if (orderDetails?.order_status === 3) {
    orderStatusText = 'Delivered';
    orderStatusColor = '#567D40';
  } else if (orderDetails?.order_status === 5) {
    orderStatusText = 'Cancelled';
    orderStatusColor = '#7D4040';
  } else if (orderDetails?.order_status === 0) {
    orderStatusText = 'Pending';
    orderStatusColor = '#40437D';
  }
  const mapRef = useRef(null);
  useEffect(() => {
    // Calculate the region to fit both markers
    const fitToMarkers = () => {
      const latitudes = [origin.latitude, destination.latitude];
      const longitudes = [origin.longitude, destination.longitude];

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const midPoint = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
      };

      // Calculate the appropriate span, with added padding
      const latSpan = maxLat - minLat + 0.02; // Increased padding
      const lngSpan = maxLng - minLng + 0.02; // Increased padding

      // Animate the map to the region
      mapRef.current.animateToRegion(
        {
          latitude: midPoint.latitude,
          longitude: midPoint.longitude,
          latitudeDelta: latSpan,
          longitudeDelta: lngSpan,
        },
        1000, // Animation duration in milliseconds
      );
    };

    fitToMarkers();
  }, [orderDetails]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading loading={loading} />
      <View style={[styles.section1]}>
        {/* <CustomHeader
          screenName={'Order Information'}
          leftimage={AppImages.previous}
          onPress={() => {
            navigation.goBack('');
          }}
        /> */}
        <HeaderBackButton
          headerText={'Order Details'}
          onPress={() => navigation.goBack('')}
        />
        <MapView
          ref={mapRef} // Assign the reference to the MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: origin?.latitude,
            longitude: origin?.longitude,
            latitudeDelta: 0.1, // Initial zoom level
            longitudeDelta: 0.1,
          }}
          zoomEnabled={true}
          scrollEnabled={true} // Enable scrolling
        >
          <Polyline
            coordinates={[
              { latitude: origin?.latitude, longitude: origin?.longitude }, // Aminabad
              {
                latitude: destination?.latitude,
                longitude: destination?.longitude,
              }, // Hazratganj
            ]}
            strokeColor={Colors.black} 
            strokeWidth={4} // Customize line width
            lineDashPattern={[10, 5]} // Creates a dotted line (10px dash, 5px gap)
          />
          <Marker coordinate={origin} title="Pick-up Location">
            <Image
              source={AppImages.Bike}
              resizeMode="contain"
              style={{ height: responsiveHeight(35), width: responsiveWidth(35) }}
            />
          </Marker>
          <Marker coordinate={destination} title="Drop-off Location">
            <Image
              source={AppImages.location}
              resizeMode="contain"
              style={{ height: responsiveHeight(20), width: responsiveWidth(20) }}
            />
          </Marker>
        </MapView>
      </View>
      <View style={[styles.section2]}>
        {orderDetails ? (
          <>
            <View style={[styles.dateContainer]}>
              <View>
                <Text style={{ color: 'black', fontWeight: '700', fontSize: responsiveFontSize(16) }}>{`# ${order_id}`}</Text>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Colors.grey, fontWeight: '500' }}>{formatDate(orderDetails?.order_date)}</Text>

                  {/* <Text
                    style={{
                      color: orderStatusColor,
                      marginLeft: responsiveWidth(10),
                    }}>
                    {orderStatusText}
                  </Text> */}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{

                    color: 'black',
                    fontSize: FontSizes.semiLarge,
                    fontWeight: Fonts.medium,


                  }}>
                  {`₹ ${(
                    parseFloat(
                      orderDetails.transactions?.find(
                        t => t.pay_head_name === 'TotalFare',
                      )?.amount,
                    ) || 0
                  ).toFixed(2)}`}
                </Text>
                <Text
                  style={{
                    color: orderStatusColor,
                    marginLeft: responsiveWidth(10),
                  }}>
                  {orderStatusText}
                </Text>
              </View>
            </View>
            <Line marginH={16} />
            <View style={[styles.selectionPicDrop]}>
              <View style={[styles.timelineContainer]}>
                <View style={styles.greenCircle}></View>
                <View style={styles.line}></View>
                <View
                  style={{
                    height: responsiveHeight(10),
                    width: responsiveHeight(10),
                    borderWidth: 0.5,
                    borderColor: 'grey',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.redCircle}></View>
                </View>
              </View>
              <View style={[styles.textInputContainers]}>
                <View style={styles.pickUpStyle}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      color: Colors.black,
                      fontSize: responsiveFontSize(14),
                      marginLeft: responsiveWidth(10),
                    }}>
                    {orderDetails.pickup_address}
                  </Text>
                </View>
                <View style={styles.pickUpStyle}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      color: Colors.black,
                      fontSize: responsiveFontSize(14),
                      marginLeft: responsiveWidth(10),
                    }}>
                    {orderDetails?.drop_address}
                  </Text>
                </View>
              </View>
            </View>
            <Line marginH={16} />
            <View style={[styles.dateContainer]}>
              <FlatList
                data={orderDetails?.transactions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View>
                    {index === orderDetails.transactions.length - 1 && (
                      <Line marginH={0} />
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ color: 'black', fontWeight: '600' }}>
                        {item.pay_head_name}
                      </Text>
                      <Text style={{ color: 'black' }}>
                        {` ${parseFloat(item.amount, 10).toFixed(2)}`}
                      </Text>
                    </View>
                  </View>
                )}
              />

            </View>
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={AppImages.emptyImage}
              style={styles.emptyboxStyle}
              resizeMode="contain"
            />
            <Text>No data available for this order ID</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default OrderInfo;
const styles = StyleSheet.create({
  section1: {
    flex: 1,
    backgroundColor: Colors.buttonGrey,
  },
  section2: {
    flex: 1.5,
    backgroundColor: 'white',
    elevation: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(10),
  },
  selectionPicDrop: {
    height: responsiveHeight(130),
    marginHorizontal: responsiveWidth(16),
    flexDirection: 'row',
  },
  timelineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainers: {
    flex: 9,
  },
  greenCircle: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    backgroundColor: Colors.brandBlue,
    borderRadius: responsiveHeight(20),
  },
  redCircle: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    backgroundColor: 'black',
    borderRadius: responsiveHeight(20),
  },
  line: {
    borderLeftWidth: 1,
    height: responsiveHeight(50),
    marginVertical: responsiveHeight(1),
  },
  locationMapContainer: {
    backgroundColor: Colors.brandBlue,
    height: responsiveHeight(600),
    marginTop: responsiveHeight(30),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectionPicDropContainer: {
    backgroundColor: 'red',
    marginBottom: responsiveHeight(20),
    borderBottomLeftRadius: responsiveHeight(10),
    borderBottomRightRadius: responsiveHeight(10),
    backgroundColor: Colors.white,
    paddingBottom: responsiveHeight(25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickUpStyle: {
    height: responsiveHeight(50),
    marginTop: responsiveHeight(10),
    justifyContent: 'center',
  },
  emptyboxStyle: {
    height: responsiveHeight(169),
    width: responsiveWidth(169),
  },
});
