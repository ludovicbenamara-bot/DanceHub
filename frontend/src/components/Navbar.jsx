import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';

export default function Navbar() {
    return (
        <nav style={{
            padding: 'var(--spacing-md) 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: 'var(--spacing-lg)'
        }}>
            <div className="container flex-center" style={{ justifyContent: 'space-between' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    Dance<span style={{ color: 'var(--primary)' }}>Hub</span>
                </Link>

                <div className="flex-center" style={{ gap: 'var(--spacing-md)' }}>
                    <Link to="/search" style={{ color: 'var(--text-muted)' }}>Find a Teacher</Link>
                    <Link to="/login" className="btn btn-outline flex-center" style={{ gap: 'var(--spacing-sm)', padding: '8px 16px' }}>
                        <User size={18} />
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
