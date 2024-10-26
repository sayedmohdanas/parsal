import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import Colors from '../../../../common/Colors';
import {Fonts, FontSizes, Spacing} from '../../../../common/Theme';
import Line from '../../../../components/Line/Line';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../common/metrices';
import {hitAddTicketReply, hitGetTicketReply} from '../../../../config/api/api';

// const API_URL = 'http://localhost:3000/api';

const HelpAndSupportChat = ({route}) => {
  const [messages, setMessages] = useState([]);
  const details = route.params;
  const [messageText, setMessageText] = useState('');
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});

  // Fetch messages from the server
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await hitGetTicketReply({ticket_id: details?.data?.id});
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
      };
      try {
        // await axios.post(`${API_URL}/send`, newMessage);
        const response = await hitAddTicketReply(newMessage);
        if (response) {
          fetchMessages();
        }

        // setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.by_whom === 2 ? styles.sentMessage : styles.receivedMessage,
      ]}>
      <Text style={styles.messageText}>{item?.description}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.date_time).toLocaleTimeString()}
      </Text>
    </View>
  );
  const statusInfo = {
    text: details?.data?.status === 1 ? 'Open' : 'Closed',
    textColor: details?.data?.status === 1 ? '#567D40' : '#7D4040',
    backgroundColor: details?.data?.status === 1 ? '#E5F6E6' : '#F6E5E5',
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
            {new Date(details?.data?.createdAt).toLocaleString(undefined, {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <Line marginH={0} />
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  quickResponsesContainer: {
    padding: 10,
    backgroundColor: Colors.white,

    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickResponseButton: {
    padding: 9,
    paddingHorizontal: responsiveWidth(10),
    width: '49%',
    height: responsiveHeight(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: responsiveWidth(3),
    borderRadius: 10,
    backgroundColor: Colors.brandBlue,
    marginBottom: 5,
  },
  quickResponseText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: Fonts.medium,
    textAlign: 'center',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    width: responsiveWidth(Dimensions.get('window').width) / 1.4,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
  },
  messageText: {
    fontSize: 16,
    color: Colors.black,
  },
  timestamp: {
    fontSize: responsiveFontSize(10),
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    color: Colors.black,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default HelpAndSupportChat;
