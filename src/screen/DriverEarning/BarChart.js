
// import React, {useEffect, useState} from 'react';
// import {View} from 'react-native';
// import {VictoryChart, VictoryAxis, VictoryBar} from 'victory-native';
// import { responsiveWidth } from '../../common/metrices';

// // Helper to get the day of the week (Mon, Tue, etc.)
// const getDayOfWeek = dateString => {
//   const date = new Date(dateString);
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   return days[date.getDay()];
// };

// const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });

// const handleBarPress = (event, props) => {
//   const { datum, x, y } = props; // Access data and position of the bar
//   setTooltip({
//     visible: true,
//     x,
//     y,
//     value: datum.value,
//   });
// };

// const handleBarRelease = () => {
//   setTooltip({ visible: false, x: 0, y: 0, value: null });
// };
// // Helper to check if a date is today
// const isToday = date => {
//   const today = new Date();
//   const givenDate = new Date(date);
//   return (
//     today.getDate() === givenDate.getDate() &&
//     today.getMonth() === givenDate.getMonth() &&
//     today.getFullYear() === givenDate.getFullYear()
//   );
// };

// // Aggregating earnings by hours (0-23) for today
// const aggregateEarningsByHour = data => {
//   const earnings = Array(24).fill(0); // Array for 24 hours, each initialized to 0
//   data.forEach(entry => {
//     const orderDate = new Date(entry.order_date);
//     // if (isToday(orderDate)) {
//       const hour = orderDate.getHours(); // Get the hour (0-23)
//       earnings[hour] += entry.paid_amount; // Add paid amount to the corresponding hour
//     // }
//   });
//   return earnings.map((value, hour) => ({hour, value}));
// };
// // const aggregateEarningsByHour = data => {
// //   const earnings = Array(24).fill(0); // Array for 24 hours, each initialized to 0
// //   data.forEach(entry => {
// //     const orderDate = new Date(entry.order_date);
// //     // if (isToday(orderDate)) {
// //       const hour = orderDate.getHours(); // Get the hour (0-23)
// //       earnings[hour] += entry.paid_amount; // Add paid amount to the corresponding hour
// //     // }
// //   });
// //   return earnings.map((value, hour) => ({hour, value}));
// // };
// // Aggregating earnings by days of the week
// const aggregateEarningsByDay = data => {
//   const earnings = {
//     Mon: 0,
//     Tue: 0,
//     Wed: 0,
//     Thu: 0,
//     Fri: 0,
//     Sat: 0,
//     Sun: 0,
//   };
//   data.forEach(entry => {
//     const day = getDayOfWeek(entry.order_date);
//     earnings[day] += entry.paid_amount;
//   });
//   return Object.keys(earnings).map(day => ({
//     day,
//     value: earnings[day],
//   }));
// };

// const BarChart = ({driverEarningData, selectedRange}) => {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const filteredData = driverEarningData?.individual_paid_amounts || [];
//     let aggregatedData = [];

//     if (selectedRange === 'today') {
//       aggregatedData = aggregateEarningsByHour(filteredData); // Aggregate by hour for today
//     } else if (selectedRange === 'week') {
//       aggregatedData = aggregateEarningsByDay(filteredData); // Aggregate by day for the week
//     }

//     const updatedData = aggregatedData.map(data => {
//       let color = '#3D40D1'; // Default bar color
//       if (selectedRange === 'today') {
//         const currentHour = new Date().getHours();
//         if (data.hour === currentHour) {
//           color = '#3D40D1'; // Highlight current hour
//         }
//       } else if (selectedRange === 'week') {
//         const currentDay = getDayOfWeek(new Date());
        
//         if (data.day === currentDay) {
//           color = '#3D40D1'; // Highlight current day
//         }
//       }
//       return {
//         ...data,
//         color,
//       };
//     });

//     setChartData(updatedData);
//   }, [driverEarningData, selectedRange]);

//   if (!chartData.length) {
//     return null;
//   }

