import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DeviceList from './pages/DeviceList';
import DeviceFormModal from './pages/DeviceFormModal';
import Dashboard from './pages/Dashboard';
import './App.css';
import './css/Sidebar.css';
import CustomerList from './pages/CustomerList';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            <li>
              <Link to="/">דשבורד ונתונים</Link>
            </li>
            <li>
              <Link to="/devices">מכשירים</Link>
            </li>
            <li>
              <Link to="/customers">לקוחות</Link>
            </li>
          </ul>
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/add-device" element={<DeviceFormModal />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
