import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { DANCE_STYLES } from '../constants/danceStyles';

export default function Home() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="container">
            <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-md)', lineHeight: 1.2 }}>
                    Find the perfect <br />
                    <span style={{ color: 'var(--primary)' }}>Dance Teacher</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: 'var(--spacing-xl)' }}>
                    Connect with professional instructors for Salsa, Hip-Hop, Ballet and more.
                    Book lessons instantly.
                </p>

                <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <SearchIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />

                    <div style={{ position: 'relative', width: '100%' }}>
                        <select
                            className="input"
                            style={{
                                paddingLeft: '48px',
                                height: '56px',
                                borderRadius: 'var(--radius-full)',
                                appearance: 'none',
                                cursor: 'pointer',
                                background: 'rgba(30, 30, 30, 0.6) url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\') no-repeat right 24px center', // Custom arrow,
                                backgroundSize: '12px',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'var(--text-main)'
                            }}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        >
                            <option value="" disabled>Select a dance style (e.g. Salsa)</option>
                            {DANCE_STYLES.map(style => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{
                        position: 'absolute',
                        right: '6px',
                        top: '6px',
                        height: '44px',
                        padding: '0 24px'
                    }}>
                        Search
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Popular Styles</h3>
                <div className="flex-center" style={{ gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    {['Salsa', 'Hip-hop', 'Ballet', 'Bachata', 'Tango'].map(style => (
                        <button key={style} onClick={() => navigate(`/search?style=${style}`)} className="btn btn-outline" style={{ minWidth: '100px' }}>
                            {style}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
