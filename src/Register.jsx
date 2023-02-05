import React, {useState} from "react";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);

    }
    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input value={name} name="name" id="name" placeholder="Full Name" />
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" id="email" name="email" />
                <label htmlFor="email">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)}input type="password" placeholder="Enter Password" id="password" name="password" />
                <button type="submit">Login</button>
            </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}> If you do not have an account, register here.</button>
    </div>
    )
}