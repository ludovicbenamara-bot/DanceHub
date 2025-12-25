import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/my-bookings`)
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>My Dashboard</h2>
                {user && (
                    <button onClick={() => { signOut(); navigate('/'); }} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                        Logout ({user.email})
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Helper Card for Teachers */}
                <div className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #fff' }}>
                    <h3 style={{ marginBottom: '12px' }}>Find a Lesson</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Browse our community of teachers and find your perfect match.
                    </p>
                    <button onClick={() => navigate('/search')} className="btn btn-outline" style={{ width: '100%' }}>
                        Search Teachers
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '12px' }}>Teacher Profile</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Want to teach? Create your profile to be listed in the search.
                    </p>
                    <button onClick={() => navigate('/teacher/edit')} className="btn btn-primary" style={{ width: '100%' }}>
                        Edit / Create Profile
                    </button>
                </div>

                <section style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Upcoming Lessons</h3>

                    {bookings.length === 0 ? (
                        <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <p>No bookings yet. <a href="/search" style={{ color: 'var(--primary)' }}>Find a teacher</a></p>
                        </div>
                    ) : (
                        bookings.map(booking => (
                            <div key={booking.id} style={{
                                background: 'var(--bg-card)',
                                padding: '20px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Lesson with Teacher (ID: {booking.teacherId})</h4>
                                    <p style={{ color: 'var(--text-muted)' }}>{booking.date} at {booking.time}</p>
                                </div>
                                <div>
                                    <span style={{
                                        background: '#E6F4EA',
                                        color: '#1E8E3E',
                                        padding: '6px 12px',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}
