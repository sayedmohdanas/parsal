import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Modal, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../common/metrices';
import Colors from '../../../common/Colors';
import HeaderBackButton from '../../../components/HeaderBackButton/HeaderBackButton';
import AppImages from '../../../common/AppImages';
import BorderLine from '../../../common/BorderLine.';
import { Fonts } from '../../../common/Theme';


const dummyData = [
  { id: '1', date: '2024-12-01', name: 'John Doe', description: 'Uber Ride', amount: '₹15.00', status: '1' },
  { id: '2', date: '2024-12-02', name: 'Jane Smith', description: 'Food Delivery', amount: '₹20.00', status: '2' },
  { id: '3', date: '2024-12-03', name: 'Michael Brown', description: 'Ride Payment', amount: '₹30.00', status: '3' },
  { id: '4', date: '2024-12-04', name: 'Emily Davis', description: 'Wallet Recharge', amount: '₹50.00', status: '4' },
];

const totalAmount = dummyData.reduce((sum, item) => {
  const amount = parseFloat(item.amount.replace('₹', '').replace(',', '')); // Remove ₹ and commas, then parse as float
  return sum + amount;
}, 0);


const LedgerScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  
  const handleCalendar = () => {
    setIsModalVisible(!isModalVisible);
  };

  

  
  const renderItem = ({ item }) => {
    let statusText = '';
    let statusColor = '';
    let statusIcon = null; // Add a variable to hold the image source.
  
    switch (item.status) {
      case '1':
        statusText = 'Online';
        statusColor = 'green';
        break;
      case '2':
        statusText = 'Offline';
        statusColor = 'red';
        break;
      case '3':
        statusText = 'Suspended';
        statusColor = 'red';
        statusIcon = AppImages.suspendedIcon; // Assign the suspend image.
        break;
      case '4':
        statusText = 'On Trip';
        statusColor = 'blue';
        statusIcon = AppImages.bike2; // Assign the bike2 image.
        break;
      default:
        statusText = 'Unknown';
        statusColor = 'grey';
    }
  
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.date}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {statusIcon ? (
              <Image
                source={statusIcon}
                style={styles.statusIcon}
              />
            ) : (
              <View
                style={[styles.greenCircle, { backgroundColor: statusColor }]}
              />
            )}
            <Text style={[styles.status, { color: statusColor, marginLeft: 8 }]}>
              {statusText}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    );
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackButton headerText={"Ledger"}
       rightButton={AppImages.calendarIcon}
       onButtonPress={handleCalendar}

       onPress={() => navigation.goBack()}

       />
     

      <View style={styles.summaryContainer}>
        <View style={{flex:1}}>
          
        <Text style={styles.leftText}>Total Earning</Text>
          </View>
          <View style={{}}>

            <View style={styles.separator} />

          </View>
          <View style={{flex:1,alignItems:'flex-end',}}>

        <Text style={styles.rightText}>{totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
       <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    applyFilter('today');
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    // applyFilter('last7Days');
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    // applyFilter("lastMonth");
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    // applyFilter("last3Months");
                    setIsModalVisible(false);
                  }}
                >
                  <Image source={AppImages.calendarIcon} style={styles.modalIcon} />
                  <Text style={styles.modalText}>Last 3 Months</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.homeBackground,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(10),
    backgroundColor: 'white',
    paddingVertical: 15,
    
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(8),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal:responsiveWidth(10),
    paddingVertical:responsiveHeight(10),
    borderBottomWidth:0.4
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: responsiveFontSize(14),
  },
  statusIcon: {
    width: responsiveWidth(12),
    height: responsiveHeight(12),
    resizeMode:'contain'
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
  },
  amount: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: 'black',
  },
  leftText: {
    color: 'black',
    fontSize: responsiveFontSize(22),
  },
  rightText: {
    color: 'black',
    fontSize: responsiveFontSize(22),
  },
  separator: {
    width: 1,
    // height: '100%,
    flex:1,
    backgroundColor: 'grey',
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: responsiveHeight(10),
    padding: responsiveWidth(5),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  modalIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    marginRight: responsiveWidth(10),
  },
  modalText: {
    fontSize: responsiveFontSize(14),
    fontFamily: Fonts.medium,
    color: 'black'
  },
  greenCircle: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    backgroundColor: Colors.bandBlue,
    borderRadius: responsiveHeight(20),
  },
});

export default LedgerScreen;
