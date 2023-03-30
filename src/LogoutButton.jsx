import React from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const LogoutButton = () => {
  const handleLogout = () => {
    // remove the cookie
    cookies.remove("TOKEN");
    localStorage.removeItem("KEY");
    // redirect user to the login page
    window.location.href = "/login";
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
