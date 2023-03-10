import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { hashPassword } from "./crypto.js";
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    console.log(configuration);
    axios(configuration)
      // make the API call
      .then((result) => {
        setRegister(true);
        window.location.href = "/login";
      })
      .catch((error) => {
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

        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </Button>

        {/* display success message */}
        {register ? (
          <p className="text-success">You Are Registered Successfully</p>
        ) : (
          <p className="text-danger">You Are Not Registered</p>
        )}

      <Link to="/login" className="home-buttons">
          Already have an account? Login here.
      </Link>
      </Form>
    </div>
  );
}