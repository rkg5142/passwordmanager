import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import CryptoJS from "crypto-js";

const cookies = new Cookies();

export default function PasswordForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = cookies.get("TOKEN");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const key = localStorage.getItem("KEY").toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
    const encryptedMemo = CryptoJS.AES.encrypt(memo, key).toString();
    console.log({ name, userName, url, password: encryptedPassword, memo: encryptedMemo });
    axios
      .post(
        "/savePassword",
        { name, userName, url, password: encryptedPassword, memo: encryptedMemo },
        config
      )
      .then((response) => {
        setMessage(response.data.message);
        setError("");
        setSuccess(true);
      })
      .catch((error) => {
        setMessage("");
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while saving the password.");
        }
      });
  };

  return (
    <>
      <div className="auth-form-container">
      <h2>Save Password</h2>
      <Link to="/getPassword" className="get-password-link">
        View existing passwords
      </Link>
      <Link to="/changePassword" className="change-password-link">
        Change Password
      </Link>
      <LogoutButton />
      <Form onSubmit={handleSubmit}>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Password saved successfully!</Alert>}
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
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Memo</Form.Label>
          <Form.Control
            type="memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Save Password</Button>
      </Form>
      </div>
    </>
  );
}
