import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Plus, Trash2, Database, FileText, ExternalLink, Clipboard, CheckCircle2, Circle, AlertCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';

// --- Build Track Data ---
const BUILD_TRACK_STEPS = [
    { id: '1', name: '01-problem', title: 'Problem Discovery', path: '/rb/01-problem', prompt: 'Analyze the current resume building landscape and identify top 3 friction points.' },
    { id: '2', name: '02-market', title: 'Market Analysis', path: '/rb/02-market', prompt: 'Define the target persona and competitive advantages of an AI-first builder.' },
    { id: '3', name: '03-architecture', title: 'Architecture Design', path: '/rb/03-architecture', prompt: 'Outline the modular architecture: Extraction, Generation, and Formatting layers.' },
    { id: '4', name: '04-hld', title: 'High-Level Design', path: '/rb/04-hld', prompt: 'Create the system context diagram and API boundary definitions.' },
    { id: '5', name: '05-lld', title: 'Low-Level Design', path: '/rb/05-lld', prompt: 'Define the schema for Resume data and the prompt engineering strategy.' },
    { id: '6', name: '06-build', title: 'Build Core Engine', path: '/rb/06-build', prompt: 'Implement the React frontend with the defined design system tokens.' },
    { id: '7', name: '07-test', title: 'Test & Validate', path: '/rb/07-test', prompt: 'Execute end-to-end tests for resume generation and export functionality.' },
    { id: '8', name: '08-ship', title: 'Ship & Deploy', path: '/rb/08-ship', prompt: 'Configure CI/CD pipeline and deploy to production environment.' },
];

const INITIAL_RESUME_STATE = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', position: '', duration: '', description: '' }],
    projects: [{ name: '', link: '', description: '' }],
    skills: '',
    links: { github: '', linkedin: '' }
};

