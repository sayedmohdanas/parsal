import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../../common/Colors';

// Card Component
const Card = ({ date, price, status }) => (
  <View style={styles.card}>
    <View style={{flexDirection:"row",justifyContent:'space-between'}}>
    <View style={styles.cardHeader}>
      <Text style={styles.headerText}>Registration Fee</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.priceText}>{price}</Text>
      <Text style={styles.statusText}>{status}</Text>
    </View>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.bodyText}>Non-Refundable Amount Paid for On-Boarding</Text>
    </View>
 
  </View>
);

const PaymentsScreen = () => {
  return (
    <View style={styles.container}>
      <Card date="13 Jul 02:18 PM" price="200" status="Success" />
      <Card date="13 Jul 02:18 PM" price="400" status="Failure" />
      <View style={styles.NoMoreItemCard}>
        <Text style={styles.NoMoreItemText}>No more items</Text>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  NoMoreItemCard:{
    justifyContent:"center",
    alignItems:'center'
  },
  NoMoreItemText:{
    fontWeight:'bold',
    color:Colors.grey
  },

  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    marginTop: 8,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
  },
  cardFooter: {
    alignItems: 'center',
    justifyContent:'center'
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default PaymentsScreen;
