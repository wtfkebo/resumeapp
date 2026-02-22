import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const STEPS = [
    { id: '01', title: 'Problem', path: '/rb/01-problem' },
    { id: '02', title: 'Market', path: '/rb/02-market' },
    { id: '03', title: 'Architecture', path: '/rb/03-architecture' },
    { id: '04', title: 'HLD', path: '/rb/04-hld' },
    { id: '05', title: 'LLD', path: '/rb/05-lld' },
    { id: '06', title: 'Build', path: '/rb/06-build' },
    { id: '07', title: 'Test', path: '/rb/07-test' },
    { id: '08', title: 'Ship', path: '/rb/08-ship' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const currentStepIndex = STEPS.findIndex(s => s.path === location.pathname);
    const currentStep = STEPS[currentStepIndex] || { id: '??', title: 'Proof' };

    // Logic to determine project status
    const getStatus = () => {
        if (location.pathname === '/rb/proof') return { label: 'Proof Phase', class: 'status' };
        if (currentStepIndex === 7) return { label: 'Finalizing', class: 'warning' };
        if (currentStepIndex >= 0) return { label: 'In Progress', class: 'warning' };
        return { label: 'Not Started', class: 'status' };
    };

    const status = getStatus();

    return (
        <div className="layout-container">
            {/* Top Bar */}
            <nav style={{ height: '64px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 var(--space-3)', background: '#fff' }}>
                <div style={{ flex: 1, fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-color)' }}>■</span> AI Resume Builder
                </div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Project 3 — Step {currentStep.id} of 8
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <span className={`tag ${status.class}`}>{status.label}</span>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="main-container">
                {children}
            </main>

            {/* Proof Footer */}
            <footer style={{ height: '80px', borderTop: '1px solid var(--border-color)', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 var(--space-4)', gap: 'var(--space-4)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Verification Progress
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <FooterChecklist label="UI Built" checked={false} />
                    <FooterChecklist label="Logic Working" checked={false} />
                    <FooterChecklist label="Test Passed" checked={false} />
                    <FooterChecklist label="Deployed" checked={false} />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="primary" disabled style={{ padding: '8px 16px', fontSize: '14px' }}>
                        Submit Phase Progress <ArrowRight size={16} />
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
