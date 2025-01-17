import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import AccountPage from './components/AccountPage';
import InvestmentPage from './components/InvestmentPage';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // If the token is present, decode it and set username
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.username); // Ensure your token contains 'username'
            } catch (error) {
                console.error('Invalid token:', error);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
    }, [token]);

    return (
        <Router>
            <div className="App">
                <NavBar />
                <Routes>
                
                <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm setToken={setToken} />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route
                        path="/account/:username"
                        element={token ? <AccountPage username={username} /> : <Navigate to="/login" />}
                    />
                    <Route path="/invest" element={<InvestmentPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;