const SAMPLE_RESUME_DATA = {
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

// --- Shared Components ---

function StepPage({ stepIndex }) {
    const step = BUILD_TRACK_STEPS[stepIndex];
    const navigate = useNavigate();

    const artifactKey = `rb_step_${stepIndex + 1}_artifact`;
    const [artifact, setArtifact] = useState(localStorage.getItem(artifactKey));
    const [status, setStatus] = useState(artifact ? 'success' : 'idle');

    useEffect(() => {
        setArtifact(localStorage.getItem(artifactKey));
        setStatus(localStorage.getItem(artifactKey) ? 'success' : 'idle');
    }, [stepIndex, artifactKey]);

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

    // Gating Logic
    if (stepIndex > 0) {
        const prevArtifactKey = `rb_step_${stepIndex}_artifact`;
        const prevArtifact = localStorage.getItem(prevArtifactKey);
        if (!prevArtifact) {
            return (
                <div className="workspace" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h2 className="serif">Step Locked</h2>
                    <p style={{ marginBottom: 'var(--space-3)' }}>Please complete the previous step ({BUILD_TRACK_STEPS[stepIndex - 1].title}) before proceeding.</p>
                    <button className="primary" onClick={() => navigate(BUILD_TRACK_STEPS[stepIndex - 1].path)}>Back to Step {BUILD_TRACK_STEPS[stepIndex - 1].id}</button>
                </div>
            );
        }
    }

    return (
        <>
            <div className="workspace">
                <header style={{ marginBottom: 'var(--space-4)' }}>
                    <div className="tag status" style={{ marginBottom: 'var(--space-2)' }}>Phase {step.id}</div>
                    <h1 className="serif">{step.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                        Complete this phase to progress through the Build Track. Artifacts are required to unlock the next stage.
                    </p>
                </header>
                <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <h3 className="serif">Workspace Interaction</h3>
                    <div style={{ flex: 1, background: '#f9f9f9', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', borderRadius: '4px' }}>
                        Main interaction surface for {step.title}
                    </div>
                </div>
            </div>
            <div className="side-panel" style={{ borderLeft: '1px solid var(--border-color)' }}>
                <h3 className="serif" style={{ marginBottom: 'var(--space-3)' }}>Build Panel</h3>

                <div style={{ marginBottom: 'var(--space-3)' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Copy This Into Lovable</label>
                    <textarea readOnly value={step.prompt} style={{ height: '140px', resize: 'none', width: '100%', padding: '12px', fontSize: '14px', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                    <button className="secondary" style={{ width: '100%', marginTop: '8px' }} onClick={() => navigator.clipboard.writeText(step.prompt)}>
                        <Clipboard size={16} /> Copy Prompt
                    </button>
                </div>

                <button className="primary" style={{ width: '100%', marginBottom: 'var(--space-4)' }} onClick={() => window.open('https://lovable.dev', '_blank')}>
                    Build in Lovable <ExternalLink size={16} />
                </button>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'success' ? 'var(--success-color)' : '' }} onClick={() => setStatus('success')}><CheckCircle2 size={16} /> It Worked</button>
                    <button className="secondary" style={{ justifyContent: 'flex-start', color: status === 'error' ? 'var(--accent-color)' : '' }} onClick={() => setStatus('error')}><AlertCircle size={16} /> Error</button>
                    <button className="secondary" style={{ justifyContent: 'flex-start' }} onClick={handleUpload}><ImageIcon size={16} /> {artifact ? 'Artifact Uploaded' : 'Add Screenshot'}</button>
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

function BuildTrackProof() {
    const stepStatuses = BUILD_TRACK_STEPS.map((s, i) => ({ ...s, completed: !!localStorage.getItem(`rb_step_${i + 1}_artifact`) }));
    const allCompleted = stepStatuses.every(s => s.completed);
    return (
        <div className="workspace" style={{ flex: '0 0 100%', maxWidth: '900px', margin: '0 auto', padding: 'var(--space-4)' }}>
            <h1 className="serif" style={{ fontSize: '48px' }}>Final Submission</h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Status overview of the 8-step build track.</p>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: 'var(--space-4)' }}>
                {stepStatuses.map(s => (
                    <div key={s.id} style={{ textAlign: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', background: s.completed ? '#E8F0E5' : '#fff' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Step {s.id}</div>
                        <div style={{ margin: '8px 0', color: s.completed ? 'var(--success-color)' : '#ccc' }}>
                            {s.completed ? <CheckCircle2 size={24} style={{ margin: '0 auto' }} /> : <Circle size={24} style={{ margin: '0 auto' }} />}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{s.completed ? 'Complete' : 'Pending'}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <h3 className="serif">Submission Links</h3>
                <input placeholder="Lovable Project Link" style={{ padding: '12px' }} />
                <input placeholder="GitHub Repository" style={{ padding: '12px' }} />
                <input placeholder="Deployment URL" style={{ padding: '12px' }} />
                <button className="primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={!allCompleted} onClick={() => alert('Final Submission Copied!')}>
                    Copy Final Submission
                </button>
            </div>
        </div>
    );
}

// --- App Pages ---

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h2 className="serif">Resume Builder</h2>
                    <button className="secondary" onClick={() => setResumeData(SAMPLE_RESUME_DATA)}>Load Sample Data</button>
                </div>

                {/* Simplified Form for brevity in this fix - focus on routing and structure mapping */}
                <section className="card">
                    <h3 className="serif">Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                        <input placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, name: e.target.value } }))} />
                        <input placeholder="Email" value={resumeData.personalInfo.email} onChange={e => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, email: e.target.value } }))} />
                    </div>
                </section>

                <section className="card">
                    <h3 className="serif">Experience</h3>
                    {resumeData.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '16px', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '4px' }}>
                            <input placeholder="Company" value={exp.company} onChange={e => handleListChange('experience', i, 'company', e.target.value)} style={{ marginBottom: '8px' }} />
                            <textarea placeholder="Description" value={exp.description} onChange={e => handleListChange('experience', i, 'description', e.target.value)} style={{ height: '60px', width: '100%' }} />
                        </div>
                    ))}
                    <button className="secondary" onClick={() => addItem('experience', { company: '', position: '', duration: '', description: '' })}>Add Experience</button>
                </section>
            </div>

            <div className="side-panel" style={{ borderLeft: '1px solid var(--border-color)', background: '#F9F9F9' }}>
                <h3 className="serif" style={{ marginBottom: 'var(--space-3)' }}>Live Preview</h3>
                <div style={{ background: '#fff', border: '1px solid var(--border-color)', aspectRatio: '1 / 1.4', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px' }}>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>{resumeData.personalInfo.name || 'Your Name'}</div>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                        <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Work Experience</div>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={{ fontWeight: 600 }}>{exp.company}</div>
                                <div style={{ color: '#666' }}>{exp.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function ResumePreview({ resumeData }) {
    return (
        <div className="workspace" style={{ flex: '1', background: '#fff', display: 'flex', justifyContent: 'center', padding: 'var(--space-5)' }}>
            <div style={{ width: '800px', padding: '60px', border: '1px solid #eee', background: '#fff' }}>
                <h1 className="serif" style={{ textAlign: 'center', textTransform: 'uppercase' }}>{resumeData.personalInfo.name}</h1>
                <div style={{ borderTop: '1px solid #000', margin: '20px 0' }} />
                <h3 className="serif">Summary</h3>
                <p>{resumeData.summary || 'Summary placeholder...'}</p>
            </div>
        </div>
    );
}

function AppProof() {
    return (
        <div className="workspace" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
            <h1 className="serif">App Synchronization</h1>
            <div className="card" style={{ padding: '60px', borderStyle: 'dashed', marginTop: 'var(--space-4)' }}>
                <Database size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
                <h3 className="serif">No Active Proofs</h3>
                <p>Once you deploy your resume, artifacts will be logged here.</p>
            </div>
        </div>
    );
}

// --- Main Router ---

function App() {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resume_build_data');
        return saved ? JSON.parse(saved) : INITIAL_RESUME_STATE;
    });

    useEffect(() => {
        localStorage.setItem('resume_build_data', JSON.stringify(resumeData));
    }, [resumeData]);

    return (
        <Router>
            <Layout buildTrackSteps={BUILD_TRACK_STEPS}>
                <Routes>
                    {/* Explicit Build Track Routes (9 total) */}
                    <Route path="/rb/01-problem" element={<StepPage stepIndex={0} />} />
                    <Route path="/rb/02-market" element={<StepPage stepIndex={1} />} />
                    <Route path="/rb/03-architecture" element={<StepPage stepIndex={2} />} />
                    <Route path="/rb/04-hld" element={<StepPage stepIndex={3} />} />
                    <Route path="/rb/05-lld" element={<StepPage stepIndex={4} />} />
                    <Route path="/rb/06-build" element={<StepPage stepIndex={5} />} />
                    <Route path="/rb/07-test" element={<StepPage stepIndex={6} />} />
                    <Route path="/rb/08-ship" element={<StepPage stepIndex={7} />} />
                    <Route path="/rb/proof" element={<BuildTrackProof />} />

                    {/* Explicit App Routes (4 total) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/builder" element={<Builder resumeData={resumeData} setResumeData={setResumeData} />} />
                    <Route path="/preview" element={<ResumePreview resumeData={resumeData} />} />
                    <Route path="/proof" element={<AppProof />} />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
