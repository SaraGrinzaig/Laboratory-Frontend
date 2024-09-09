import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from '../css/Dashboard.module.css';

// Sample data
const monthlyOrdersData = [
  { month: 'January', orders: 120 },
  { month: 'February', orders: 98 },
  { month: 'March', orders: 150 }
];

const dailyOrdersData = [
  { date: '2024-09-01', orders: 12 },
  { date: '2024-09-02', orders: 15 },
  { date: '2024-09-03', orders: 10 }
];

const statusData = [
  { name: 'In Progress', value: 400 },
  { name: 'Completed', value: 300 },
  { name: 'Pending', value: 200 },
  { name: 'Canceled', value: 100 },
];

const renderCustomizedLabel = ({ x, y, name, value }) => (
  <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central">
    {`${name} (${value})`}
  </text>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const deviceTypeData = [
  { name: 'Phones', value: 400 },
  { name: 'Computers', value: 300 },
  { name: 'Other', value: 100 },
];

function Dashboard() {
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
