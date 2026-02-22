import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function Layout({ children, buildTrackSteps = [] }) {
    const location = useLocation();
    const isBuildTrack = location.pathname.startsWith('/rb');

    // Build Track Navigation Logic
    const currentStepIndex = buildTrackSteps.findIndex(s => s.path === location.pathname);
    const currentStep = buildTrackSteps[currentStepIndex] || { id: '??', title: 'Proof' };

    const getBuildTrackStatus = () => {
        if (location.pathname === '/rb/proof') return { label: 'Proof Phase', class: 'status' };
        if (currentStepIndex === 7) return { label: 'Finalizing', class: 'warning' };
        if (currentStepIndex >= 0) return { label: 'In Progress', class: 'warning' };
        return { label: 'Not Started', class: 'status' };
    };

    const buildTrackStatus = getBuildTrackStatus();

    // App Navigation Logic
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Builder', path: '/builder' },
        { label: 'Preview', path: '/preview' },
        { label: 'Proof', path: '/proof' },
    ];

    return (
        <div className="layout-container">
            {/* Top Bar */}
            <nav style={{ height: '64px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', background: '#fff' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'var(--space-5)' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--accent-color)' }}>■</span> AI Resume Builder
                    </Link>
                </div>

                {isBuildTrack ? (
                    <>
                        <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Build Track — Step {currentStep.id} of 8
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                            <span className={`tag ${buildTrackStatus.class}`}>{buildTrackStatus.label}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            {navItems.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        borderBottom: location.pathname === item.path ? '2px solid var(--text-primary)' : '2px solid transparent',
                                        padding: '20px 0'
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <span className="tag status">Draft Mode</span>
                        </div>
                    </>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="main-container">
                {children}
            </main>

            {/* Proof Footer */}
            <footer style={{ height: '80px', borderTop: '1px solid var(--border-color)', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', gap: 'var(--space-4)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {isBuildTrack ? 'Build Verification' : 'App Status'}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <FooterChecklist label="UI Built" checked={false} />
                    <FooterChecklist label="Logic Working" checked={false} />
                    <FooterChecklist label="Test Passed" checked={false} />
                    <FooterChecklist label="Deployed" checked={false} />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="primary" disabled style={{ padding: '8px 16px', fontSize: '14px' }}>
                        {isBuildTrack ? 'Lock Phase' : 'Sync Progress'} <ArrowRight size={16} />
                    </button>
                </div>
            </footer>
        </div>
    );
}

function FooterChecklist({ label, checked }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: checked ? 'var(--success-color)' : 'var(--text-secondary)' }}>
            {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            <span>{label}</span>
        </div>
    );
}
