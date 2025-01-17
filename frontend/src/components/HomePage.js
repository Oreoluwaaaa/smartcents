import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//homepage
const HomePage = () => {
    return (
        <div className="home-page">
            <div className="logo-container">
                <img src="/logo.png" alt="Smart Cents Logo" className="logo" />
            </div>
            <div className="home-buttons">
                    <Link to="/signup" className="home-button">Sign Up</Link>
                    <Link to="/login" className="home-button">Login</Link>
            </div>
        </div>
    );
};

export default HomePage;
