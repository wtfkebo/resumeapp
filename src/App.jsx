import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { Clipboard, ExternalLink, CheckCircle, AlertCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';

const STEPS = [
    { id: '01', title: 'Problem Discovery', path: '/rb/01-problem', prompt: 'Analyze the current resume building landscape and identify top 3 friction points.' },
    { id: '02', title: 'Market Analysis', path: '/rb/02-market', prompt: 'Define the target persona and competitive advantages of an AI-first builder.' },
    { id: '03', title: 'Architecture Design', path: '/rb/03-architecture', prompt: 'Outline the modular architecture: Extraction, Generation, and Formatting layers.' },
    { id: '04', title: 'High-Level Design', path: '/rb/04-hld', prompt: 'Create the system context diagram and API boundary definitions.' },
    { id: '05', title: 'Low-Level Design', path: '/rb/05-lld', prompt: 'Define the schema for Resume data and the prompt engineering strategy.' },
    { id: '06', title: 'Build Core Engine', path: '/rb/06-build', prompt: 'Implement the React frontend with the defined design system tokens.' },
    { id: '07', title: 'Test & Validate', path: '/rb/07-test', prompt: 'Execute end-to-end tests for resume generation and export functionality.' },
    { id: '08', title: 'Ship & Deploy', path: '/rb/08-ship', prompt: 'Configure CI/CD pipeline and deploy to production environment.' },
];

function StepPage() {
    const { stepId } = useParams();
    const navigate = useNavigate();
    const stepIndex = STEPS.findIndex(s => s.path.includes(stepId));
    const step = STEPS[stepIndex];

    const artifactKey = `rb_step_${stepIndex + 1}_artifact`;
    const [artifact, setArtifact] = useState(localStorage.getItem(artifactKey));
    const [status, setStatus] = useState(artifact ? 'success' : 'idle');

    useEffect(() => {
        setArtifact(localStorage.getItem(artifactKey));
        setStatus(localStorage.getItem(artifactKey) ? 'success' : 'idle');
    }, [stepId]);

    const handleUpload = () => {
        const dummyArtifact = `artifact_binary_data_${Date.now()}`;
        localStorage.setItem(artifactKey, dummyArtifact);
        setArtifact(dummyArtifact);
        setStatus('success');
    };

    const handleError = () => setStatus('error');

    const handleNext = () => {
        if (stepIndex < STEPS.length - 1) {
            navigate(STEPS[stepIndex + 1].path);
        } else {
            navigate('/rb/proof');
        }
    };

    if (!step) return <Navigate to="/rb/01-problem" />;

    // Gating: check if previous step has artifact
    if (stepIndex > 0) {
        const prevArtifact = localStorage.getItem(`rb_step_${stepIndex}_artifact`);
        if (!prevArtifact) {
            return (
                <div className="workspace" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h2 className="serif">Access Restricted</h2>
                    <p>Please complete the previous step ({STEPS[stepIndex - 1].title}) before proceeding.</p>
                    <button className="primary" onClick={() => navigate(STEPS[stepIndex - 1].path)}>Back to Step {STEPS[stepIndex].id}</button>
                </div>
            );
        }
    }

    return (
        <>
            <div className="workspace">
                <header style={{ marginBottom: 'var(--space-4)' }}>
                    <div className="tag status" style={{ marginBottom: 'var(--space-2)' }}>Step {step.id}</div>
                    <h1 className="serif">{step.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                        Focus on defining the core parameters for this phase. Ensure all requirements are documented before moving to the build panel.
                    </p>
                </header >

                <div className="card">
                    <h3 className="serif">Workspace Area</h3>
                    <div style={{ height: '300px', background: '#f9f9f9', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        Main Interaction Layer for {step.title}
                    </div>
                </div>
            </div >

            <div className="side-panel">
                <h3 className="serif" style={{ marginBottom: 'var(--space-2)' }}>Build Panel</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                    Copy the prompt below into Lovable to generate the required infrastructure for this step.
                </p>

                <div style={{ marginBottom: 'var(--space-3)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Lovable Prompt</label>
                    <textarea
                        readOnly
                        value={step.prompt}
                        style={{ height: '120px', resize: 'none', marginTop: '4px' }}
                    />
                    <button className="secondary" style={{ width: '100%', marginTop: '8px' }} onClick={() => navigator.clipboard.writeText(step.prompt)}>
                        <Clipboard size={16} /> Copy Prompt
                    </button>
                </div>

                <button className="primary" style={{ width: '100%', marginBottom: 'var(--space-3)' }} onClick={() => window.open('https://lovable.dev', '_blank')}>
                    Build in Lovable <ExternalLink size={16} />
                </button>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'success' ? 'var(--success-color)' : '' }} onClick={() => setStatus('success')}>
                        <CheckCircle size={16} /> It Worked
                    </button>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'error' ? 'var(--accent-color)' : '' }} onClick={handleError}>
                        <AlertCircle size={16} /> Error
                    </button>
                    <button className="secondary" style={{ justifyContent: 'flex-start' }} onClick={handleUpload}>
                        <ImageIcon size={16} /> {artifact ? 'Artifact Uploaded' : 'Add Screenshot'}
                    </button>
                </div>

                {artifact && (
                    <button className="primary" style={{ width: '100%', marginTop: 'var(--space-4)', background: 'var(--text-primary)' }} onClick={handleNext}>
                        Next Step <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </>
    );
}

function ProofPage() {
    const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });

    const stepStatuses = STEPS.map((s, i) => ({
        ...s,
        completed: !!localStorage.getItem(`rb_step_${i + 1}_artifact`)
    }));

    const allCompleted = stepStatuses.every(s => s.completed);

    const handleCopySubmission = () => {
        const text = `AI Resume Builder Submission\nLovable: ${links.lovable}\nGitHub: ${links.github}\nDeploy: ${links.deploy}`;
        navigator.clipboard.writeText(text);
        alert('Submission copied to clipboard');
    };

    return (
        <div className="workspace" style={{ flex: '0 0 100%', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="serif">Project Proof</h1>
            <p>Finalize your project by providing the necessary deployment and source links.</p>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: 'var(--space-4)' }}>
                {stepStatuses.map(s => (
                    <div key={s.id} style={{ textAlign: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', background: s.completed ? '#E8F0E5' : '#f9f9f9' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>Step {s.id}</div>
                        <div style={{ color: s.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                            {s.completed ? <CheckCircle size={20} style={{ margin: '8px auto' }} /> : <Circle size={20} style={{ margin: '8px auto' }} />}
                        </div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>{s.completed ? 'Artifact' : 'Pending'}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                    <label>Lovable Project Link</label>
                    <input type="text" value={links.lovable} onChange={e => setLinks({ ...links, lovable: e.target.value })} placeholder="https://lovable.dev/projects/..." />
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                    <label>GitHub Repository</label>
                    <input type="text" value={links.github} onChange={e => setLinks({ ...links, github: e.target.value })} placeholder="https://github.com/user/repo" />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label>Deployment URL</label>
                    <input type="text" value={links.deploy} onChange={e => setLinks({ ...links, deploy: e.target.value })} placeholder="https://project.vercel.app" />
                </div>
                <button className="primary" style={{ width: '100%' }} disabled={!allCompleted} onClick={handleCopySubmission}>
                    Copy Final Submission
                </button>
                {!allCompleted && <p style={{ fontSize: '12px', color: 'var(--accent-color)', marginTop: '8px', textAlign: 'center' }}>Complete all 8 steps to enable final submission.</p>}
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/rb/01-problem" />} />
                    <Route path="/rb/:stepId" element={<StepPage />} />
                    <Route path="/rb/proof" element={<ProofPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
