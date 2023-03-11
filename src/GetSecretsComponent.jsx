import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Alert } from "react-bootstrap";
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import CryptoJS from "crypto-js";

const cookies = new Cookies();

export default function PasswordForm() {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");

  const [clickedIndex, setClickedIndex] = useState(-1); // -1 for nothing clicked

  useEffect(() => {
    const token = cookies.get("TOKEN");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get("/getAllPasswords", config)
      .then((response) => {
        console.log(response.data);
        setPasswords(response.data);
        setError("");
      })
      .catch((error) => {
        setPasswords([]);
        setError(error.response.data.message);
      });
  }, []);

  function handlePasswordClick(index) {
    if (clickedIndex === index) {
      setClickedIndex(-1); 
    } else {
      setClickedIndex(index);
    }
  }

  return (
    <>
      <div className="get-password">
      <Link to="/savePassword" className="save-password-link">
        Save a new password
      </Link>
      <Link to="/changePassword" className="change-password-link">
        Change Password
      </Link>
      <LogoutButton />
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {passwords.map((password, index) => {
          const encryptedPassword = password.password;
          const key = localStorage.getItem("KEY").toString();
          const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
          const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

          const passwordText = clickedIndex === index ? decryptedPassword : "*********";

          return (
            <ListGroup.Item key={index}>
              <p><strong>Name:</strong> {password.name}</p>
              <p><strong>Username:</strong> {password.userName}</p>
              <p><strong>URL:</strong> {password.url}</p>
              <p><strong>Password:</strong> <span onClick={() => handlePasswordClick(index)}>{passwordText}</span></p>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div> 
    </>
  );
}
