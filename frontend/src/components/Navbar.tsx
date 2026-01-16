import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">📊</span>
                    <span className="brand-text">Trade Diary</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/trades"
                        className={`nav-link ${isActive('/trades') ? 'active' : ''}`}
                    >
                        İşlemler
                    </Link>
                    <Link
                        to="/trades/new"
                        className={`nav-link ${isActive('/trades/new') ? 'active' : ''}`}
                    >
                        Yeni İşlem
                    </Link>
                    <Link
                        to="/analytics"
                        className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        Analiz
                    </Link>
                    <Link
                        to="/import"
                        className={`nav-link ${isActive('/import') ? 'active' : ''}`}
                    >
                        Import
                    </Link>
                </div>

                <div className="navbar-user">
                    <span className="user-name">👤 {user?.username}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Çıkış
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
