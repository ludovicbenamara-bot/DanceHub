
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DANCE_STYLES } from '../constants/danceStyles';
import { Save, Loader } from 'lucide-react';

export default function TeacherEditor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        hourly_rate: 30, // snake_case to match DB
        location: '',
        styles: [],
        image_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600'
    });

    // Fetch existing profile
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFormData({
                        name: data.name,
                        bio: data.bio || '',
                        hourly_rate: data.hourly_rate || 30,
                        location: data.location || '',
                        styles: data.styles || [],
                        image_url: data.image_url || formData.image_url
                    });
                } else if (user.user_metadata?.full_name) {
                    // Pre-fill from Auth if no profile yet
                    setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }));
                }
                setFetching(false);
            };

            fetchProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStyleToggle = (style) => {
        setFormData(prev => {
            const exists = prev.styles.includes(style);
            if (exists) {
                return { ...prev, styles: prev.styles.filter(s => s !== style) };
            } else {
                return { ...prev, styles: [...prev.styles, style] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates = {
                id: user.id,
                name: formData.name,
                bio: formData.bio,
                hourly_rate: parseFloat(formData.hourly_rate),
                location: formData.location,
                styles: formData.styles,
                image_url: formData.image_url,
                // updated_at: new Date() // handled by DB triggers usually, or ignore for now
            };

            const { error } = await supabase
                .from('teachers')
                .upsert(updates);

            if (error) throw error;

            alert('Profile Saved Successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Error saving profile: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
            alert('Image uploaded successfully!');
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (fetching) return <div className="container flex-center" style={{ height: '50vh' }}>Loading profile...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                    Teacher Profile
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Image Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            marginBottom: '16px',
                            border: '4px solid var(--primary)',
                            background: 'rgba(0,0,0,0.3)'
                        }}>
                            <img
                                src={formData.image_url}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                            <button type="button" className="btn btn-outline" disabled={uploading} style={{ pointerEvents: 'none' }}>
                                {uploading ? 'Uploading...' : 'Change Photo'}
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    opacity: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                    pointerEvents: 'all'
                                }}
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Display Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="input" required placeholder="e.g. Alex Dancer" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Hourly Rate (€)</label>
                            <input name="hourly_rate" type="number" value={formData.hourly_rate} onChange={handleChange} className="input" required />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} className="input" required placeholder="e.g. Paris, France (or Online)" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="input"
                            rows={4}
                            required
                            placeholder="Tell students about your experience..."
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    {/* Styles Multi-Select */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>Dance Styles (Select all that apply)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                            {DANCE_STYLES.map(style => (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => handleStyleToggle(style)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 'var(--radius-full)',
                                        border: formData.styles.includes(style) ? '1px solid var(--primary)' : '1px solid var(--border)',
                                        background: formData.styles.includes(style) ? 'var(--primary)' : 'transparent',
                                        color: formData.styles.includes(style) ? '#000' : 'var(--text-muted)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary flex-center" disabled={loading} style={{ gap: '8px', padding: '16px' }}>
                        {loading ? <Loader className="spin" size={20} /> : <Save size={20} />}
                        <span>Save Profile</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
