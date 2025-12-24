import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Search() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const style = searchParams.get('style');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                let url = `${API_URL}/teachers?`;
                if (q) url += `query=${q}&`;
                if (style) url += `style=${style}&`;

                const res = await fetch(url);
                const data = await res.json();
                setTeachers(data);
            } catch (err) {
                console.error("Failed to fetch", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [q, style]);

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
                {style ? `${style} Teachers` : 'Find your teacher'}
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid-teachers">
                    {teachers.map(teacher => (
                        <div key={teacher.id} style={{
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img src={teacher.image} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{teacher.name}</h3>
                                    <div className="flex-center" style={{ color: '#FFD700', gap: '4px' }}>
                                        <Star size={16} fill="#FFD700" />
                                        <span>{teacher.rating}</span>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                                    {teacher.styles.join(', ')}
                                </p>

                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    <MapPin size={16} />
                                    <span>{teacher.location}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>€{teacher.hourlyRate}/h</span>
                                    <a href={`/teacher/${teacher.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        View Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
