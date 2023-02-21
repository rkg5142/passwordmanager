import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // import Navigate from react-router-dom
import Cookies from 'universal-cookie';


const PrivateOutlet = ({ cookies, children }) => {
  const token = cookies.get('TOKEN')

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

export default PrivateOutlet;