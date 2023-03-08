import React, { useState, useEffect} from 'react';
import { Routes, Route, Navigate, BrowserRouter, Outlet} from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import SecretsComponent from './SecretsComponent';
import PasswordRetriever from './GetSecretsComponent';
import ChangePassword from './ChangePassword';
import Homepage from './Home';
import Cookies from 'universal-cookie';

const PrivateOutlet = ({ cookies, children }) => {
  const token = cookies.get("TOKEN");

  if (token) {
    return (
      <>
        {children}
        <Outlet />
      </>
    );
  } else {
    return <Navigate to="/" replace />;
  }
};

function App() {
  const cookies = new Cookies();
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/savePassword" element={<PrivateOutlet cookies={cookies}><SecretsComponent /></PrivateOutlet>} />
          <Route path="/getPassword" element={<PrivateOutlet cookies={cookies}><PasswordRetriever /></PrivateOutlet>} />
          <Route path="/changePassword" element={<PrivateOutlet cookies={cookies}><ChangePassword /></PrivateOutlet>} />
        </Routes>
    </div>
  );
}

export default App;