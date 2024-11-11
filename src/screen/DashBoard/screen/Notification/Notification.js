import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Swipeable} from 'react-native-gesture-handler';
import AppImages from '../../../../common/AppImages';
import Colors from '../../../../common/Colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import {Fonts, FontSizes, Spacing} from '../../../../common/Theme';
import {
  hitDeleteNotificationApi,
  hitGetNotification,
} from '../../../../config/api/api';
import Loading from '../../../../components/Loading/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {successToast, timeAgo} from '../../../../common/CommonFunction';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import {useNavigation} from '@react-navigation/native';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      description: 'Hello this message from Parsal you have  woi the 500 coin ',
      id: 3232,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    setLoading(true);
    const fetchNotification = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const response = await hitGetNotification({
          user_id: parsedUser?.payload?.driver_id,
          user_type: 2,
        });
        const formattedNotifications = response.notifications.map(item => ({
          id: item.id.toString(),
          title: 'Parsal',
          description: item.message,
          timestamp: new Date(item.date_time),
          read: false,
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.log('Notification Error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, []);

  const toggleReadStatus = id => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? {...notification, read: !notification.read}
          : notification,
      ),
    );
  };

  const deleteNotification = async id => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id),
    );
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const param = {
      user_id: parsedUser?.payload?.driver_id,
      notification_ids: [id],
    };
    hitDeleteNotificationApi(param)
      .then(res => {
        console.log('res', res);
        if (res) {
          successToast('Sucessfully  Deleted!!');
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const renderRightActions = id => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteNotification(id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );
  const handleToggleDescription = id => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const renderNotificationItem = ({item}) => {
    // Log the item

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          style={[styles.notificationItem, {backgroundColor: Colors.white}]}
          onPress={() => toggleReadStatus(item.id)}>
          <View style={styles.notificationContent}>
            {/* Title */}
            {/* <Text style={styles.title}>{item.title}</Text> */}

            {/* Description */}
            <TouchableOpacity onPress={() => handleToggleDescription(item.id)}>
              <Text
                style={styles.description}
                numberOfLines={expandedItemId === item.id ? undefined : 1}
                ellipsizeMode="tail">
                {item.description}
              </Text>
            </TouchableOpacity>

            {/* Timestamp */}
            <Text style={styles.timestamp}>
              {timeAgo(new Date(item.timestamp))}
            </Text>
          </View>
          {/* Status Icon */}
          {/* <Image
                source={item.read ? AppImages.readIcon : AppImages.unreadIcon}
                style={styles.statusIcon}
              /> */}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackButton
        headerText={'Notification'}
        onPress={() => {
          navigation.goBack('');
        }}
      />
      {loading ? (
        <Loading loading={true} />
      ) : (
        <>
          {notifications?.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={item => item.id.toString()}
              renderItem={renderNotificationItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>You have no notifications</Text>
              }
            />
          ) : (
            <View style={styles.centeredContainer}>
              <View
                style={{
                  backgroundColor: Colors.brandBlue,
                  padding: 20,
                  borderRadius: 40,
                  elevation: 5,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                }}>
                <Image
                  source={AppImages.notificationIcon}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(30),
                    height: responsiveHeight(30),
                  }}
                  tintColor={Colors.white}
                />
              </View>
              <Text style={styles.emptyText}>You have no notification</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    marginBottom: responsiveHeight(12),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationContent: {
    flex: 1,
    marginRight: responsiveWidth(16),
  },
  title: {
    fontSize: FontSizes.semiLarge,
    fontWeight: 'bold',
    color: Colors.black,
  },
  description: {
    fontSize: FontSizes.medium,
    color: Colors.grey,
    marginTop: 4,
  },
  timestamp: {
    fontSize: responsiveFontSize(12),
    color: Colors.black,
    marginTop: Spacing.small,
    textAlign: 'right',
  },
  statusIcon: {
    width: responsiveWidth(24),
    height: responsiveHeight(24),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FontSizes.xlarge,
    color: Colors.black,
    fontWeight: Fonts.medium,
    marginTop: responsiveHeight(12),
  },
  deleteButton: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '30%',
    // borderRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: responsiveHeight(12),
  },
  deleteText: {
    color: Colors.white,
    fontWeight: Fonts.bold,
    fontSize: FontSizes.semiLarge,
    marginRight: Spacing.small,
  },
});

export default Notification;
