import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ handleLogout }) {

    return (
        <header className='header'>
            <h2>AdBounty</h2>
            <nav>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/profile'>Profile</Link>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </header>
    );
}

export default Header;
