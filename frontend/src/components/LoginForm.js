import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ setToken }) => {
    //persistence and vaigation
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            const token = response.data.token;
            setToken(token);
            localStorage.setItem('token', token);
            setMessage('Login successful');

            // Decode the token to extract the userId
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user_id; // JWT including 'user_id'

            // navigate to account page and successful login
            navigate(`/account/${username}`);
        } catch (error) {
            setMessage('Invalid username or password');
        }
    };

    return (
        <div id="login">
            <div id="login-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginForm;