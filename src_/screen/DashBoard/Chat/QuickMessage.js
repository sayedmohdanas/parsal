import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Colors from '../../../common/Colors';

const QuickResponses = ({ quickResponses, handleQuickResponse }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quickResponseButton}
      onPress={() => handleQuickResponse(item)}
    >
      <Text style={styles.quickResponseText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.quickResponsesContainer}>
      <FlatList
        data={quickResponses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        contentContainerStyle={styles.flatListContent} // Style for the FlatList content
      />
    </View>
  );
};

const styles = StyleSheet.create({
  quickResponsesContainer: {
    padding: 10,
    // flex:1,

    flexDirection: 'row', // Set row direction for wrapping
    // flexWrap: 'wrap', // Allow wrapping
    // backgroundColor:'red',
    // paddingVertical:30
    // height:300
  },
  quickResponseButton: {
    backgroundColor: Colors.brandBlue, // Button color
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5, 
    justifyContent:'center',
    alignItems:'center'
    // Margin for spacing between buttons
  },
  quickResponseText: {
    color: '#fff', // Text color
  },
  flatListContent: {
    paddingHorizontal: 10, // Add some horizontal padding for the FlatList
  },
});

export default QuickResponses;
