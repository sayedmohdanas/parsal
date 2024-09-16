import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import VehicleCard from './VehicleCard'; // Ensure the path is correct
import { getVehicle } from '../../redux/HitApis/HitApiSlice';
import Loading from '../../components/Loading/Loading';
import VehicleList from './VehicleList';
import { successToast } from '../../common/CommonFunction';
import { useFocusEffect } from '@react-navigation/native';

const MyVehiclesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const vehicleData = useSelector(state => state?.parsalPartner?.MyVehicle || []);
    const loading = useSelector(state => state?.parsalPartner?.loading || false);
    const error = useSelector(state => state?.parsalPartner?.error || null);
    const partnerId = useSelector(state => state?.parsalPartner?.partnerId);
    const vehicleCount = vehicleData?.length;
   
    
    const refreshData = async () => {   
        try { 
             
             await dispatch(getVehicle({ partnerId }));
             const updatedVehicleCount = vehicleData?.length;

             if(updatedVehicleCount) {
                successToast(`Successfully loaded ${updatedVehicleCount} vehicle${updatedVehicleCount !== 1 ? 's' : ''}.`);
            }
        } catch (error) { 
            Alert.alert('Error', error.message || 'An unexpected error occurred.');

            console.error(error); 
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (partnerId) {
                refreshData();
            }
        }, [partnerId])
    );



    const isEnabled = vehicleCount > 0;

    const handleCardPress = (vehicleId) => {
        navigation.navigate('DriverDetail', {
            v_id: vehicleId,
            onUpdate: refreshData
        });
    };

    const onPress = () => {
        Alert.alert('Pay Fees Button Pressed');
    };

    return (
        <View style={styles.container}>
            {loading ?  <Loading loading={loading}  /> : (
                <VehicleList vehicleData={vehicleData} handleCardPress={handleCardPress}/>
            )}
            <View style={styles.stickyButtonContainer}>
                <TouchableOpacity
                    style={styles.anotherVehicleButton}
                    onPress={() => navigation.navigate('VehicleDetail')}
                >
                    <Text style={styles.anotherVehicleText}>+</Text>
                    <Text style={styles.anotherVehicleText}>Another Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isEnabled ? '#3D40D1' : '#d3d3d3' }]}
                    onPress={onPress}
                    disabled={!isEnabled}
                >
                    <Text style={styles.buttonText}>Pay Fees</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.homeBackground
    },
    flatListContent: {
        paddingBottom: 80,
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopColor: '#d3d3d3',
        borderTopWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 4,
        width: '49%',
    },
    anotherVehicleButton: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#3D40D1',
        width: '49%',
        gap: 5,
        flexDirection: 'row',
    },
    anotherVehicleText: {
        color: '#3D40D1',
        fontSize: 16,
    },
    buttonText: {
        color: '#fff',

        fontSize: 16,
    },
});

export default MyVehiclesScreen;
