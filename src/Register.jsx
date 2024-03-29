import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { hashPassword } from "./crypto.js";
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegisterSuccess(false);
      setRegisterError(true);
      return;
    }

    // Hash the password before sending it to the server
    const hashedPassword = hashPassword(password);

    const configuration = {
      method: "post",
      url: "/register",
      data: {
        email,
        hashedPassword,
      },
    };
    console.log('email: ', email, 'password: ', hashedPassword);
    axios(configuration)
      // make the API call
      .then((result) => {
        setRegisterSuccess(true);
        setRegisterError(false);
        window.location.href = "/login";
      })
      .catch((error) => {
        setRegisterSuccess(false);
        setRegisterError(true);
        console.error(error);
        error = new Error();
      });
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </Form.Group>

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={!email || !password || !confirmPassword}
        >
          Register
        </Button>

        {/* display success message */}
        {registerSuccess && (
          <p className="text-success">You are registered successfully</p>
        )}

        {/* display error message */}
        {registerError && (
          <p className="text-danger">
            There was an issue during registration
          </p>
        )}

        <Link to="/login" className="home-buttons">
          Already have an account? Login here.
        </Link>
      </Form>
    </div>
  );
}

