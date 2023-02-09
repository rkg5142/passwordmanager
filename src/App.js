import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login  from "./Login";
import Register  from "./Register";
import FreeComponent  from "./FreeComponent"
import AuthComponent from "./AuthComponent"
import Account from "./Account";
import ProtectedRoutes from "./ProtectedRoutes";


function App() {
  return (
    
    <div className="App">
        <Routes>
          <Route path = "/" element={<Login/>} />
          <Route path = "/login" element={<Login/>} />
          <Route path= "/register" element={<Register/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/free" element={<FreeComponent/>} />
          <Route exact path="/" element={<ProtectedRoutes/>}>
            <Route exact path="/" element={<AuthComponent/>}/>
          </Route>
        </Routes>
    </div>
  );
}

export default App;
