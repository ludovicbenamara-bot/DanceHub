import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;

            try {
                // Fetch bookings for this student, and join with teachers table to get names
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        teachers (
                            name,
                            image_url,
                            location
                        )
                    `)
                    .eq('student_id', user.id)
                    .order('date', { ascending: true });

                if (error) throw error;
                console.log('Bookings loaded:', data); // DEBUG
                setBookings(data || []);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setFetchError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    if (loading) return <div className="container flex-center" style={{ height: '50vh' }}>Loading dashboard...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>Student Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.email?.split('@')[0]}</p>
                </div>
                <button onClick={handleSignOut} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                    Sign Out
                </button>
            </div>

            <div style={{ display: 'grid', gap: '30px' }}>
                {/* Stats / Quick Actions Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
                            Want to teach by yourself? Create your profile.
                        </p>
                        <button onClick={() => navigate('/teacher/edit')} className="btn btn-primary" style={{ width: '100%' }}>
                            Become a Teacher
                        </button>
                    </div>
                </div>

                {/* Upcoming Bookings Section */}
                <div>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        Your Bookings
                    </h2>

                    {bookings.length === 0 ? (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You have no upcoming lessons.</p>
                            <button onClick={() => navigate('/search')} className="btn btn-primary">Book your first lesson</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} className="glass-card" style={{
                                    padding: '20px',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                        }}>
                                            {new Date(booking.date).getDate()}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                                                {booking.teachers?.name ? `Lesson with ${booking.teachers.name}` : 'Dance Lesson'}
                                            </h4>
                                            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={14} /> {booking.time}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={14} /> {booking.teachers?.location || 'Online'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: booking.status === 'confirmed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                        color: booking.status === 'confirmed' ? '#81c784' : '#ffd54f'
                                    }}>
                                        {booking.status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