//   return (
//     <View>
//       <VictoryChart height={220} domainPadding={20}>
//         <VictoryAxis
//           style={{
//             axis: {stroke: '#232323'},
//             tickLabels: {
//               fontSize: 10,
//               padding: 5,
//               fill: '#777777',
//             },
//           }}
//           tickValues={
//             selectedRange === 'today'
//               ? [0, 3, 6, 9, 12, 15, 18, 21] // 3-hour intervals for today
//               : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Days of the week
//           }
//           tickFormat={(t, index) =>
//             selectedRange === 'today' ? `${t}:00` : `${index + 1}\n${t}`
//           }
//         />
//         <VictoryAxis
//           dependentAxis
//           tickFormat={x => `₹${x}`} // Show earnings as they are
//           style={{
//             axis: {stroke: 'transparent'},
//             grid: {stroke: '#D8D8D8', strokeDasharray: '0'},
//             tickLabels: {
//               fontSize: 10,
//               padding: 5,
//               fill: '#777777',
//               fontWeight: '500',
//             },
//           }}
//         />
//         {/* <VictoryBar
//           data={chartData}
//           x={selectedRange === 'today' ? 'hour' : 'day'} // x-axis is "hour" for today, "day" for week
//           y="value"
//           style={{
//             data: {
//               fill: ({datum}) => datum.color, // Set the bar color based on the time period
//               width: selectedRange == 'today' ? responsiveWidth(10) : 25, // Bar width
//             },
//           }}
//           cornerRadius={{top: 2}}
//         /> */}
//         {/* <VictoryBar
//     data={chartData}
//     x={selectedRange === 'today' ? 'hour' : 'day'} // x-axis is "hour" for today, "day" for week
//     y="value"
//     style={{
//       data: {
//         fill: ({ datum }) => datum.color, // Set the bar color based on the time period
//         width: selectedRange === 'today' ? responsiveWidth(10) : 25, // Bar width
//       },
//     }}
//     cornerRadius={{ top: 2 }}
//     events={[
//       {
//         target: 'data',
//         eventHandlers: {
//           onPressIn: (evt, props) => {
//             const datum = props.datum; // Access the data of the bar that was pressed
//             console.log('Price:', datum.value); // For debugging
//             alert(`Price: ${datum.value}`); // Display the price
//             return null; // No state change required
//           },
//         },
//       },
//     ]} */}
//   {/* /> */}
//   <VictoryBar
//           data={chartData}
//           x={selectedRange === 'today' ? 'hour' : 'day'}
//           y="value"
//           style={{
//             data: {
//               fill: ({ datum }) => datum.color,
//               width: selectedRange === 'today' ? responsiveWidth(10) : 25,
//             },
//           }}
//           cornerRadius={{ top: 2 }}
//           events={[
//             {
//               target: 'data',
//               eventHandlers: {
//                 onPressIn: (evt, props) => {
//                   handleBarPress(evt, props);
//                 },
//                 onPressOut: handleBarRelease,
//               },
//             },
//           ]}
//         />
//       </VictoryChart>
//       {tooltip.visible && (
//         <View
//           style={[
//             styles.tooltip,
//             {
//               left: tooltip.x - 30, // Adjust to center the tooltip over the bar
//               top: tooltip.y - 50, // Position above the bar
//             },
//           ]}
//         >
//           <Text style={styles.tooltipText}>${tooltip.value}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default BarChart;





// import React, { useEffect, useState } from 'react';
// import { View } from 'react-native';
// import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native';

// const BarChart = ({ driverEarningData, selectedRange }) => {
//   const [chartData, setChartData] = useState([]);

//   // Function to get day of the week from the date string
//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString);
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return days[date.getDay()];
//   };

//   // Function to format date as "Mon 25" or similar
//   const formatDayDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = getDayOfWeek(dateString); // Get the day of the week
//     const dayOfMonth = date.getDate(); // Get the day of the month
//     return `${day} ${dayOfMonth}`;
//   };

//   // Function to aggregate earnings by day for the week
//   const aggregateEarningsByDay = (data) => {
//     const earnings = {
//       Mon: 0,
//       Tue: 0,
//       Wed: 0,
//       Thu: 0,
//       Fri: 0,
//       Sat: 0,
//       Sun: 0,
//     };
//     data.forEach(entry => {
//       const day = getDayOfWeek(entry.order_date); // Get the day of the week
//       earnings[day] += entry.paid_amount;
//     });
//     return Object.keys(earnings).map(day => ({
//       day,
//       value: earnings[day],
//     }));
//   };

//   useEffect(() => {
//     const filteredData = driverEarningData?.individual_paid_amounts || [];
//     let aggregatedData = [];

//     // Aggregate data based on selected range (today or week)
//     if (selectedRange === 'today') {
//       aggregatedData = aggregateEarningsByHour(filteredData); // Aggregate by hour for today
//     } else if (selectedRange === 'week') {
//       aggregatedData = aggregateEarningsByDay(filteredData); // Aggregate by day for the week
//     }

