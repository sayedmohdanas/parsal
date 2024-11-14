



import React, { useState, useEffect, useRef, useCallback, } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import Colors from '../../../../common/Colors';
import {Fonts, FontSizes, Spacing} from '../../../../common/Theme';
import Line from '../../../../components/Line/Line';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import {hitAddTicketReply, hitGetTicketReply} from '../../../../config/api/api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import {formatDate} from '../../../../common/CommonFunction';
import HelpAndSupportChatHeader from '../../../../components/HeaderBackButton/HelpAndSupportChatHeader';
const HelpAndSupportChat = ({route}) => {
  const [messages, setMessages] = useState([]);
  const details = route.params;
  const [messageText, setMessageText] = useState('');
  const navigation = useNavigation();
  const [visibleDate, setVisibleDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false); // Track scroll direction
  const prevScrollY = useRef(0); // Reference for previous scroll position
  // Fetch messages when the component is focused
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, []),
  );
  const formatDateLabel = date => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);
    // Return 'Today', 'Yesterday', 'Day Before Yesterday' based on the message date
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (
      messageDate.toDateString() === dayBeforeYesterday.toDateString()
    ) {
      return 'Day Before Yesterday';
    } else {
      return messageDate.toLocaleDateString(); // Default format for other dates
    }
  };
  const handleScroll = event => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    // Detect scroll direction
    if (currentScrollY < prevScrollY.current) {
      setIsScrollingUp(true); // Scrolling up
    } else {
      setIsScrollingUp(false); // Scrolling down
    }
    // Update the visible date based on the current message at the top
    const visibleIndex = Math.floor(currentScrollY / 60); // Adjust scroll offset for message height
    if (messages[visibleIndex]) {
      const formattedDate = formatDateLabel(messages[visibleIndex].date_time);
      setVisibleDate(formattedDate); // Set the visible date label based on the message's date
      console.log('Visible Date:', formattedDate); // Log the visible date to the console
    }
    prevScrollY.current = currentScrollY; // Update previous scroll position
  };
  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      const response = await hitGetTicketReply({ticket_id: details?.data?.id});
      setRefreshing(false);
      setMessages(response?.messages);
    } catch (error) {
      setMessages([]);
      console.error('Error fetching messages:', error);
    }
  };
  const handleSend = async () => {
    if (messageText.trim()) {
      const newMessage = {
        ticket_id: details?.data?.id,
        description: messageText,
        by_whom: 2,
        status: 1,
        date_time: new Date().toISOString(),
        // date_time: new Date(
        //   new Date().setDate(new Date().getDate() - 1),
        // ).toISOString(), // Adding yesterday's date-time
        // Adding current date-time for display purposes
      };
      try {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        const response = await hitAddTicketReply(newMessage);
        if (response) {
          // fetchMessages(); // Optionally, fetch the updated messages
        }
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const renderItem = ({item}) => {
    const windowWidth = Dimensions.get('window').width;
    const maxWidth = windowWidth * 0.7;
    return (
      <View
        style={[
          styles.messageContainer,
          item.by_whom === 2 ? styles.sentMessage : styles.receivedMessage,
          {
            maxWidth: maxWidth,
            minWidth: 50,
          },
        ]}>
        <Text style={styles.messageText}>{item?.description}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.date_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };
  const statusInfo = {
    text: details?.data?.status === 1 ? 'Open' : 'Closed',
    textColor: details?.data?.status === 1 ? '#567D40' : '#7D4040',
    backgroundColor: details?.data?.status === 1 ? '#E5F6E6' : '#F6E5E5',
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <HelpAndSupportChatHeader headerText="Help & Support" onPress={() => navigation.goBack()}  
ticketId= {details?.data?.id}
        />
      <View style={styles.quickResponsesContainer}>
        <View>
          {/* <Text
            style={{
              color: Colors.black,
              fontSize: FontSizes.large,
              fontWeight: Fonts.bold,
              marginTop: Spacing.small,
            }}>
            {details?.data?.topic}
          </Text> */}
          <Text
            style={{
              color: Colors.grey,
              fontSize: FontSizes.small,
              fontWeight: Fonts.regular,
              marginTop: Spacing.small,
            }}>
            {details?.data?.description}
          </Text>
        </View>
        <Line marginH={1}  />

        {/* <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo?.backgroundColor },
            ]}>
            <Text style={{ color: statusInfo.textColor }}>{statusInfo?.text}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(details?.data?.createdAt).toLocaleString(undefined, {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </Text>
        </View> */}
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onScroll={handleScroll}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#888"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {/* <Text style={styles.sendButtonText}>Send</Text> */}
          <Image source={AppImages.chatSendButton} resizeMode={'contain'}
            style={{ height: responsiveHeight(45), width: responsiveWidth(45) }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  quickResponsesContainer: {
    padding: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth:0.3,
    borderBlockColor:'#B0B0B0'
  
  },
  topicText: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  descriptionText: {
    color: Colors.grey,
    fontSize: 14,
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  dateText: {
    color: Colors.grey,
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    marginVertical: responsiveHeight(5),
    padding: 10,
    borderRadius: responsiveHeight(10),
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E0E9FF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFEFEF',
  },
  messageText: {
    fontSize: 16,
    color: Colors.black,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    // borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(8),
    marginBottom: responsiveHeight(10)
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    // marginRight: 10,
    backgroundColor: '#f9f9f9',
    color: Colors.black,
    height: responsiveHeight(47)
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.brandBlue,
    // borderRadius: 10,
    // paddingRight: 4,
    // paddingVertical: 10,
    paddingLeft: 2
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
export default HelpAndSupportChat;