import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useNavigation} from '@react-navigation/native';
import Loading from '../../components/Loading/Loading';
import {hitReviewTermsAndCondition} from '../../config/api/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
const TermsAndCondition = ({route}) => {
  const {width} = useWindowDimensions();
  const {id, heading} = route.params;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  const [terms, setTerms] = useState();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const params = {id: id};
    hitReviewTermsAndCondition(params)
      .then(res => {
        const formattedTerms = res?.data?.content?.replace(/\n/g, ''); // Removes all line breaks

        setTerms(formattedTerms);
        setloading(false);
      })
      .catch(err => {
        console.error(
          'Error in terms and condition in review booking ==>',
          err,
        );
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  const source = {
    html: terms,
  };

  // Automatically scroll to end when the component mounts
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderBackButton
        headerText={heading}
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            height: '60%',
            alignItems: 'center',
            paddingBottom: '35%',
          }}>
          {/* <Text
            style={{
              fontSize: responsiveFontSize(30),
              color: 'white',
              fontWeight: '800',
              marginTop: '10%',
            }}>
            {id == 1 ? `Terms and Conditions` : 'Privacy and Policy'}
          </Text> */}
        </View>
        <View style={{flex: 2, padding: 6}}>
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <View
              style={{
                elevation: 20,
                backgroundColor: 'white',
                padding: 8,
                marginTop: responsiveWidth(-115),
                borderRadius: 12,
                marginHorizontal: responsiveWidth(8),
              }}>
              <RenderHTML
                contentWidth={width}
                source={source}
                tagsStyles={{
                  body: {
                    color: '#000000', // Set font color to black
                  },
                  p: {
                    color: '#000000', // Ensure all paragraph text is black
                  },
                }}
                baseStyle={{
                  color: '#000000', // Set font color to black for any other elements
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndCondition;
