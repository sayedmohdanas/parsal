// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Dimensions,
//   RefreshControl,
// } from 'react-native';
// import Colors from '../../../../common/Colors';
// import {Fonts, FontSizes, Spacing} from '../../../../common/Theme';
// import Line from '../../../../components/Line/Line';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../../common/metrices';
// import {hitAddTicketReply, hitGetTicketReply} from '../../../../config/api/api';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';

// const HelpAndSupportChat = ({route}) => {
//   const [messages, setMessages] = useState([]);
//   const details = route.params;
//   const [messageText, setMessageText] = useState('');
//   const navigation = useNavigation();
//   // Fetch messages from the server
//   useFocusEffect(
//     useCallback(() => {
//       fetchMessages();
//     }, []),
//   );
//   const [refreshing, setrefreshing] = useState(false);
//   const fetchMessages = async () => {
//     try {
//       setrefreshing(true);
//       const response = await hitGetTicketReply({ticket_id: details?.data?.id});
//       setrefreshing(false);
//       setMessages(response?.messages);
//     } catch (error) {
//       setMessages([]);
//       setrefreshing(false);
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const handleSend = async () => {
//     if (messageText.trim()) {
//       const newMessage = {
//         ticket_id: details?.data?.id,
//         description: messageText,
//         by_whom: 2,
//         status: 1,
//       };
//       try {
//         // await axios.post(`${API_URL}/send`, newMessage);
//         const response = await hitAddTicketReply(newMessage);
//         if (response) {
//           fetchMessages();
//         }
//         setMessageText('');
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   const renderItem = ({item}) => (
//     <View
//       style={[
//         styles.messageContainer,
//         item.by_whom === 2 ? styles.sentMessage : styles.receivedMessage,
//       ]}>
//       <Text style={styles.messageText}>{item?.description}</Text>
//       <Text style={styles.timestamp}>
//         {new Date(item.date_time).toLocaleTimeString()}
//       </Text>
//     </View>
//   );
//   const statusInfo = {
//     text: details?.data?.status === 1 ? 'Open' : 'Closed',
//     textColor: details?.data?.status === 1 ? '#567D40' : '#7D4040',
//     backgroundColor: details?.data?.status === 1 ? '#E5F6E6' : '#F6E5E5',
//   };
//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <HeaderBackButton
//         headerText={'Ticket Replies'}
//         onPress={() => navigation.goBack('')}
//       />
//       <View style={styles.quickResponsesContainer}>
//         <View>
//           <Text
//             style={{
//               color: Colors.black,
//               fontSize: FontSizes.large,
//               fontWeight: Fonts.bold,
//               marginTop: Spacing.small,
//             }}>
//             {details?.data?.topic}
//           </Text>
//           <Text
//             style={{
//               color: Colors.grey,
//               fontSize: FontSizes.small,
//               fontWeight: Fonts.regular,
//               marginTop: Spacing.small,
//             }}>
//             {details?.data?.description}
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             width: '100%',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               backgroundColor: statusInfo?.backgroundColor,
//               paddingHorizontal: responsiveWidth(8),
//               borderRadius: responsiveWidth(20),
//               marginTop: responsiveHeight(12),
//             }}>
//             <Text
//               style={{
//                 color: statusInfo.textColor,
//                 fontWeight: Fonts.medium,
//                 fontSize: responsiveFontSize(12),
//               }}>
//               {statusInfo?.text}
//             </Text>
//           </View>
//           <Text
//             style={{
//               color: Colors.grey,
//               fontWeight: Fonts.bold,
//               marginTop: Spacing.medium,
//               fontSize: responsiveFontSize(10),
//             }}>
//             {new Date(details?.data?.createdAt).toLocaleString(undefined, {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               year: 'numeric',
//               month: '2-digit',
//               day: '2-digit',
//             })}
//           </Text>
//         </View>
//       </View>
//       <Line marginH={0} />
//       <FlatList
//         refreshControl={
//           <RefreshControl onRefresh={fetchMessages} refreshing={refreshing} />
//         }
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={styles.messageList}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message"
//           placeholderTextColor="#888"
//           value={messageText}
//           onChangeText={setMessageText}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   quickResponsesContainer: {
//     padding: 10,
//     backgroundColor: Colors.white,

//     alignItems: 'center',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   quickResponseButton: {
//     padding: 9,
//     paddingHorizontal: responsiveWidth(10),
//     width: '49%',
//     height: responsiveHeight(50),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: responsiveWidth(3),
//     borderRadius: 10,
//     backgroundColor: Colors.brandBlue,
//     marginBottom: 5,
//   },
//   quickResponseText: {
//     color: Colors.white,
//     fontSize: FontSizes.small,
//     fontWeight: Fonts.medium,
//     textAlign: 'center',
//   },
//   messageList: {
//     paddingHorizontal: 10,
//     paddingTop: 10,
//   },
//   messageContainer: {
//     marginVertical: 5,
//     padding: 10,
//     borderRadius: 10,
//     width: responsiveWidth(Dimensions.get('window').width) / 1.4,
//   },
//   sentMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   receivedMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#EAEAEA',
//   },
//   messageText: {
//     fontSize: 16,
//     color: Colors.black,
//   },
//   timestamp: {
//     fontSize: responsiveFontSize(10),
//     color: '#888',
//     alignSelf: 'flex-end',
//     marginTop: 0,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: Colors.white,
//   },
//   input: {
//     flex: 1,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginRight: 10,
//     backgroundColor: '#f9f9f9',
//     color: Colors.black,
//   },
//   sendButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.brandBlue,
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   sendButtonText: {
//     color: Colors.white,
//     fontSize: 16,
//   },
// });

// export default HelpAndSupportChat;
import React, {useState, useEffect, useCallback, useRef} from 'react';
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
      setRefreshing(false);
      console.log('Error fetching messages:', error);
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
      <HeaderBackButton
        headerText={'Ticket Replies'}
        onPress={() => navigation.goBack('')}
      />
      <View style={styles.quickResponsesContainer}>
        <View>
          <Text
            style={{
              color: Colors.black,
              fontSize: FontSizes.large,
              fontWeight: Fonts.bold,
              marginTop: Spacing.small,
            }}>
            {details?.data?.topic}
          </Text>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: statusInfo?.backgroundColor,
              paddingHorizontal: responsiveWidth(8),
              borderRadius: responsiveWidth(20),
              marginTop: responsiveHeight(12),
            }}>
            <Text
              style={{
                color: statusInfo.textColor,
                fontWeight: Fonts.medium,
                fontSize: responsiveFontSize(12),
              }}>
              {statusInfo?.text}
            </Text>
          </View>
          <Text
            style={{
              color: Colors.grey,
              fontWeight: Fonts.bold,
              marginTop: Spacing.medium,
              fontSize: responsiveFontSize(10),
            }}>
            {formatDate(details?.data?.createdAt)}
          </Text>
        </View>
      </View>
      <Line marginH={0} />
      {isScrollingUp && visibleDate && (
        <View style={styles.dateLabelContainer}>
          <Text style={styles.dateLabel}>{visibleDate}</Text>
        </View>
      )}
      <FlatList
        refreshControl={
          <RefreshControl onRefresh={fetchMessages} refreshing={refreshing} />
        }
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
          <Text style={styles.sendButtonText}>Send</Text>
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
  },
  messageList: {
    paddingHorizontal: responsiveWidth(10),
    paddingTop: responsiveHeight(10),
  },
  messageContainer: {
    marginVertical: responsiveHeight(5),
    padding: 10,
    borderRadius: responsiveHeight(10),
  },
  sentMessage: {alignSelf: 'flex-end', backgroundColor: '#DCF8C6'},
  receivedMessage: {alignSelf: 'flex-start', backgroundColor: '#EAEAEA'},
  messageText: {fontSize: FontSizes.semiLarge, color: Colors.black},
  timestamp: {
    fontSize: responsiveFontSize(10),
    color: Colors.grey,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F1F1F1',
    color: Colors.black,
  },
  sendButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.brandBlue,
    borderRadius: 20,
    marginLeft:5
  },
  sendButtonText: {color: '#fff', fontWeight: Fonts.bold},
  dateLabelContainer: {
    position: 'absolute',
    top: 210,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 5,
    alignItems: 'center',
    // borderBottomWidth: 1,
    alignSelf: 'center',
    borderBottomColor: Colors.grey,
  },
  dateLabel: {
    fontSize: FontSizes.medium,
    color: Colors.black,
    fontWeight: Fonts.medium,
  },
});
export default HelpAndSupportChat;
