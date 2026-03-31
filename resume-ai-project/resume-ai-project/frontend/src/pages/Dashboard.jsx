import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadResume } from '../utils/api.js';

/* ─── Constants ─────────────────────────────────────────────── */
const JOB_ROLES = [
  'Software Engineer', 'Senior Java Developer', 'Full Stack Engineer',
  'Data Scientist', 'DevOps Engineer', 'Product Manager',
  'Frontend Developer', 'Machine Learning Engineer', 'Cloud Architect',
];

const STAGES = {
  uploading: { label: 'Uploading PDF…', pct: 25 },
  parsing:   { label: 'Extracting text with PDFBox…', pct: 50 },
  analyzing: { label: 'GPT-4 analyzing your resume…', pct: 80 },
  done:      { label: 'Analysis complete!', pct: 100 },
};

/* ─── Helpers ────────────────────────────────────────────────── */
function scoreColor(n) {
  if (n >= 80) return '#22d3a5';
  if (n >= 55) return '#f59e0b';
  return '#f43f5e';
}

function ScoreRing({ value, label, size = 120 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let frame;
    const step = () => {
      setDisplayed(prev => {
        if (prev < value) { frame = requestAnimationFrame(step); return prev + 1; }
        return value;
      });
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const dash = (displayed / 100) * circ;
  const color = scoreColor(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'none', filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="60" y="60" dominantBaseline="middle" textAnchor="middle"
          fill="white" fontSize="20" fontWeight="800" fontFamily="'DM Mono', monospace">
          {displayed}
        </text>
        <text x="60" y="78" dominantBaseline="middle" textAnchor="middle"
          fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">
          /100
        </text>
      </svg>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

function SkillPill({ skill, missing = false, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 0.5,
      margin: '3px 4px',
      background: missing ? 'rgba(244,63,94,0.12)' : 'rgba(34,211,165,0.12)',
      border: `1px solid ${missing ? 'rgba(244,63,94,0.35)' : 'rgba(34,211,165,0.35)'}`,
      color: missing ? '#f87171' : '#22d3a5',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    }}>
      {missing ? '✗ ' : '✓ '}{skill}
    </span>
  );
}

function SuggestionCard({ text, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 18px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-20px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#818cf8', fontWeight: 700, fontSize: 12,
      }}>{index + 1}</span>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function BarChart({ skills }) {
  const topSkills = skills.slice(0, 8);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {topSkills.map((skill, i) => {
        const width = Math.max(30, 100 - i * 9);
        return (
          <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 130, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right', flexShrink: 0 }}>
              {skill}
            </span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, #6366f1, #22d3a5)`,
                width: `${width}%`,
                boxShadow: '0 0 8px rgba(99,102,241,0.5)',
                transition: `width 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`,
              }} />
            </div>
            <span style={{ width: 32, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{width}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Particle Background ────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.35)';
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); setError(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: loading,
  });

  const handleAnalyze = async () => {
    if (!file) return showToast('Please upload a PDF first', 'error');
    setLoading(true); setResult(null); setError(null); setStage('uploading');

    try {
      setTimeout(() => setStage('parsing'), 900);
      setTimeout(() => setStage('analyzing'), 2200);
      const { data } = await uploadResume(file, jobRole);
      setStage('done');
      setTimeout(() => { setResult(data); setLoading(false); showToast('Analysis complete! 🎉'); }, 600);
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed. Check your API key and backend.';
      setError(msg); setLoading(false); setStage(null);
      showToast(msg, 'error');
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setStage(null); };

  const stageInfo = stage ? STAGES[stage] : null;

  /* ── styles ── */
  const s = {
    wrap: {
      minHeight: '100vh', background: '#0a0b14',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: '#fff', position: 'relative', overflow: 'hidden',
    },
    inner: { position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' },
    header: {
      paddingTop: 56, paddingBottom: 40, textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 20, padding: '5px 16px', fontSize: 12, color: '#818cf8',
      letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20,
    },
    h1: {
      fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900, margin: '0 0 16px',
      background: 'linear-gradient(135deg, #fff 30%, #6366f1 70%, #22d3a5)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      lineHeight: 1.1,
    },
    sub: { color: 'rgba(255,255,255,0.4)', fontSize: 16, margin: 0 },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: 32,
    },
    sectionTitle: {
      fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)', marginBottom: 20, marginTop: 0,
    },
    dropzone: {
      border: `2px dashed ${isDragActive ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 16, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
      background: isDragActive ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
      transition: 'all 0.25s ease',
    },
    select: {
      width: '100%', padding: '14px 18px', borderRadius: 12,
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer',
    },
    btn: {
      width: '100%', padding: '16px', borderRadius: 14, border: 'none',
      background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #22d3a5)',
      color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
      letterSpacing: 0.5, boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.4)',
      transition: 'all 0.3s ease',
    },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginTop: 36 },
  };

  return (
    <div style={s.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0b14; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <Particles />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 1000,
          padding: '14px 22px', borderRadius: 12,
          background: toast.type === 'error' ? 'rgba(244,63,94,0.15)' : 'rgba(34,211,165,0.15)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(244,63,94,0.4)' : 'rgba(34,211,165,0.4)'}`,
          color: toast.type === 'error' ? '#f87171' : '#22d3a5',
          fontSize: 14, fontWeight: 600,
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>{toast.msg}</div>
      )}

      <div style={s.inner}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.badge}>
            <span>⚡</span> Powered by GPT-4 + Spring Boot
          </div>
          <h1 style={s.h1}>Resume Intelligence<br />Platform</h1>
          <p style={s.sub}>Upload your resume. Get an ATS score, skill gap analysis & smart suggestions in seconds.</p>
        </header>

        {/* Upload Section */}
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Drop zone card */}
          <div style={s.card}>
            <p style={s.sectionTitle}>01 — Upload Resume</p>
            <div {...getRootProps()} style={s.dropzone}>
              <input {...getInputProps()} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>
                {file ? '📄' : isDragActive ? '🎯' : '☁️'}
              </div>
              {file ? (
                <>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15 }}>{file.name}</p>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                    {(file.size / 1024).toFixed(1)} KB — click to replace
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 15 }}>
                    {isDragActive ? 'Drop it here!' : 'Drag & drop your PDF'}
                  </p>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>or click to browse — PDF only, max 10MB</p>
                </>
              )}
            </div>
          </div>

          {/* Job role + analyze */}
          <div style={s.card}>
            <p style={s.sectionTitle}>02 — Target Role</p>
            <select
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              style={{ ...s.select, marginBottom: 20 }}
            >
              {JOB_ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1b2e' }}>{r}</option>)}
            </select>

            <p style={s.sectionTitle}>03 — Analyze</p>
            <button onClick={handleAnalyze} disabled={loading} style={s.btn}>
              {loading ? '⏳ Analyzing…' : '🚀 Analyze Resume with AI'}
            </button>

            {result && (
              <button onClick={reset} style={{
                marginTop: 12, width: '100%', padding: '12px', borderRadius: 12,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer',
              }}>↩ Start Over</button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {loading && stageInfo && (
          <div style={{ marginTop: 28, animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '2px solid #6366f1', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                {stageInfo.label}
              </span>
              <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>{stageInfo.pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, #6366f1, #22d3a5)',
                width: `${stageInfo.pct}%`,
                transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 0 12px rgba(99,102,241,0.6)',
              }} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            marginTop: 28, padding: '18px 24px', borderRadius: 14,
            background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.25)',
            color: '#f87171', fontSize: 14, animation: 'fadeUp 0.4s ease',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ animation: 'fadeUp 0.6s ease' }}>
            {/* Score Cards */}
            <div style={{ marginTop: 48, textAlign: 'center' }}>
              <p style={{ ...s.sectionTitle, textAlign: 'center' }}>Analysis Results for — {result.jobRole}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginTop: 16 }}>
                <ScoreRing value={result.atsScore || 0} label="ATS Score" size={140} />
                <ScoreRing value={result.jobMatchScore || 0} label="Job Match" size={140} />
              </div>
            </div>

            <div style={s.resultGrid}>
              {/* Extracted Skills */}
              <div style={s.card}>
                <p style={s.sectionTitle}>✅ Extracted Skills ({result.extractedSkills?.length || 0})</p>
                <div style={{ lineHeight: 2 }}>
                  {result.extractedSkills?.map((sk, i) => (
                    <SkillPill key={sk} skill={sk} delay={i * 50} />
                  ))}
                </div>
                {result.extractedSkills?.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <p style={{ ...s.sectionTitle, marginBottom: 14 }}>Skill Strength</p>
                    <BarChart skills={result.extractedSkills} />
                  </div>
                )}
              </div>

              {/* Missing Skills + Suggestions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={s.card}>
                  <p style={s.sectionTitle}>⚠️ Missing Skills ({result.missingSkills?.length || 0})</p>
                  <div style={{ lineHeight: 2 }}>
                    {result.missingSkills?.map((sk, i) => (
                      <SkillPill key={sk} skill={sk} missing delay={i * 60} />
                    ))}
                    {(!result.missingSkills || result.missingSkills.length === 0) && (
                      <p style={{ color: '#22d3a5', fontSize: 13 }}>🎉 No major skill gaps found!</p>
                    )}
                  </div>
                </div>

                <div style={s.card}>
                  <p style={s.sectionTitle}>💡 AI Suggestions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.suggestions?.map((s, i) => (
                      <SuggestionCard key={i} text={s} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Banner */}
            {result.rawAiResponse && (
              <div style={{
                ...s.card, marginTop: 24,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,211,165,0.05))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <p style={s.sectionTitle}>🤖 AI Summary</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.8 }}>
                  {result.rawAiResponse}
                </p>
              </div>
            )}

            {/* ATS Band */}
            <div style={{
              ...s.card, marginTop: 24, textAlign: 'center',
              background: `linear-gradient(135deg, ${scoreColor(result.atsScore)}18, transparent)`,
              border: `1px solid ${scoreColor(result.atsScore)}40`,
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900, color: scoreColor(result.atsScore) }}>
                {result.atsScore >= 80 ? 'Excellent Resume ⭐' : result.atsScore >= 55 ? 'Good — Room to Improve 📈' : 'Needs Work — Follow Suggestions 🔧'}
              </p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                ATS Score: {result.atsScore}/100 · Job Match: {result.jobMatchScore}/100 · Status: {result.analysisStatus}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 64, textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: 12, letterSpacing: 1 }}>
          RESUME AI PLATFORM · JAVA + PYTHON + REACT · GPT-4 POWERED
        </footer>
      </div>
    </div>
  );
}