//     // Update the data with colors based on the current time or day
//     const updatedData = aggregatedData.map(data => {
//       let color = '#3D40D1'; // Default bar color
//       if (selectedRange === 'today') {
//         const currentHour = new Date().getHours();
//         if (data.hour === currentHour) {
//           color = '#3D40D1'; // Highlight current hour
//         }
//       } else if (selectedRange === 'week') {
//         const currentDay = getDayOfWeek(new Date());
//         if (data.day === currentDay) {
//           color = '#3D40D1'; // Highlight current day
//         }
//       }
//       return {
//         ...data,
//         color,
//       };
//     });

//     setChartData(updatedData);
//   }, [driverEarningData, selectedRange]);

//   if (!chartData.length) {
//     return null;
//   }

//   return (
//     <View>
//       <VictoryChart height={220} domainPadding={20}>
//         <VictoryAxis
//           style={{
//             axis: { stroke: '#232323' },
//             tickLabels: {
//               fontSize: 10,
//               padding: 5,
//               fill: '#777777',
//               textAnchor: 'middle',
//             },
//           }}
//           tickValues={selectedRange === 'today' ? [0, 3, 6, 9, 12, 15, 18, 21] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
//           tickFormat={(t, index) => {
//             // Display both day and date (e.g., Mon 25)
//             if (selectedRange === 'today') {
//               return `${t}:00`;
//             } else {
//               // Format each day to show day and date (e.g., Mon 25)
//               const dayDate = chartData[index]?.day ? formatDayDate(chartData[index]?.day) : '';
//               return dayDate;
//             }
//           }}
//         />
//         <VictoryAxis
//           dependentAxis
//           tickFormat={x => `₹${x}`}
//           style={{
//             axis: { stroke: 'transparent' },
//             grid: { stroke: '#D8D8D8', strokeDasharray: '0' },
//             tickLabels: {
//               fontSize: 10,
//               padding: 5,
//               fill: '#777777',
//               fontWeight: '500',
//             },
//           }}
//         />
//         <VictoryBar
//           data={chartData}
//           x={selectedRange === 'today' ? 'hour' : 'day'}
//           y="value"
//           style={{
//             data: {
//               fill: ({ datum }) => datum.color,
//               width: selectedRange === 'today' ? 15 : 25,
//             },
//           }}
//           cornerRadius={{ top: 2 }}
//         />
//       </VictoryChart>
//     </View>
//   );
// };

// export default BarChart;













import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native';
import { responsiveHeight, responsiveWidth } from '../../common/metrices';

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const isToday = (date) => {
  const today = new Date();
  const givenDate = new Date(date);
  return (
    today.getDate() === givenDate.getDate() &&
    today.getMonth() === givenDate.getMonth() &&
    today.getFullYear() === givenDate.getFullYear()
  );
};

const aggregateEarningsByHour = (data) => {
  const earnings = Array(24).fill(0); 
  data.forEach((entry) => {
    const orderDate = new Date(entry.order_date);
    const hour = orderDate.getHours(); 
    earnings[hour] += entry.paid_amount; 
  });
  return earnings.map((value, hour) => ({ hour, value }));
};

// Aggregating earnings by days of the week
// const aggregateEarningsByDay = (data) => {
//   // Alert.alert('hi')
//   const earnings = {
//     Mon: 0,
//     Tue: 0,
//     Wed: 4,
//     Thu: 0,
//     Fri: 0,
//     Sat: 0,
//     Sun: 0,
//   };

//   // let amount =;
//   data.forEach((entry) => {
//     const day = getDayOfWeek(entry.order_date);
//     console.log(day,'dayyyy--->>')
//     earnings[day] += entry.paid_amount;

//     console.log(day,'dayyyy--->>',earnings[day] )

//   });

//   return Object.keys(earnings).map((day) => ({
//     day,
//     value: earnings[day],
//   }));
// };

