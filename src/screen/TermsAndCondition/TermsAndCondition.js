import React, { useRef, useEffect, useState } from 'react';
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
import { hitReviewTermsAndCondition } from '../../config/api/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { mystyles } from '../../common/Mystyle';
import { ActivityIndicator } from 'react-native-paper';

const TermsAndCondition = ({ route }) => {
  const { width } = useWindowDimensions();
  const { id, heading } = route.params;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  const [terms, setTerms] = useState();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const fetchTerms = async () => {
      const params = { id: [id]};

      try {
        const res = await hitReviewTermsAndCondition(params);
        setTimeout(() => {
          if (res?.data?.length > 0) {
            const content = res.data[0].content; // Get the content field from the first item
            const formattedTerms = content.replace(/\n/g, ''); //

            setTerms(formattedTerms);
          } else {
            console.error('No content found in response.');
          }
          setloading(false); 
        }, 600); 
        
      } catch (err) {
        console.error('Error in terms and condition in review booking ==> ', err);
        setloading(false); // Ensure loading stops in case of error
      }
    };

    fetchTerms();
  }, [id]);

  const source = {
    html: terms,
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <HeaderBackButton headerText={heading} onPress={() => navigation.goBack()} />
        {loading ? (
          // Loading state
          <View style={mystyles.alignCenter}>
            <ActivityIndicator size="small" color={Colors.brandBlue} />
          </View>
        ) : (
          // Main content
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
            {/* Header Section */}
            <View
              style={{
                backgroundColor: 'black',
                height: responsiveHeight(160),
                alignItems: 'center',
                paddingBottom: responsiveHeight(5),
                justifyContent: 'center',
              }}
            />
    
            {/* Content Section */}
            <View style={{ flex: 2, padding: 6 }}>
              <View
                style={{
                  elevation: 20,
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: responsiveHeight(2),
                  marginTop: -responsiveHeight(140),
                  marginHorizontal: responsiveWidth(8),
                  zIndex: 1,
                }}
              >
                <RenderHTML
                  contentWidth={width}
                  source={source}
                  tagsStyles={{
                    body: { color: '#000000' },
                    p: { color: '#000000' },
                  }}
                  baseStyle={{
                    color: '#000000',
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

export default TermsAndCondition;
