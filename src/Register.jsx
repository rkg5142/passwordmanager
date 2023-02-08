import React, {useState} from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";


export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [register, setRegister] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "localhost:3000/register",
            data: {
              email,
              pass,
            },
          };
    axios(configuration)
    // make the API call
    .then((result) => {
    setRegister(true);
    })
    .catch((error) => {
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
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
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

                {register ? (
                    <p className="text-success">You Are Registered Successfully</p>
                    ) : (
                    <p className="text-danger">You Are Not Registered</p>
                    )}
            </Form>
        <Button className="link-btn" onClick={() => props.onFormSwitch('login')}> If you already have an account, login here.</Button>
    </div>
    );
}