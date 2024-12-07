import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import HeaderBackButton from '../../../components/HeaderBackButton/HeaderBackButton';

const dummyData = [
  { id: '1', date: '2024-12-01', description: 'Uber Ride', amount: '-₹15.00' },
  { id: '2', date: '2024-12-02', description: 'Food Delivery', amount: '-₹20.00' },
  { id: '3', date: '2024-12-03', description: 'Ride Payment', amount: '+₹30.00' },
  { id: '4', date: '2024-12-04', description: 'Wallet Recharge', amount: '+₹50.00' },
];

const LedgerScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={[styles.amount, item.amount.startsWith('-') ? styles.negative : styles.positive]}>
        {item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.header}>Ledger</Text> */}
      <HeaderBackButton  headerText={"Ledger"} />
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground ,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: responsiveHeight(20),
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(15),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
   
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
});

export default LedgerScreen;
