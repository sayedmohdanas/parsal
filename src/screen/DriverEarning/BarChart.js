import { StyleSheet, View, Dimensions, Text } from 'react-native';
import React from 'react';
import {
    BarChart as ChartKitBarChart
} from "react-native-chart-kit";

const BarChartComponent = () => {
    const data = {
        labels: ["1", "2", "3", "4", "5", "6", "7"], // Numeric labels
        datasets: [
            {
                data: [99, 1000, 2000, 4000, 5000, 6000, 7000], // Sample data
            }
        ]
    };

    const chartConfig = {
        backgroundColor: "#FFFFFF", // Set background color to white
        backgroundGradientFrom: "#FFFFFF", // Gradient from white
        backgroundGradientTo: "#FFFFFF", // Gradient to white
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Bar color set to blue
        strokeWidth: 2, // Width of chart lines
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // Remove shadow
        propsForBackgroundLines: {
            strokeWidth: 0, // Remove background grid lines
        },
        decimalPlaces: 0, // Disable decimal places in y-axis labels
    };

    const screenWidth = Dimensions.get('window').width; // Get screen width

    return (
        <View style={styles.container}>
            <ChartKitBarChart
                style={styles.graphStyle}
                data={data}
                width={screenWidth}
                height={170}
                yAxisLabel=""  // No prefix
                yAxisSuffix="k" // Adds 'k' to the values
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
            {/* <View style={styles.labelsContainer}>
                <View style={styles.numbersContainer}>
                    <Text style={styles.numberText}>1</Text>
                    <Text style={styles.numberText}>2</Text>
                    <Text style={styles.numberText}>3</Text>
                    <Text style={styles.numberText}>4</Text>
                    <Text style={styles.numberText}>5</Text>
                    <Text style={styles.numberText}>6</Text>
                    <Text style={styles.numberText}>7</Text>
                </View>
                <View style={styles.weekdaysContainer}>
                    <Text style={styles.weekdayText}>M</Text>
                    <Text style={styles.weekdayText}>T</Text>
                    <Text style={styles.weekdayText}>W</Text>
                    <Text style={styles.weekdayText}>T</Text>
                    <Text style={styles.weekdayText}>F</Text>
                    <Text style={styles.weekdayText}>S</Text>
                    <Text style={styles.weekdayText}>S</Text>
                </View>
                
            </View> */}
        </View>
    );
};

export default BarChartComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', // Center the chart and labels
    },
    graphStyle: {
        marginVertical: 4,
        borderRadius: 16,
    },
    labelsContainer: {
        flexDirection: 'column', // Stack labels in a column
        alignItems: 'center', // Center align the columns
        // marginTop: 10,
        alignSelf:'flex-end' // Space between chart and labels
    },
    weekdaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Full width for equal spacing
    },
    numbersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Full width for equal spacing
        paddingTop: 5, // Space between weekdays and numbers
    },
    weekdayText: {
        fontSize: 16,
        color: 'black', // Customize the color of weekday text
        flex: 1, // Allow equal spacing
        textAlign: 'center', // Center align text
    },
    numberText: {
        fontSize: 16,
        color: 'black', // Customize the color of number text
        flex: 1, // Allow equal spacing
        textAlign: 'center', // Center align text
    },
});
