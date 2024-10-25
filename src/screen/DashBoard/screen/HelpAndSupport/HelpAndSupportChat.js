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
import axios from 'axios';
import { useSelector } from 'react-redux';
import Colors from '../../../../common/Colors';
import CustomHeader from '../../components/CustomHeader';
import { Fonts, FontSizes, Spacing } from '../../../../common/Theme';
import Line from '../../../../components/Line/Line';
import { responsiveHeight, responsiveWidth } from '../../../../common/metrices';
import { hitAddTicket, hitAddTicketReply, hitGetTicketReply } from '../../../../config/api/api';

// const API_URL = 'http://localhost:3000/api';

const HelpAndSupportChat = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const orderData = useSelector(state => state?.parsalPartner?.orderData || {});

    // Fetch messages from the server
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            // const response = await axios.get(`${API_URL}/messages`);

           const response= await  hitGetTicketReply({ ticket_id: 2,})
           console.log('response-from-get-message======>>>>',response)
        //    setMessages(prevMessages => [...prevMessages, response?.message]);
           setMessages(response?.messages);

            // setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        if (messageText.trim()) {
            const newMessage = {
                ticket_id: 2,
                description: messageText,
                by_whom: 2,
                status: 1
            };
            try {
                // await axios.post(`${API_URL}/send`, newMessage);
                const response =await hitAddTicketReply(newMessage)
                if(response){
                    fetchMessages()
                }

                // setMessages(prevMessages => [...prevMessages, newMessage]);
                setMessageText('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.by_whom === 2 ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item?.description}</Text>
            <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.quickResponsesContainer}>
                <View>
                    <Text style={{ color: Colors.black, fontSize: FontSizes.semiLarge, fontWeight: Fonts.bold, marginTop: Spacing.small }}>
                        Item is missing in Package
                    </Text>
                    <Text style={{ color: Colors.black, fontSize: FontSizes.small, fontWeight: Fonts.regular, marginTop: Spacing.small }}>
                        It appears that one or more items are missing from the delivered package. Please check the inventory list carefully to identify any missing products.
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '100%', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: Colors.black, fontWeight: Fonts.medium, marginTop: Spacing.medium }}>Open</Text>
                    </View>
                    <Text style={{ color: Colors.grey, fontWeight: Fonts.bold, marginTop: Spacing.medium, fontSize: FontSizes.xsmall }}>
                        {new Date().toLocaleString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })}
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

