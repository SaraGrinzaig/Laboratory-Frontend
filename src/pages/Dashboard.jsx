import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/Dashboard.css';


import { 
  Box, 
  Typography, 
  Grid, 
  Paper 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// Mock data (replace with actual API calls)
const monthlyOrdersData = [
  { month: 'Jan', orders: 0 },
  { month: 'Feb', orders: 0 },
  { month: 'Mar', orders: 0 },
  { month: 'Apr', orders: 0 },
  { month: 'May', orders: 0 },
  { month: 'Jun', orders: 0 },
  { month: 'Jul', orders: 0 },
  { month: 'Aug', orders: 0 },
  { month: 'Sep', orders: 1 },
  { month: 'Oct', orders: 0 },
  { month: 'Nov', orders: 0 },
  { month: 'Dec', orders: 0 },
];

const dailyOrdersData = [
  { date: '2024-09-01', orders: 0 },
  { date: '2024-09-02', orders: 0 },
  { date: '2024-09-03', orders: 0 },
  { date: '2024-09-04', orders: 0 },
  { date: '2024-09-05', orders: 0 },
  { date: '2024-09-06', orders: 1 },
  { date: '2024-09-07', orders: 0 },
];

const statusData = [
  { name: 'הסתיים', value: 2 },
  { name: 'נכנס', value: 0 },
  { name: 'בטיפול', value: 0 },
  { name: 'הוזמן רכיב', value: 0 },
  { name: 'תקוע', value: 0 },
];

const deviceTypeData = [
  { name: 'מחשב', value: 0 },
  { name: 'טלפון', value: 2 },
  { name: 'אחר', value: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * Dashboard component displaying various charts
 * @returns {JSX.Element} The rendered Dashboard component
 */
function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        DASHBOARD
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">הזמנות לפי חודשים</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">הזמנות לפי ימים</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">כמות מכשירים לכל סטטוס</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">כמות הזמנות מכל סוג</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;