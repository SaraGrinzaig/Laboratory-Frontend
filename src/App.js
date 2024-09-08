import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeviceList from './pages/DeviceList';
import DeviceFormModal from './pages/DeviceFormModal';
import Dashboard from './pages/Dashboard'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/add-device" element={<DeviceFormModal />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
