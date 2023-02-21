import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";

const cookies = new Cookies();

export default function PasswordForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = cookies.get("TOKEN");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(token)
    axios
      .post(
        "/getPassword",
        { name },
        config
      )
      .then((response) => {
        setPassword(response.data.password);
        setMessage("");
        setError("");
      })
      .catch((error) => {
        setPassword("");
        setMessage("");
        setError(error.response.data.message);
      });
  };

  return (
    <>
      <div className="get-password">
      <Link to="/savePassword" className="save-password-link">
        Save a new password
      </Link>
      <Form onSubmit={handleSubmit}>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            value={password}
            readOnly
            required
          />
        </Form.Group>

        <Button type="submit">Get Password</Button>
      </Form>
    </div> 
    </>
  );
}