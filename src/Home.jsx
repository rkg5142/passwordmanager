import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <h1>Welcome to Password Manager</h1>
      <p>Please login to continue</p>
      <Link to="/login" className="home-login-link">
        Login Here
      </Link>
    </div>
  );
}

export default Homepage;