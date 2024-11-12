



import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../../common/Colors';
// import { hitAddTicketReply, hitGetTicketReply } from '../../config/api/api';
import HeaderBackButton from '../../../../components/HeaderBackButton/HeaderBackButton';
import { useNavigation } from '@react-navigation/native';
// import { responsiveHeight, responsiveWidth } from '../../common/metrices';
import { hitAddTicketReply, hitGetTicketReply } from '../../../../config/api/api';
import { responsiveHeight, responsiveWidth } from '../../../../common/metrices';
const HelpAndSupportChat = ({ route }) => {
  const navigation = useNavigation()
  const [messages, setMessages] = useState([]);
  const details = route.params;
  const [messageText, setMessageText] = useState('');
  //   const orderData = useSelector(state => state?.parsalPartner?.orderData || {});
  useEffect(() => {
    fetchMessages();
  }, []);
  const fetchMessages = async () => {
    try {
      const response = await hitGetTicketReply({ ticket_id: details?.data?.id });
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
        const response = await hitAddTicketReply(newMessage);
        if (response) {
          fetchMessages();
        }
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.by_whom === 2 ? styles.sentMessage : styles.receivedMessage,
      ]}>
      <Text style={styles.messageText}>{item?.description}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      <HeaderBackButton headerText="Help & Support" onPress={() => navigation.goBack()} />
      <View style={styles.quickResponsesContainer}>
        {/* <View>
          <Text style={styles.topicText}>{details?.data?.topic}</Text>
          <Text style={styles.descriptionText}>{details?.data?.description}</Text>
        </View> */}
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