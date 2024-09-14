// VehicleCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';

const VehicleCard = ({ vehicle, onPress }) => {  
     const navigation= useNavigation()
    
    const hasDriver = vehicle?.driver?.driver_name;
    const formatVehicleNumber = (number) => {
        // Add hyphens and ensure the result is in uppercase
        return number
            .toUpperCase()
            .replace(/([A-Z\d]{2})([A-Z\d]{2})([A-Z\d]{2})(\d{4})$/, '$1-$2-$3-$4');
    };
    

    return (
        <TouchableWithoutFeedback onPress={()=>navigation.navigate('Dashboards')} >
        <View style={styles.card}>
            <View style={styles.topSection}>
                <View style={styles.leftSection}>
                <Text
                style={styles.vehicleNumber}    
                onPress={() => onPress(vehicle?.id)}
            >
                {formatVehicleNumber(vehicle?.vehicle_number) || 'N/A'}
            </Text>
                    <View style={styles.contactContainer}>
                        <Text style={styles.name}>
                            {hasDriver ? `${vehicle?.driver?.driver_name},` : 'No Driver Assigned'}
                        </Text>
                        <Text style={styles.contact}>
                            {vehicle?.driver?.phone || 'N/A'}
                        </Text>
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.status}>Verifying</Text>
                </View>
            </View>
            {hasDriver && (
                <View style={styles.bottomSection}>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Partner training pending</Text>
                    </TouchableOpacity>
                    <Image
                        source={require('../../assets/images/coach.png')}
                        style={styles.image}
                    />
                </View>
            )}
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        padding: 16,
        borderRadius: 5,
        borderWidth: 0.2,
        // shadowColor: '#000',
        marginTop: 10,
        backgroundColor:"white"
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        // backgroundColor:'aqua'
    },
    leftSection: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    vehicleNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        color: '#777777',
        marginTop: 4,
    },
    contact: {
        fontSize: 16,
        color: '#777777',
        marginTop: 4,
    },
    rightSection: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        // padding: 5,
        backgroundColor: '#FFA500',
        // height: 24,
        // marginTop: 5,
        marginVertical:10,
        paddingHorizontal:8
    },
    status: {
        fontSize: 12,
        // fontWeight: '400',
        color: 'white',
        textAlign:"center",
    
    },
    bottomSection: {
        position: 'absolute', // Absolute positioning
        bottom: 0, // Aligns to the bottom of the card
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.brandBlue, // Optional: background color for bottomSection
        paddingHorizontal: 16, // Optional: horizontal padding for content
        paddingVertical: 10,
        borderRadius: 5,
        borderBottomWidth: 0.2, // Optional: vertical padding for content
    },
    linkText: {
        fontSize: 14,
        color: '#FFFFFF', // Link color
        textDecorationLine: 'underline', // Underline text to look like a link
    },
    image: {
        width: 20, // Adjust size as needed
        height: 20,
    },
});

export default VehicleCard;
