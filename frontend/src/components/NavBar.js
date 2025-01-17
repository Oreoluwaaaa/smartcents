import React from 'react';
import { Link } from 'react-router-dom';

//navbar
const NavBar = () => {
    return (
        <nav className="nav-bar">
            <div className="nav-logo">
                <img id="navpng" src="/navBar.png"></img>
                <img id="navtpng" src="/navtext.png"/>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/invest">Invest</Link></li>
                
            </ul>
        </nav>
    );
};

export default NavBar;
