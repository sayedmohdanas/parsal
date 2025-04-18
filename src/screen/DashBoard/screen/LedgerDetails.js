import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    Alert,
    Platform,
} from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import Orientation from "react-native-orientation-locker";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from "../../../common/metrices";
import AppImages from "../../../common/AppImages";
import { hitGetDriverTransactionsById } from "../../../config/api/api";
import Loading from "../../../components/Loading/Loading";
import moment from "moment";
import DateRangeModal from "../components/SelectDateModal";
import { formatDateOnly, getLast3Months, getLast7Days, getLastMonth, getToday } from "../../../common/CommonFunction";
const requestStoragePermission = async () => {
    try {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            return (
                granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
                PermissionsAndroid.RESULTS.GRANTED
            );
        }
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};


const TransactionTable = ({ navigation, route }) => {
    const { driver_id, driver_name } = route?.params
     const [dateRange, setDateRange] = useState({start: '', end: ''});
     const [headerText, setHeaderText] = useState(formatDateOnly(new Date()));
   
    const [transactions, setTransactions] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null); // State for selected driver

    const [isModalVisible, setIsModalVisible] = useState(false); // Added state for modal visibility

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        Orientation.lockToLandscape();
        
        return () => {
            Orientation.lockToPortrait();
        };
    }, [driver_id]);
    useEffect(()=>{
        fetchTransactions();
    },[route?.params])
    const handleCalendar = () => {
        setIsModalVisible(!isModalVisible);
    };
    const handleSelectDateRange = rangeType => {
        switch (rangeType) {
            case 'today':
                setSelectedKey('today')
                setDateRange(getToday());

                setHeaderText(formatDateOnly(new Date()));

                break;
            case 'last7Days':

                setSelectedKey('last7Days')
                setHeaderText('last 07 Days');


                setDateRange(getLast7Days());
                break;
            case 'lastMonth':
                setSelectedKey('lastMonth')
                setHeaderText('last 30 Days');

                setDateRange(getLastMonth());
                break;
            case 'last3Months':
                setSelectedKey('last3Months')
                setHeaderText('last 90 Days');

                setDateRange(getLast3Months());
                break;
            default:
                break;
        }
    };
    const fetchTransactions = async () => {
        try {
          setLoading(true);
          const response = await hitGetDriverTransactionsById({ driver_id: driver_id });
          console.log(response);
      
          if (response?.status) {
            console.log('transetiondata===>>', response?.data);
            setTransactions(response?.data);
          } else {
            // Alert.alert("Error", "Failed to fetch transactions.");
          }
        } catch (error) {
          console.error("API Error", error);
          Alert.alert("Error", "Something went wrong while fetching data.");
        } finally {
          setLoading(false); // Only one place to reset loading
        }
      };
      
    console.log('date-range====>',dateRange);
    
    const generatePDF = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert("Permission Denied", "Storage permission is required.");
            return;
        }
        try {
            let htmlContent = `
        <h1>Transaction Details</h1>
        <table border="1" style="width:100%; border-collapse: collapse; text-align: center;">
          <tr>
            <th>TXN#</th>
            <th>Date</th>
            <th>Type</th>
            <th>Gross</th>
            <th>Admin</th>
            <th>Tax</th>
            <th>Received</th>
          </tr>
          ${transactions
                    .map(
                        (item) => `
              <tr>
                <td>${item.txn || "--"}</td>
                <td>${item.date || "--"}</td>
                <td>${item.type || "--"}</td>
                <td>${item.gross || "0.00"}</td>
                <td>${item.admin || "0.00"}</td>
                <td>${item.tax || "0.00"}</td>
                <td>${item.received || "0.00"}</td>
              </tr>
            `
                    )
                    .join("")}
        </table>
      `;
            let options = {
                html: htmlContent,
                fileName: "TransactionDetails",
                directory: "Documents",
            };
            let file = await RNHTMLtoPDF.convert(options);
            Alert.alert("Success", "PDF Downloaded Successfully");
            FileViewer.open(file.filePath).catch(() => {
                Alert.alert("Error", "No application found to open this file.");
            });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred while generating the PDF.");
        }
    };
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{item.txn_no}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.date}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.type}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.gross}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.admin}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.tax}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.received}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <Loading loading={loading} />
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <HeaderBackButton onPress={() => navigation.goBack()} />
                    <Text style={styles.headerText}>Transactions</Text>
                </View>
                <TouchableOpacity style={styles.rightButtonContainer} onPress={ handleCalendar}>
          <Image source={AppImages.calendarIcon} resizeMode="contain" style={styles.rightIcon} />
        </TouchableOpacity>
                <DateRangeModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectDateRange={handleSelectDateRange}
        //   selectedKey={selectedKey} // Pass selectedKey if needed
        />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerTextName}>
                        {`as on dated ${dateRange?.startDate} to ${moment().format('DD-MMM-YYYY')} (${driver_name})`}
                    </Text>
                    <TouchableOpacity
                        onPress={generatePDF}
                        disabled={!transactions || transactions.length === 0} // disable if no transactions
                        style={{ opacity: (!transactions || transactions.length === 0) ? 0.5 : 1 }}
                    >
                        <Image
                            source={AppImages.PDF_DOWNLOAD}
                            style={styles.logo}
                        />
                    </TouchableOpacity>

                </View>
            </View>
            <View style={styles.rowHeader}>
                <Text style={[styles.cellHeader, { flex: 1 }]}>TXN#</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Date</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Type</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Gross</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Admin</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Tax</Text>
                <Text style={[styles.cellHeader, { flex: 1 }]}>Received</Text>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No data found</Text>
                    </View>
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: responsiveWidth(8),
        padding: responsiveHeight(1),
    },
    headerText: {
        fontSize: responsiveFontSize(18),
        fontWeight: "bold",
        color: "black",
    },
    headerTextName: {
        fontSize: responsiveFontSize(13),
        fontWeight: "semi-bold",
        color: "black",
        marginRight: responsiveWidth(14)
    },
    logo: {
        width: responsiveWidth(20),
        height: responsiveHeight(20),
        marginRight: responsiveWidth(10),
    },
    rowHeader: {
        flexDirection: "row",
        backgroundColor: "#ddd",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#bbb",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    cellHeader: {
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 5,
        color: "#000",
    },
    cell: {
        textAlign: "center",
        paddingHorizontal: 5,
        color: "#808080",
    },
    rightButtonContainer: {
        padding: responsiveWidth(5),
    },
    rightIcon: {
        height: responsiveHeight(19),
        width: responsiveWidth(19),
        resizeMode: 'contain'
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    noDataText: {
        fontSize: responsiveFontSize(18),
        fontWeight: '600',
        color: 'gray',
    },

});
export default TransactionTable;