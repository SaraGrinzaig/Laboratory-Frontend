import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from '../css/Dashboard.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Customized label for pie charts
const renderCustomizedLabel = ({ x, y, name, value }) => (
  <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central">
    {`${name} (${value})`}
  </text>
);

function Dashboard() {
  const [monthlyOrdersData, setMonthlyOrdersData] = useState([]);
  const [dailyOrdersData, setDailyOrdersData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [deviceTypeData, setDeviceTypeData] = useState([]);

  // Fetch monthly orders
  useEffect(() => {
    fetch('https://localhost:5000/api/Statistic/devices-per-month')
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.entries(data).map(([month, orders]) => ({
          month: `Month ${month}`, // You can format this as you want
          orders
        }));
        setMonthlyOrdersData(formattedData);
      })
      .catch(error => console.error('Error fetching monthly orders:', error));
  }, []);

  // Fetch daily orders
  useEffect(() => {
    fetch('https://localhost:5000/api/Statistic/devices-per-day')
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.entries(data).map(([date, orders]) => ({
          date: new Date(date).toLocaleDateString(), // Format date
          orders
        }));
        setDailyOrdersData(formattedData);
      })
      .catch(error => console.error('Error fetching daily orders:', error));
  }, []);

  // Fetch device statuses
  useEffect(() => {
    fetch('https://localhost:5000/api/Statistic/devices-by-status')
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.entries(data).map(([name, value]) => ({
          name,
          value
        }));
        setStatusData(formattedData);
      })
      .catch(error => console.error('Error fetching device statuses:', error));
  }, []);

// Fetch device types
useEffect(() => {
  fetch('https://localhost:5000/api/Statistic/devices-by-type')
    .then(response => response.json())
    .then(data => {
      const formattedData = Object.entries(data).map(([name, value]) => {
        if (name === '????'||name === 'Other'||name === 'other') {
          name = 'אחר';
        } else if (name === 'Computer') {
          name = 'מחשב';
        } else if (name === 'Phone') {
          name = 'פלאפון';
        }
        return { name, value };
      });
      setDeviceTypeData(formattedData);
    })
    .catch(error => console.error('Error fetching device types:', error));
}, []);

  return (
    <Box className={styles.dashboard}>
      <Typography variant="h4" component="h1" className={styles.title}>
        נתונים וסטטיסטיקות
      </Typography>
      <Grid container spacing={3} className={styles.gridContainer}>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <Typography variant="h6" className={styles.chartTitle}>הזמנות לפי חודשים</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <Typography variant="h6" className={styles.chartTitle}>הזמנות לפי ימים</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#00a86b" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <Typography variant="h6" className={styles.chartTitle}>כמות מכשירים לכל סטטוס</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <Typography variant="h6" className={styles.chartTitle}>כמות הזמנות מכל סוג</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
