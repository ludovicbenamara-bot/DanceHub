import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronLeft } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/teachers/${id}`)
            .then(res => res.json())
            .then(data => setTeacher(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!teacher) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronLeft size={16} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* Left Column: Details */}
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            background: 'rgba(138, 180, 248, 0.1)',
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            {teacher.styles.join(' • ')}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{teacher.name}</h1>

                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', marginBottom: '24px', color: 'var(--text-muted)' }}>
                        <div className="flex-center" style={{ gap: '4px' }}>
                            <Star size={18} fill="#FFD700" color="#FFD700" />
                            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{teacher.rating}</span>
                            <span>({teacher.reviewsCount} reviews)</span>
                        </div>
                        <div className="flex-center" style={{ gap: '4px' }}>
                            <MapPin size={18} />
                            <span>{teacher.location}</span>
                        </div>
                    </div>

                    <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '32px' }}>
                        <img src={teacher.image} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <section>
                        <h3 style={{ marginBottom: '16px' }}>About Me</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                            {teacher.bio}
                        </p>
                    </section>
                </div>

                {/* Right Column: Booking Card (Sticky) */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'sticky',
                        top: '20px',
                        background: 'var(--bg-card)',
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '24px' }}>
                            <div>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>€{teacher.hourlyRate}</span>
                                <span style={{ color: 'var(--text-muted)' }}>/hour</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setBookingModalOpen(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                        >
                            Book a Lesson
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            100% Satisfaction Guaranteed
                        </p>
                    </div>
                </div>
            </div>

            {bookingModalOpen && (
                <BookingModal
                    teacher={teacher}
                    onClose={() => setBookingModalOpen(false)}
                />
            )}
        </div>
    );
}

function BookingModal({ teacher, onClose }) {
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBook = async () => {
        if (!selectedSlot) return alert('Please select a time');
        setLoading(true);

        const bookingData = {
            teacherId: teacher.id,
            studentName: 'Guest Student', // Mocked user
            date: '2025-10-15', // Mocked date
            time: selectedSlot
        };

        try {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (res.ok) {
                navigate('/dashboard');
            } else {
                alert('Booking failed');
            }
        } catch (e) {
            console.error(e);
            alert('Error booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
            <div style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                width: '90%', maxWidth: '400px'
            }}>
                <h3 style={{ marginBottom: '20px' }}>Book {teacher.name}</h3>

                <p style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>Select a time slot:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    {teacher.availability.map(slot => (
                        <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                                background: selectedSlot === slot ? 'rgba(138, 180, 248, 0.1)' : 'transparent',
                                color: 'var(--text-main)',
                                textAlign: 'left'
                            }}
                        >
                            {slot}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleBook} disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                        {loading ? 'Confirming...' : 'Confirm Payment'}
                    </button>
                    <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
