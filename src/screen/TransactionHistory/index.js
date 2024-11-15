import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../common/metrices';
import Colors from '../../common/Colors';
import Font from '../../common/Font';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import {useNavigation} from '@react-navigation/native';
import {hitGetTransactionListApi} from '../../config/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppImages from '../../common/AppImages';
const TransactionHistory = () => {
  const navigation = useNavigation();
  const [data, setdata] = useState([]);
  const get_data = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const param = {
      driverId: parsedUser?.payload?.driver_id,
    };
    hitGetTransactionListApi(param)
      .then(res => {
        if (res?.transaction_data) {
          setdata(res?.transaction_data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    get_data();
  }, []);
  return (
    <>
      <HeaderBackButton
        headerText={'Transaction History'}
        onPress={() => navigation.goBack('')}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.homeBackground}}>
        <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <>
                <TouchableHighlight style={styles.container}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: responsiveWidth(10),
                      }}>
                      <Text style={styles.title}>{item?.remark}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginRight: responsiveWidth(10),
                        alignItems: 'flex-end',
                        marginBottom: responsiveHeight(10),
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              item?.remark == 'Withdraw'
                                ? Colors.red
                                : '#49B125',
                          },
                        ]}>
                        {item?.remark != 'Day Earning'
                          ? ' ₹ ' + parseFloat(item?.online).toFixed(2)
                          : ' ₹ ' + parseFloat(item?.day_earning).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image
                source={AppImages.empty}
                style={{
                  height: responsiveHeight(120),
                  width: responsiveWidth(120),
                }}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No transaction record found</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(65),
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    marginVertical: responsiveHeight(10),
    marginHorizontal: responsiveWidth(10),
  },
  title: {
    fontSize: responsiveFontSize(16),
    color: '#3D465A',
    fontFamily: Font.medium_txt,
  },
  text: {
    fontSize: responsiveFontSize(12),
    color: '#49B125',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: '50%',
  },
  emptyText: {
    fontSize: responsiveFontSize(16),
    color: Colors.grey,
    textAlign: 'center',
    paddingTop: 10,
  },
});
export default TransactionHistory;
