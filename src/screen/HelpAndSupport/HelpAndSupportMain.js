import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
// import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton'
import HelpAndSupportCard from './Component/HelpAndSupportCard';
import AppImages from '../../common/AppImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getItem} from '../../common/CommonFunction';
import {hitGetSupportTicket} from '../../config/api/api';
import Colors from '../../common/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const HelpAndSupportMain = ({navigation}) => {
  // const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);

  const timeAgo = date => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hr: 3600,
      min: 60,
      sec: 1,
    };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  //   useEffect(() => {
  //     const handleGetSupport = async () => {
  //       try {
  //         // const getCustomerId = await getItem('customerId')
  //         const user = await AsyncStorage.getItem('user');
  //         const parsed_user = JSON.parse(user);
  //         const request = {
  //           user_id:
  //             parsed_user?.payload?.owner_type == 1
  //               ? parsed_user?.payload?.partner_id
  //               : parsed_user?.payload?.driver_id,
  //           user_type: parsed_user?.payload?.owner_type == 1 ? 3 : 2,
  //         };
  //         hitGetSupportTicket(request)
  //           .then(res => {
  //             console.log('res',res);
  //             if (res?.success) {
  //               setTickets(res.tickets);
  //             } else {
  //               setTickets([]);
  //             }
  //           })
  //           .catch(err => {
  //             setTickets([]);
  //             console.error(err);
  //           });
  //       } catch (error) {
  //         console.error('error => ', error);
  //       }
  //     };
  //     handleGetSupport();
  //   }, []);
  useFocusEffect(
    useCallback(() => {
      const handleGetSupport = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          const parsed_user = JSON.parse(user);
          const request = {
            user_id:
              parsed_user?.payload?.owner_type == 1
                ? parsed_user?.payload?.partner_id
                : parsed_user?.payload?.driver_id,
            user_type: parsed_user?.payload?.owner_type == 1 ? 3 : 2,
          };
          hitGetSupportTicket(request)
            .then(res => {
              if (res?.success) {
                setTickets(res.tickets);
              } else {
                setTickets([]);
              }
            })
            .catch(err => {
              setTickets([]);
              console.log(err);
            });
        } catch (error) {
          console.log('error => ', error);
        }
      };

      handleGetSupport();
    }, []),
  );

  const renderItem = ({item}) => {
    return (
      <HelpAndSupportCard
        topic={item.topic}
        status={item.status}
        createdAt={timeAgo(new Date(item.createdAt))}
        description={item.description}
        onPress={() => {
          navigation.navigate('HelpChat', {
            data: item,
          });
        }}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <HeaderBackButton
        headerText="Help & Support"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Image
              source={AppImages.empty}
              style={{
                height: responsiveHeight(120),
                width: responsiveWidth(120),
              }}
              resizeMode="contain"
            />
            <Text style={[styles.emptyText, {marginTop: 20}]}>
              {
                'No support tickets found. \nPlease contact our support team for assistance.'
              }
            </Text>
          </View>
        )}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TicketSubmission')}>
          <Image
            source={AppImages.addSupport}
            resizeMode="contain"
            style={{
              height: responsiveHeight(50),
              width: responsiveWidth(50),
              padding: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpAndSupportMain;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: '50%',
  },
  emptyText: {
    fontSize: responsiveFontSize(16),
    color: Colors.grey,
    textAlign: 'center',
    paddingTop: 10,
  },
});
