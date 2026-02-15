'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-hero)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px',
                boxShadow: 'var(--shadow-xl)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src="/logo.png" alt="Logo" style={{ height: '80px', margin: '0 auto 15px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-dark)' }}>หน้าล็อกอินแอดมิน</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ระบบจัดการเนื้อหา อบจ.บุรีรัมย์</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>อีเมล (Email)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-light)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>รหัสผ่าน (Password)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-light)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: '#e53e3e', fontSize: '0.85rem' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', border: 'none' }}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
            </div>
        </div>
    );
}
