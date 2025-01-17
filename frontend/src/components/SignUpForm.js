import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {

    //persistence and navigation
    const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', password: '' });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/signup', formData);
            setMessage(response.data.message || 'Sign up successful');
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error || 'An error occurred');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div id="signup">
            
            <div id="signup-form">
                <h2>Hello! We are excited for you to make Smart Cents!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Set Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        Show Password
                    </label>
                    <button type="submit">Sign Up</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
