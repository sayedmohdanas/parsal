import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import Colors from '../../../common/Colors';
import { socketUrl } from '../../../config/url';
import CustomHeader from '../components/CustomHeader';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';
import { Fonts, FontSizes } from '../../../common/Theme';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  const [socket, setSocket] = useState(null);

  const quickResponses = [
    "Hello sir",
    "I'm arriving in five minutes.",
    "I'm arriving in five minutes.",

    "Please come fast.",
    "I'm on the way.",
    "I'm arrived at your location.",
    "I'm unable to connect you."
  ];



  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.emit('registerUser', {
      userId: orderData?.newOrder?.driver_id,
      role: 'driver',
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('connect_error', error => {
      console.error('Connection error:', error);
    });

    newSocket.on('receive_message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
    console.log('orderdata=================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', orderData)
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log('Socket disconnected');
      }
    };

  }, []);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage = {
        text: messageText,
        sender: 'driver',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageText('');

      socket.emit('send_message', newMessage);
    }
  };

  const handleQuickResponse = (response) => {
    setMessageText(response);
    handleSend();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'driver' ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <CustomHeader screenName={"Chat"} />
      <View style={styles.quickResponsesContainer}>
        {quickResponses.map((response, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickResponseButton}
            onPress={() => handleQuickResponse(response)}
          >
            <Text style={styles.quickResponseText}>{response}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      // inverted
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
    flexWrap: 'wrap'
  },
  quickResponseButton: {
    padding: 9,
    paddingHorizontal: responsiveWidth(10),
    width: '49%',
    height: responsiveHeight(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: responsiveWidth(3),
    // flex:1,
    borderRadius: 10,
    backgroundColor: Colors.brandBlue, // Replace with your app's primary color
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
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
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
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandBlue, // Replace with your app's primary color
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default ChatScreen;
