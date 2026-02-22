import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function Layout({ children, buildTrackSteps = [] }) {
    const location = useLocation();
    const isBuildTrack = location.pathname.startsWith('/rb');

    // Build Track Logic
    const currentStepIndex = buildTrackSteps.findIndex(s => s.path === location.pathname);
    const currentStep = buildTrackSteps[currentStepIndex] || { id: '??', title: 'Proof' };

    const getBuildTrackStatus = () => {
        if (location.pathname === '/rb/proof') return { label: 'Proof Phase', class: 'status' };

        // Count completed artifacts
        const completedCount = buildTrackSteps.filter((_, i) => !!localStorage.getItem(`rb_step_${i + 1}_artifact`)).length;

        if (completedCount === 8) return { label: 'Shipped', class: 'success' };
        if (completedCount > 0 || currentStepIndex >= 0) return { label: 'In Progress', class: 'warning' };
        return { label: 'Not Started', class: 'status' };
    };

    const buildStatus = getBuildTrackStatus();

    // App Navigation Logic
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Builder', path: '/builder' },
        { label: 'Preview', path: '/preview' },
        { label: 'Proof', path: '/proof' },
    ];

    return (
        <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-color)' }}>
            {/* Top Bar */}
            <nav style={{ height: '64px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', background: '#fff', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', width: '250px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        AI Resume Builder
                    </Link>
                </div>

                {isBuildTrack ? (
                    <>
                        <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
                            PROJECT 3 — STEP {currentStep.id} OF 8
                        </div>
                        <div style={{ width: '250px', display: 'flex', justifyContent: 'flex-end' }}>
                            <span className={`tag ${buildStatus.class}`}>{buildStatus.label}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
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
                                        padding: '21px 0',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div style={{ width: '250px', display: 'flex', justifyContent: 'flex-end' }}>
                            <span className="tag status">Draft Mode</span>
                        </div>
                    </>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="main-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {children}
            </main>

            {/* Proof Footer */}
            <footer style={{ height: '80px', borderTop: '1px solid var(--border-color)', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', gap: 'var(--space-4)', flexShrink: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', width: '180px' }}>
                    VERIFY IT WORKS
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1 }}>
                    <FooterChecklist label="UI Built" checked={!!localStorage.getItem('rb_step_6_artifact')} />
                    <FooterChecklist label="Logic Working" checked={!!localStorage.getItem('rb_step_5_artifact')} />
                    <FooterChecklist label="Test Passed" checked={!!localStorage.getItem('rb_step_7_artifact')} />
                    <FooterChecklist label="Deployed" checked={!!localStorage.getItem('rb_step_8_artifact')} />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="primary" disabled={!isBuildTrack} style={{ padding: '10px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        SUBMIT PHASE PROGRESS <ArrowRight size={18} />
                    </button>
                </div>
            </footer>
        </div>
    );
}

function FooterChecklist({ label, checked }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: checked ? 'var(--success-color)' : '#999', opacity: checked ? 1 : 0.6 }}>
            {checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            <span style={{ fontWeight: 500 }}>{label}</span>
        </div>
    );
}
