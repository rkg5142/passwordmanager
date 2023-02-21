import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Link, NavLink, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./PrivateRoute";

const cookies = new Cookies();

export default function PasswordForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = cookies.get("TOKEN");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post(
        "/savePassword",
        { name, url, password },
        config
      )
      .then((response) => {
        setMessage(response.data.message);
        setError("");
      })
      .catch((error) => {
        setMessage("");
        setError(error.response.data.message);
      });
  };

  return (
    <>
      <Link to="/getPassword" className="get-password-link">
        View existing passwords
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
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit">Save Password</Button>
          </Form>
    </>
  );
}
