import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Plus, Trash2, Database, FileText, ExternalLink, Clipboard, CheckCircle2, Circle, AlertCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';

// --- Build Track Data ---
const BUILD_TRACK_STEPS = [
    { id: '01', title: 'Problem Discovery', path: '/rb/01-problem', prompt: 'Analyze the current resume building landscape and identify top 3 friction points.' },
    { id: '02', title: 'Market Analysis', path: '/rb/02-market', prompt: 'Define the target persona and competitive advantages of an AI-first builder.' },
    { id: '03', title: 'Architecture Design', path: '/rb/03-architecture', prompt: 'Outline the modular architecture: Extraction, Generation, and Formatting layers.' },
    { id: '04', title: 'High-Level Design', path: '/rb/04-hld', prompt: 'Create the system context diagram and API boundary definitions.' },
    { id: '05', title: 'Low-Level Design', path: '/rb/05-lld', prompt: 'Define the schema for Resume data and the prompt engineering strategy.' },
    { id: '06', title: 'Build Core Engine', path: '/rb/06-build', prompt: 'Implement the React frontend with the defined design system tokens.' },
    { id: '07', title: 'Test & Validate', path: '/rb/07-test', prompt: 'Execute end-to-end tests for resume generation and export functionality.' },
    { id: '08', title: 'Ship & Deploy', path: '/rb/08-ship', prompt: 'Configure CI/CD pipeline and deploy to production environment.' },
];

// --- Resume Builder Data ---
const INITIAL_STATE = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', position: '', duration: '', description: '' }],
    projects: [{ name: '', link: '', description: '' }],
    skills: '',
    links: { github: '', linkedin: '' }
};