const aggregateEarningsByDay = (data) => {
  const earnings = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  data.forEach((entry) => {
    const orderDate = new Date(entry.order_date);
    const day = getDayOfWeek(orderDate);
    
    console.log(`Order date: ${orderDate}, Day: ${day}, Paid amount: ${entry.paid_amount}`);

    // Check if the day exists in the earnings object and add the paid amount
    if (earnings[day] !== undefined) {
      earnings[day] += entry.paid_amount;
    } else {
      console.log(`Unexpected day found: ${day}`);
    }

    // Debug: Log the current state of earnings after processing each entry
    console.log('Current earnings state:', earnings);
  });

  // Convert the earnings object into an array for VictoryBar
  return Object.keys(earnings).map((day) => ({
    day,
    value: earnings[day],
  }));
};



const BarChart = ({ driverEarningData, selectedRange }) => {
  const [chartData, setChartData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null });

  const handleBarPress = (event, props) => {
    const { datum, x, y } = props; // Access data and position of the bar
  
    setTooltip({
      visible: true,
      x,
      y,
      value: datum.value,
    });
  
    // Automatically hide tooltip after 2 seconds (2000ms)
    setTimeout(() => {
      setTooltip({ visible: false, x: 0, y: 0, value: null });
    }, 4000); // Adjust time (in milliseconds) as needed
  };
  

  const handleBarRelease = () => {
    // setTooltip({ visible: false, x: 0, y: 0, value: null });
  };

  useEffect(() => {
    const filteredData = driverEarningData?.individual_paid_amounts || [];
    // console.log(filteredData?.individual_paid_amounts,'filterData--');
    
    let aggregatedData = [];

    if (selectedRange === 'today') {
      aggregatedData = aggregateEarningsByHour(filteredData); // Aggregate by hour for today
      // console.log("dayby------",aggregatedData)

    } else if (selectedRange === 'week') {
      aggregatedData = aggregateEarningsByDay(filteredData);
      // console.log("weeekly------",aggregatedData)
      // Aggregate by day for the week
    }
     
    // console.log('aggregatedData====>>>w__rev',aggregatedData);
    
    // aggregatedData = aggregatedData.reverse();
    // console.log('aggregatedData====>>>a__rev',aggregatedData);

    const updatedData = aggregatedData.map((data) => {
      let color = '#3D40D1'; // Default bar color
      if (selectedRange === 'today') {
        const currentHour = new Date().getHours();
        if (data.hour === currentHour) {
          color = '#3D40D1'; // Highlight current hour
        }
      } else if (selectedRange === 'week') {
        const currentDay = getDayOfWeek(new Date());
        if (data.day === currentDay) {
          color = '#3D40D1'; // Highlight current day
        }
      }
      return {
        ...data,
        color,
      };
    });
   console.log('anas======>>>>>>>>',updatedData);
   
    setChartData(updatedData);
  }, [driverEarningData, selectedRange]);

  if (!chartData.length) {
    return null;
  }

  return (
    <View>
      <VictoryChart height={220} domainPadding={20}>
        <VictoryAxis
          style={{
            axis: { stroke: '#232323' },
            tickLabels: {
              fontSize: 10,
              padding: 5,
              fill: '#777777',
            },
          }}
          tickValues={
            selectedRange === 'today'
              ? [0, 3, 6, 9, 12, 15, 18, 21,24] // 3-hour intervals for today
              : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Days of the week
          }
          tickFormat={(t, index) =>
            selectedRange === 'today' ? `${t}:00` : `${index + 1}\n${t}`
          }
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `₹${x}`} // Show earnings as they are
          style={{
            axis: { stroke: 'transparent' },
            grid: { stroke: '#D8D8D8', strokeDasharray: '0' },
            tickLabels: {
              fontSize: 10,
              padding: 5,
              fill: '#777777',
              fontWeight: '500',
            },
          }}
        />
        <VictoryBar
          data={chartData}
          x={selectedRange === 'today' ? 'hour' : 'day'}
          y="value"
          style={{
            data: {
              fill: ({ datum }) => datum.color,
              width: selectedRange === 'today' ? responsiveWidth(10) : 25,
            },
          }}
          cornerRadius={{ top: 2 }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: (evt, props) => {
                  handleBarPress(evt, props);
                },
                onPressOut: handleBarRelease,
              },
            },
          ]}
        />
      </VictoryChart>
      {tooltip.visible && (
        <View
          style={[
            styles.tooltip,
            {
              left: tooltip.x - 30, 
              top: tooltip.y - 40, 
            },
          ]}
        >
<Text style={styles.tooltipText}>₹{tooltip?.value?.toFixed(2)}</Text>
</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: 5,
    borderColor: 'lightgrey',
    borderWidth: 1,
    // elevation: 3,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BarChart;
