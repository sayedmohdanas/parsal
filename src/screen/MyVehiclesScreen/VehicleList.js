import React from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native';
import VehicleCard from './VehicleCard'; // Adjust the path as needed
import AppImages from '../../common/AppImages';

const VehicleList = ({ vehicleData, handleCardPress }) => {
    return (
        <FlatList
            data={vehicleData}
            renderItem={({ item }) => (
                <VehicleCard vehicle={item} onPress={handleCardPress} />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Image source={AppImages.vehicle} style={styles.fullWidthImage} />
                    <Text style={styles.emptyText}>No Vehicles Available</Text>
                </View>
            }
            contentContainerStyle={styles.flatListContent}
        />
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
       
    },
    emptyText: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#333', 
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 90,
    },
    fullWidthImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
});

export default VehicleList;
