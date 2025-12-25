
import React, { useState, useEffect } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import stripePromise from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, Lock, CreditCard } from 'lucide-react';

const CheckoutForm = ({ teacher, user, date, time, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is required but we handle logic via redirect: 'if_required' usually
                // For this custom flow, we might strictly rely on hook response.
                // NOTE: 'redirect: if_required' is the default for PaymentElement in some configurations.
                // Let's set a fake redirect for safety, or handle it manually.
                return_url: window.location.origin + '/dashboard',
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment success! Now create booking
            console.log('Payment succeeded:', paymentIntent.id);
            await createBookingInSupabase(paymentIntent.id);
        } else {
            setMessage("Unexpected payment status.");
            setIsProcessing(false);
        }
    };

    const createBookingInSupabase = async (paymentId) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .insert([
                    {
                        teacher_id: teacher.id,
                        student_id: user.id,
                        date: date,
                        time: time,
                        status: 'confirmed',
                        // payment_id: paymentId // TODO: Add column if we want to store it
                    }
                ]);

            if (error) throw error;
            onSuccess(); // Close modal and show success logic
        } catch (err) {
            console.error('Booking Error after Payment:', err);
            setMessage('Payment succeeded but booking failed. Please contact support.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {message && <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>{message}</div>}

            <button
                disabled={isProcessing || !stripe || !elements}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
                {isProcessing ? 'Processing...' : (
                    <>
                        <Lock size={16} /> Pay €{teacher.hourly_rate} & Book
                    </>
                )}
            </button>
        </form>
    );
};

export default function BookingModal({ teacher, user, onClose, onBookingSuccess }) {
    const [clientSecret, setClientSecret] = useState('');
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Payment
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    // 1. Fetch Payment Intent when entering Step 2
    useEffect(() => {
        if (step === 2 && teacher.hourly_rate) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Convert EUR to cents for Stripe
                body: JSON.stringify({ amount: Math.round(teacher.hourly_rate * 100) }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [step, teacher.hourly_rate]);

    const handleNext = () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select date and time");
            return;
        }
        setStep(2);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    ×
                </button>

                {step === 1 ? (
                    <>
                        <h2 style={{ marginBottom: '24px' }}>Select a Slot</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Time</label>
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
                                                color: '#fff', cursor: 'pointer'
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%' }}>
                                Proceed to Payment
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CreditCard /> Payment
                        </h2>
                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ff446b' } } }}>
                                <CheckoutForm
                                    teacher={teacher}
                                    user={user}
                                    date={selectedDate}
                                    time={selectedTime}
                                    onSuccess={onBookingSuccess}
                                    onCancel={onClose}
                                />
                            </Elements>
                        ) : (
                            <div className="flex-center" style={{ padding: '40px' }}>Loading Secure Payment...</div>
                        )}
                        <button onClick={() => setStep(1)} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                            &larr; Back to slots
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
