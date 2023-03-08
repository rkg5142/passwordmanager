import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import { hashPassword, generateKey } from "./crypto";
import { Link } from 'react-router-dom';
import CryptoJS from "crypto-js";

const cookies = new Cookies();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    //To-do: create key from pwd and store in client
    var salt = CryptoJS.enc.Hex.parse("aabbccddeeff00112233445566778899");

    // // Derive a decryption key from the user's password using PBKDF2
    var key = generateKey({email, password, salt});
    console.log('key:', key);

    // // Store the decryption key in localStorage
    localStorage.setItem("KEY", key);

    // // Hash the password before sending to server
    const hashedPassword = hashPassword(password);

    const configuration = {
      method: "post",
      url: "/login",
      data: {
        email,
        password: hashedPassword,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        setLogin(true);
        // set the cookie
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });

        // redirect user to the auth page
        window.location.href = "/getPassword";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
    <Form onSubmit={(e) => handleSubmit(e)}>
      {/* email */}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </Form.Group>

      {/* password */}
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </Form.Group>

      {/* submit button */}
      <Button
        variant="primary"
        type="submit"
        onClick={(e) => handleSubmit(e)}
      >
        Login
      </Button>


        {/* display success message */}
        {login ? (
          <p className="text-success">You Are Logged in Successfully</p>
        ) : (
          <p className="text-danger">You Are Not Logged in</p>
        )}

      <Link to="/register" className="home-buttons">
          Don't have an account? Register here.
      </Link>
      </Form>
      </div>
    )
}