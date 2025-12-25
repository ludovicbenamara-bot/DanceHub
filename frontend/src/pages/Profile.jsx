import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, CheckCircle, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user for booking
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking State
    const [showBooking, setShowBooking] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingStatus, setBookingStatus] = useState('idle'); // idle, submitting, success, error

    useEffect(() => {
        const fetchTeacher = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setTeacher(data);
            } catch (err) {
                console.error("Error fetching teacher:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTeacher();
    }, [id]);

    const handleBookLesson = async () => {
        if (!user) {
            alert('You must be logged in to book a lesson.');
            navigate('/login');
            return;
        }
        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time.');
            return;
        }

        setBookingStatus('submitting');
        try {
            const { error } = await supabase
                .from('bookings')
                .insert([
                    {
                        teacher_id: teacher.id,
                        student_id: user.id,
                        date: selectedDate,
                        time: selectedTime,
                        status: 'confirmed'
                    }
                ]);

            if (error) throw error;

            setBookingStatus('success');
            setTimeout(() => {
                setShowBooking(false);
                setBookingStatus('idle');
                setSelectedDate('');
                setSelectedTime('');
                alert('Booking confirmed! Check your dashboard.');
            }, 1000);

        } catch (err) {
            console.error('Booking error:', err);
            setBookingStatus('error');
            alert('Failed to book: ' + err.message);
        }
    };

    if (loading) return <div className="container flex-center" style={{ height: '50vh' }}>Loading...</div>;
    if (!teacher) return <div className="container flex-center" style={{ height: '50vh' }}>Teacher not found.</div>;

    // Generate simple time slots
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            {/* Header / Cover */}
            <div style={{
                height: '300px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <img
                    src={teacher.image_url || 'https://via.placeholder.com/800x400'}
                    alt={teacher.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '40px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>{teacher.name}</h1>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', color: 'var(--text-muted)' }}>
                        <span className="flex-center" style={{ gap: '6px' }}>
                            <MapPin size={20} /> {teacher.location}
                        </span>
                        <span className="flex-center" style={{ gap: '6px', color: '#FFD700' }}>
                            <Star size={20} fill="#FFD700" /> {teacher.rating || 'New'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                {/* Left Column: Bio & Reviews */}
                <div>
                    <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }}>
                        <h2 style={{ marginBottom: '16px' }}>About Me</h2>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            {teacher.bio}
                        </p>

                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Styles</h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {teacher.styles && teacher.styles.map(style => (
                                    <span key={style} style={{
                                        padding: '8px 16px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        {style}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Card */}
                <div>
                    <div className="glass-card" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Hourly Rate</span>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>€{teacher.hourly_rate}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginBottom: '16px' }}
                            onClick={() => setShowBooking(true)}
                        >
                            Book a Lesson
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <div className="flex-center" style={{ gap: '8px', justifyContent: 'flex-start' }}>
                                <CheckCircle size={16} /> <span>Secure Payment</span>
                            </div>
                            <div className="flex-center" style={{ gap: '8px', justifyContent: 'flex-start' }}>
                                <CheckCircle size={16} /> <span>Verified Teacher</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REAL Booking Modal */}
            {showBooking && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
                        <button
                            onClick={() => setShowBooking(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                        <h2 style={{ marginBottom: '24px' }}>Select a Date</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Date Picker */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="date"
                                        className="input"
                                        style={{ paddingLeft: '40px' }}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Time Slot</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: selectedTime === slot ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                background: selectedTime === slot ? 'rgba(255, 68, 107, 0.2)' : 'rgba(255,255,255,0.05)',
                                                color: '#fff',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleBookLesson}
                                className="btn btn-primary"
                                style={{ marginTop: '10px', width: '100%', position: 'relative' }}
                                disabled={bookingStatus === 'submitting'}
                            >
                                {bookingStatus === 'submitting' ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
