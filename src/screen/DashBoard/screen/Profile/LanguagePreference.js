import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';

const LanguagePreferenceCard = () => {
  return (
    <View style={styles.container}>
      {/* First Row - Preferred App Language */}
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Preferred App Language</Text>
          <Text style={styles.subheading}>English</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => alert('Change App Language')}>
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row - Preferred Training Language */}
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Preferred Training Language</Text>
          <Text style={styles.subheading}>Hindi</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => alert('Change Training Language')}>
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    // marginVertical: 5,
    marginTop:12,

    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.grey,
    fontWeight: '500',
  },
  subheading: {
    
    fontSize: 16,
    color: Colors.black,
    fontWeight: 'bold',

    marginTop: 4,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.white, 
    borderWidth:0.5,
    borderColor:Colors.brandBlue,// You can adjust the color here
    // borderRadius: 4,
  },
  buttonText: {
    color: Colors.brandBlue,
  
    fontSize: 14,

  },
});

export default LanguagePreferenceCard;
