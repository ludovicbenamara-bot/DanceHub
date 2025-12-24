import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/my-bookings`)
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginBottom: '24px' }}>My Dashboard</h2>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr' }}>
                <section>
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
