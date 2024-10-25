
// import React, { useState, useEffect } from 'react';
// import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
// import { Alert, View } from 'react-native';
// import Line from '../../components/Line/Line';
// const getDayOfWeek = (dateString) => {
//   const date = new Date(dateString);
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   return days[date.getDay()];
// };
// const isToday = (date) => {
//   const today = new Date();
//   const givenDate = new Date(date);
//   return (
//     today.getDate() === givenDate.getDate() &&
//     today.getMonth() === givenDate.getMonth() &&
//     today.getFullYear() === givenDate.getFullYear()
//   );
// };
// const aggregateEarningsByDay = (data) => {
//   const earnings = {
//     Mon: 0,
//     Tue: 0,
//     Wed: 0,
//     Thu: 0,
//     Fri: 0,
//     Sat: 0,
//     Sun: 0,
//   };
//   data.forEach((entry) => {
//     const day = getDayOfWeek(entry.order_date);
//     earnings[day] += entry.paid_amount;
//   });
//   return Object.keys(earnings).map((day) => ({
//     day,
//     value: earnings[day],
//   }));
// };
// const BarChart = ({ driverEarningData, selectedRange }) => {
//   const [chartData, setChartData] = useState([]);
//   useEffect(() => {
//     const filteredData = driverEarningData?.individual_paid_amounts || [];
//     const aggregatedData = aggregateEarningsByDay(filteredData);
//     const updatedData = aggregatedData.map((data) => {
//       let color = '#B1B2ED';
//       if (selectedRange === 'today' && data.day === getDayOfWeek(new Date())) {
//         color = '#3D40D1';
//       } else if (selectedRange === 'week') {
//         color = '#3D40D1';
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
//             },
//           }}
//           tickValues={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
//           tickFormat={(t, index) => `${index + 1}\n${t}`}
//         />
//         <VictoryAxis
//           dependentAxis
//           tickFormat={(x) => `${x / 1000}k`}
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
//           x="day"
//           y="value"
//           style={{
//             data: {
//               fill: ({ datum }) => datum.color, // Set the bar color based on the day's earnings
//               width: 25,
//             },
//           }}
//           cornerRadius={{ top: 2 }}
//         />
//       </VictoryChart>
//       <Line marginH={0} />
//     </View>
//   );
// };
// export default BarChart;
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native';

// Helper to get the day of the week (Mon, Tue, etc.)
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// Helper to check if a date is today
const isToday = (date) => {
  const today = new Date();
  const givenDate = new Date(date);
  return (
    today.getDate() === givenDate.getDate() &&
    today.getMonth() === givenDate.getMonth() &&
    today.getFullYear() === givenDate.getFullYear()
  );
};

// Aggregating earnings by hours (0-23) for today
const aggregateEarningsByHour = (data) => {
  const earnings = Array(24).fill(0); // Array for 24 hours, each initialized to 0
  data.forEach((entry) => {
    const orderDate = new Date(entry.order_date);
    if (isToday(orderDate)) {
      const hour = orderDate.getHours(); // Get the hour (0-23)
      earnings[hour] += entry.paid_amount; // Add paid amount to the corresponding hour
    }
  });
  return earnings.map((value, hour) => ({ hour, value }));
};

// Aggregating earnings by days of the week
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
    const day = getDayOfWeek(entry.order_date);
    earnings[day] += entry.paid_amount;
  });
  return Object.keys(earnings).map((day) => ({
    day,
    value: earnings[day],
  }));
};

const BarChart = ({ driverEarningData, selectedRange }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const filteredData = driverEarningData?.individual_paid_amounts || [];
    let aggregatedData = [];

    if (selectedRange === 'today') {
      aggregatedData = aggregateEarningsByHour(filteredData); // Aggregate by hour for today
    } else if (selectedRange === 'week') {
      aggregatedData = aggregateEarningsByDay(filteredData); // Aggregate by day for the week
    }

    const updatedData = aggregatedData.map((data) => {
      let color = '#B1B2ED'; // Default bar color
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
              ? [0, 3, 6, 9, 12, 15, 18, 21] // 3-hour intervals for today
              : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Days of the week
          }
          // tickFormat={(t) =>
          //   selectedRange === 'today' ? `${t}:00` : t // Format as 0:00, 3:00 for today or days for week
          // }
          tickFormat={(t, index) =>  selectedRange === 'today' ? `${t}:00` :`${index + 1}\n${t}`}

        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `${x}`} // Show earnings as they are
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
          x={selectedRange === 'today' ? 'hour' : 'day'} // x-axis is "hour" for today, "day" for week
          y="value"
          style={{
            data: {
              fill: ({ datum }) => datum.color, // Set the bar color based on the time period
              width:selectedRange == 'today' ?15 : 25, // Bar width
            },
          }}
          cornerRadius={{ top: 2 }}
        />
      </VictoryChart>
    </View>
  );
};

export default BarChart;