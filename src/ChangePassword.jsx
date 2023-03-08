import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { hashPassword } from "./crypto.js";
import Cookies from "universal-cookie";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { decryptData, encryptData } from "./crypto.js";
import { generateKey } from "./crypto";
import pbkdf2 from "crypto-js/pbkdf2";

const cookies = new Cookies();

export default function ChangePassword() {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Hash the passwords before sending them to the server
        const hashedCurrentPassword = hashPassword(currentPassword);
        const hashedNewPassword = hashPassword(newPassword);

        const token = cookies.get("TOKEN");

        // First, retrieve the encrypted secrets from the server
        const secretsConfig = {
            method: "get",
            url: "/getAllPasswords",
            headers: { Authorization: `Bearer ${token}` },
        };
        const secretsResponse = await axios(secretsConfig);

        const currentKey = localStorage.getItem("KEY").toString();
        console.log(currentKey);
        // Then, decrypt the secrets using the old password
        const decryptedSecrets = [];
        for (let i = 0; i < secretsResponse.data.length; i++) {
          const secret = secretsResponse.data[i];
          console.log(secretsResponse.data[0]);
          const bytes = CryptoJS.AES.decrypt(secret.password, currentKey);
          const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
          decryptedSecrets.push({
            ...secret,
            password: decryptedPassword,
          });
        }
        console.log(decryptedSecrets);

        // Next, update the password for the user
        const passwordConfig = {
            method: "put",
            url: "/changePassword",
            headers: { Authorization: `Bearer ${token}` },
            data: {
                email,
                hashedCurrentPassword,
                hashedNewPassword,
            },
        };
        await axios(passwordConfig);

        const salt = CryptoJS.enc.Hex.parse("aabbccddeeff00112233445566778899");
        console.log(newPassword);

        function generateKey({ email, hashedNewPassword, salt }) {
            return pbkdf2(`${email}:${hashedNewPassword}`, salt, {
              keySize: 32,
            }).toString();
          }
         // Derive a decryption key from the user's password using PBKDF2
        const key = generateKey({email, hashedNewPassword, salt});
        console.log(email);
        console.log(hashedNewPassword);
        console.log(salt);
        console.log('key:', key);

        // // Store the decryption key in localStorage
        localStorage.setItem("KEY", key);
        console.log(localStorage.setItem("KEY", key));

        // Finally, re-encrypt the secrets using the new password
        const encryptedSecrets = decryptedSecrets.map((secret) => ({
            ...secret,
            password: CryptoJS.AES.encrypt(secret.password, key).toString(),
        }));



        // Send the updated secrets back to the server
        const updatedSecretsConfig = {
            method: "put",
            url: "/reencryptPasswords",
            headers: { 
                Authorization: `Bearer ${token}`},
            data: encryptedSecrets,
        };
        console.log(updatedSecretsConfig.data);
        await axios(updatedSecretsConfig);

        

        setPasswordChanged(true);
    };

    return (
        <>
            <Link to="/getPassword" className="get-password-link">
                View existing passwords
            </Link>
            <LogoutButton />
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

                <Form.Group controlId="formBasicCurrentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter Current Password"
                    />
                </Form.Group>

                <Form.Group controlId="formBasicNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter New Password"
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                >
                    Change Password
                </Button>

                {/* display success message */}
                {passwordChanged ? (
                    <p className="text-success">Your Password Has Been Changed</p>
                ) : (
                    <p className="text-danger">Your Password Has Not Been Changed</p>
                )}
            </Form>
        </>
    );
}