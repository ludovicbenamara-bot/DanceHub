import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const styleQuery = searchParams.get('style');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                let dbQuery = supabase.from('teachers').select('*');

                // Filter by text (Name or Bio)
                if (query) {
                    dbQuery = dbQuery.or(`name.ilike.%${query}%,bio.ilike.%${query}%`);
                }

                // Filter by Style (Array contains)
                if (styleQuery) {
                    dbQuery = dbQuery.contains('styles', [styleQuery]);
                }

                // CRITICAL FIX: await the query result!
                const { data, error } = await dbQuery;

                if (error) throw error;
                setTeachers(data || []);
            } catch (err) {
                console.error('Error fetching teachers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [query, styleQuery]);

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
                {styleQuery ? `${styleQuery} Teachers` : 'Find your teacher'}
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : teachers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: '16px' }}>No teachers found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        We couldn't find any teachers matching your criteria. Try adjusting your search or view all teachers.
                    </p>
                    <Link to="/search" className="btn btn-outline">
                        Show All Teachers
                    </Link>
                </div>
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
                                <img src={teacher.image_url || 'https://via.placeholder.com/300'} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{teacher.name}</h3>
                                    <div className="flex-center" style={{ color: '#FFD700', gap: '4px' }}>
                                        <Star size={16} fill="#FFD700" />
                                        <span>{teacher.rating || 'New'}</span>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                                    {teacher.styles ? teacher.styles.join(', ') : ''}
                                </p>

                                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    <MapPin size={16} />
                                    <span>{teacher.location}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>€{teacher.hourly_rate}/h</span>
                                    <Link to={`/teacher/${teacher.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
