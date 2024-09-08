import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceFormModal from '../pages/DeviceFormModal';  
import DeviceList from '../pages/DeviceList'; 
import Dashboard from '../pages/Dashboard';           

export const Routing = () => {
  return (
    <Router>
    
        <Routes>
        
          <Route path="/" element={<DeviceList />} />
          <Route path="/device-form" element={<DeviceFormModal />} />
          <Route path="/device-list" element={<DeviceList />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>
      
    </Router>
  );
};

export default Routing;