const SAMPLE_DATA = {
    personalInfo: { name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', location: 'San Francisco, CA' },
    summary: 'Experienced Software Engineer with a passion for building scalable web applications and AI-driven solutions.',
    education: [{ school: 'Stanford University', degree: 'B.S. Computer Science', year: '2016 - 2020' }],
    experience: [
        { company: 'Tech Corp', position: 'Senior Engineer', duration: '2021 - Present', description: 'Leading the development of a high-traffic e-commerce platform.' },
        { company: 'Startup X', position: 'Full Stack Developer', duration: '2020 - 2021', description: 'Built and launched multiple products using React and Node.js.' }
    ],
    projects: [{ name: 'AI Resume Builder', link: 'https://github.com/jdoe/resumebuilder', description: 'A premium resume generation tool using LLMs.' }],
    skills: 'React, Node.js, TypeScript, Python, AWS, GraphQL',
    links: { github: 'https://github.com/jdoe', linkedin: 'https://linkedin.com/in/jdoe' }
};

// --- Build Track Components ---

function StepPage() {
    const { stepId } = useParams();
    const navigate = useNavigate();
    const stepIndex = BUILD_TRACK_STEPS.findIndex(s => s.path.includes(stepId));
    const step = BUILD_TRACK_STEPS[stepIndex];

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

    const handleNext = () => {
        if (stepIndex < BUILD_TRACK_STEPS.length - 1) {
            navigate(BUILD_TRACK_STEPS[stepIndex + 1].path);
        } else {
            navigate('/rb/proof');
        }
    };

    if (!step) return <Navigate to="/rb/01-problem" />;

    // Gating Logic
    if (stepIndex > 0) {
        const prevArtifact = localStorage.getItem(`rb_step_${stepIndex}_artifact`);
        if (!prevArtifact) {
            return (
                <div className="workspace" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h2 className="serif">Access Restricted</h2>
                    <p>Please complete the previous step ({BUILD_TRACK_STEPS[stepIndex - 1].title}) before proceeding.</p>
                    <button className="primary" onClick={() => navigate(BUILD_TRACK_STEPS[stepIndex - 1].path)}>Back to Step {BUILD_TRACK_STEPS[stepIndex].id}</button>
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
                </header>
                <div className="card">
                    <h3 className="serif">Workspace Area</h3>
                    <div style={{ height: '300px', background: '#f9f9f9', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        Main Interaction Layer for {step.title}
                    </div>
                </div>
            </div>
            <div className="side-panel">
                <h3 className="serif" style={{ marginBottom: 'var(--space-2)' }}>Build Panel</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>Copy the prompt below into Lovable.</p>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Lovable Prompt</label>
                    <textarea readOnly value={step.prompt} style={{ height: '120px', resize: 'none', marginTop: '4px' }} />
                    <button className="secondary" style={{ width: '100%', marginTop: '8px' }} onClick={() => navigator.clipboard.writeText(step.prompt)}><Clipboard size={16} /> Copy Prompt</button>
                </div>
                <button className="primary" style={{ width: '100%', marginBottom: 'var(--space-3)' }} onClick={() => window.open('https://lovable.dev', '_blank')}>Build in Lovable <ExternalLink size={16} /></button>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'success' ? 'var(--success-color)' : '' }} onClick={() => setStatus('success')}><CheckCircle2 size={16} /> It Worked</button>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'error' ? 'var(--accent-color)' : '' }} onClick={() => setStatus('error')}><AlertCircle size={16} /> Error</button>
                    <button className="secondary" style={{ justifyContent: 'flex-start' }} onClick={handleUpload}><ImageIcon size={16} /> {artifact ? 'Artifact Uploaded' : 'Add Screenshot'}</button>
                </div>
                {artifact && <button className="primary" style={{ width: '100%', marginTop: 'var(--space-4)', background: 'var(--text-primary)' }} onClick={handleNext}>Next Step <ArrowRight size={16} /></button>}
            </div>
        </>
    );
}

function BuildTrackProof() {
    const stepStatuses = BUILD_TRACK_STEPS.map((s, i) => ({ ...s, completed: !!localStorage.getItem(`rb_step_${i + 1}_artifact`) }));
    const allCompleted = stepStatuses.every(s => s.completed);
    return (
        <div className="workspace" style={{ flex: '0 0 100%', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="serif">Project Proof</h1>
            <p>Finalize your project by providing the necessary deployment and source links.</p>
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: 'var(--space-4)' }}>
                {stepStatuses.map(s => (
                    <div key={s.id} style={{ textAlign: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', background: s.completed ? '#E8F0E5' : '#f9f9f9' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>Step {s.id}</div>
                        <div style={{ color: s.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>{s.completed ? <CheckCircle2 size={20} style={{ margin: '8px auto' }} /> : <Circle size={20} style={{ margin: '8px auto' }} />}</div>
                    </div>
                ))}
            </div>
            <div className="card">
                <input placeholder="Lovable Project Link" style={{ marginBottom: '12px' }} />
                <input placeholder="GitHub Repository" style={{ marginBottom: '12px' }} />
                <input placeholder="Deployment URL" style={{ marginBottom: '24px' }} />
                <button className="primary" style={{ width: '100%' }} disabled={!allCompleted}>Copy Final Submission</button>
            </div>
        </div>
    );
}

// --- Resume Builder Components ---

function Home() {
    const navigate = useNavigate();
    return (
        <div className="workspace" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
            <h1 className="serif" style={{ fontSize: '64px', maxWidth: '800px' }}>Build a Resume That Gets Read.</h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Premium, ATS-optimized, and AI-powered resumes for high-performance careers.</p>
            <button className="primary" style={{ padding: '16px 40px', fontSize: '18px' }} onClick={() => navigate('/builder')}>Start Building</button>
        </div>
    );
}

function Builder({ resumeData, setResumeData }) {
    const handleListChange = (section, index, field, value) => {
        const newList = [...resumeData[section]];
        newList[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: newList }));
    };
    const addItem = (section, template) => setResumeData(prev => ({ ...prev, [section]: [...prev[section], { ...template }] }));
    const removeItem = (section, index) => resumeData[section].length > 1 && setResumeData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));

    return (
        <>
            <div className="workspace" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}><h2 className="serif">Resume Builder</h2><button className="secondary" onClick={() => setResumeData(SAMPLE_DATA)}>Load Sample Data</button></div>
                <section className="card"><h3 className="serif">Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                        <input placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, name: e.target.value } }))} />
                        <input placeholder="Email" value={resumeData.personalInfo.email} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, email: e.target.value } }))} />
                        <input placeholder="Phone" value={resumeData.personalInfo.phone} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, phone: e.target.value } }))} />
                        <input placeholder="Location" value={resumeData.personalInfo.location} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, location: e.target.value } }))} />
                    </div>
                </section>
                <section className="card"><h3 className="serif">Professional Summary</h3><textarea style={{ height: '120px' }} value={resumeData.summary} onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))} /></section>
                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 className="serif">Experience</h3><button className="secondary" onClick={() => addItem('experience', { company: '', position: '', duration: '', description: '' })}><Plus size={16} /> Add</button></div>
                    {resumeData.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '12px', border: '1px solid var(--border-color)', padding: '12px' }}>
                            <input placeholder="Company" value={exp.company} onChange={e => handleListChange('experience', i, 'company', e.target.value)} style={{ marginBottom: '8px' }} />
                            <textarea placeholder="Description" value={exp.description} onChange={e => handleListChange('experience', i, 'description', e.target.value)} style={{ height: '60px' }} />
                            <button className="secondary" onClick={() => removeItem('experience', i)}><Trash2 size={12} /></button>
                        </div>
                    ))}
                </section>
            </div>
            <div className="side-panel">
                <h3 className="serif">Live Preview</h3>
                <div style={{ background: '#fff', border: '1px solid var(--border-color)', aspectRatio: '1 / 1.4', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ textAlign: 'center', fontWeight: 700 }}>{resumeData.personalInfo.name || 'Your Name'}</div>
                    <div style={{ borderTop: '1px solid #000', marginTop: '8px', paddingTop: '4px', fontSize: '10px' }}>{resumeData.summary}</div>
                </div>
            </div>
        </>
    );
}

function ResumePreview({ resumeData }) {
    return <div className="workspace" style={{ background: '#fff', padding: 'var(--space-5)' }}><div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #eee', padding: '40px' }}><h1 className="serif">{resumeData.personalInfo.name}</h1><p>{resumeData.summary}</p></div></div>;
}

function AppProof() {
    return <div className="workspace" style={{ padding: 'var(--space-5)' }}><h1 className="serif">System Proof</h1><div className="card" style={{ padding: '40px', borderStyle: 'dashed', textAlign: 'center' }}><Database size={48} /><h3 className="serif">No Artifacts</h3></div></div>;
}

// --- App ---

function App() {
    const [resumeData, setResumeData] = useState(() => JSON.parse(localStorage.getItem('resume_build_data')) || INITIAL_STATE);
    useEffect(() => localStorage.setItem('resume_build_data', JSON.stringify(resumeData)), [resumeData]);

    return (
        <Router>
            <Layout buildTrackSteps={BUILD_TRACK_STEPS}>
                <Routes>
                    {/* Build Track Routes */}
                    <Route path="/rb/:stepId" element={<StepPage />} />
                    <Route path="/rb/proof" element={<BuildTrackProof />} />

                    {/* Resume Builder Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/builder" element={<Builder resumeData={resumeData} setResumeData={setResumeData} />} />
                    <Route path="/preview" element={<ResumePreview resumeData={resumeData} />} />
                    <Route path="/proof" element={<AppProof />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
