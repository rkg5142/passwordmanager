import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className='home-container'>
      <div className='welcome-text'>
        <h1>Welcome to Password Manager</h1>
        <h3>Please login to continue</h3>
      </div>
      <div className='home-buttons'>
        <Link to="/login" className='link-btn'>
          Login Here
        </Link>
        <Link to="/register" className='link-btn'>
          Don't have an account? Register here.
        </Link>
      </div>
    </div>
  );
}

export default Homepage;