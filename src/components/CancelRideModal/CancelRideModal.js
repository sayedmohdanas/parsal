import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { Button, Modal, Portal, RadioButton, Provider as PaperProvider, Text } from 'react-native-paper';
import { responsiveFontSize } from '../../common/metrices';
import Colors from '../../common/Colors';



const CancelRideModal = ({ visible, hideModal, selectedReason, setSelectedReason, handleCancelOrder }) => {
    const [otherReason, setOtherReason] = useState('');
    // console.log('other------reson===>>>>',otherReason)
    // Alert.alert(otherReason)

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                <Text variant="titleLarge" style={styles.title}>
                    Why are you cancelling the ride?
                </Text>
                <RadioButton.Group
                    onValueChange={(value) => {
                        setSelectedReason(value);
                        if (value !== 'Other reason') setOtherReason('');
                    }}
                    value={selectedReason}
                >
                    {[
                        "Customer is not showing up",
                        "Customer requested cancellation",
                        "Ride distance is too far",
                        "Emergency situation",
                        "Other reason"
                    ].map((reason) => (
                        <Pressable 
                            key={reason} 
                            style={styles.radioItem} 
                            onPress={() => setSelectedReason(reason)}
                        >
                            <RadioButton value={reason} />
                            <Text style={styles.radioLabel}>{reason}</Text>
                        </Pressable>
                    ))}
                </RadioButton.Group>

                {!selectedReason === 'Other reason' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter reason..."
                        value={otherReason}
                        onChangeText={setSelectedReason}
                    />
                )}

                <View style={styles.buttonRow}>
                    <Button textColor={Colors.brandBlue} onPress={hideModal}>Cancel</Button>
                    <Button
                        mode="contained"
                        style={{ backgroundColor: Colors.brandBlue }}
                        textColor="white"
                        onPress={() => handleCancelOrder()}
                        disabled={!selectedReason || (selectedReason === 'Other reason' && !otherReason)}
                    >
                        Ok
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: responsiveFontSize(18),
        color:Colors.brandBlue,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioLabel: {
        fontSize: 16,
        color: 'black',
    },
    input: {
        borderWidth: 1,
        color:'black',
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,

    },
});

export default CancelRideModal;
