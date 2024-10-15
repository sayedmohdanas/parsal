
import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { Alert, View } from 'react-native';
import Line from '../../components/Line/Line';
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
    const aggregatedData = aggregateEarningsByDay(filteredData);
    const updatedData = aggregatedData.map((data) => {
      let color = '#B1B2ED';
      if (selectedRange === 'today' && data.day === getDayOfWeek(new Date())) {
        color = '#3D40D1';
      } else if (selectedRange === 'week') {
        color = '#3D40D1';
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
          tickValues={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          tickFormat={(t, index) => `${index + 1}\n${t}`}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `${x / 1000}k`}
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
          x="day"
          y="value"
          style={{
            data: {
              fill: ({ datum }) => datum.color, // Set the bar color based on the day's earnings
              width: 25,
            },
          }}
          cornerRadius={{ top: 2 }}
        />
      </VictoryChart>
      <Line marginH={0} />
    </View>
  );
};
export default BarChart;