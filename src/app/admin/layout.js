'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else {
                setUser(user);
            }
            setLoading(false);
        }
        checkUser();
    }, [pathname, router]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div className="shimmer-placeholder" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
        </div>
    );

    if (!user && pathname !== '/admin/login') return null;
    if (pathname === '/admin/login') return <>{children}</>;

    const menuItems = [
        { title: 'แดชบอร์ด', href: '/admin', icon: '📊' },
        { title: 'จัดการข่าวสาร', href: '/admin/news', icon: '📰' },
        { title: 'จัดการกิจกรรม', href: '/admin/activities', icon: '🎨' },
        { title: 'จัดการบุคลากร', href: '/admin/personnel', icon: '👥' },
        { title: 'จัดการจัดซื้อจัดจ้าง', href: '/admin/procurement', icon: '📄' },
        { title: 'จัดการคลังเอกสาร', href: '/admin/documents', icon: '📁' },
        { title: 'ตั้งค่าหน้าเว็บ', href: '/admin/pages', icon: '⚙️' },
    ];

    const handleLogout = async () => {
        if (confirm('ยืนยันออกจากระบบ?')) {
            await supabase.auth.signOut();
            router.push('/admin/login');
        }
    };

    const quickButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 15px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: '0.3s',
        textDecoration: 'none',
        color: 'white'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'linear-gradient(180deg, var(--bru-dark-pearl) 0%, #152252 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
                zIndex: 100,
                overflowY: 'auto'
            }}>
                <div style={{ padding: '35px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src="/logo.png" alt="Logo" style={{ height: '70px', marginBottom: '15px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22c55e',
                            boxShadow: '0 0 10px #22c55e'
                        }}></span>
                        <p style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            ระบบจัดการเนื้อหา (CMS)
                        </p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '25px 15px' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link href={item.href} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '14px 20px',
                                        borderRadius: '12px',
                                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: isActive ? 'var(--electric-gold)' : 'rgba(255,255,255,0.7)',
                                        fontWeight: isActive ? '700' : '500',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {isActive && (
                                            <div style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: '20%',
                                                bottom: '20%',
                                                width: '4px',
                                                background: 'var(--electric-gold)',
                                                borderRadius: '0 4px 4px 0'
                                            }}></div>
                                        )}
                                        <span style={{
                                            fontSize: '1.25rem',
                                            filter: isActive ? 'drop-shadow(0 0 8px var(--electric-gold))' : 'none'
                                        }}>{item.icon}</span>
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        🚪 ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '40px' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <span>หน้าหลัก</span>
                            <span>/</span>
                            <span style={{ color: 'var(--primary-dark)', fontWeight: '600' }}>{menuItems.find(i => i.href === pathname)?.title || 'แอดมิน'}</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--bru-dark-pearl)', letterSpacing: '-0.02em' }}>
                            {menuItems.find(i => i.href === pathname)?.title || 'ระบบจัดการเนื้อหา'}
                        </h1>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        background: 'white',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--gradient-hero)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.8rem'
                        }}>
                            {user.email[0].toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.email.split('@')[0]}</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>ผู้ดูแลระบบ (Admin)</span>
                        </div>
                    </div>
                </header>

                <div style={{
                    minHeight: 'calc(100vh - 200px)',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    {children}
                </div>
            </main>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(41, 64, 157, 0.3);
        }
      `}</style>
        </div>
    );
}
