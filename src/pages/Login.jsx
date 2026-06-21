import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: 'Seamless employee onboarding',
    desc: 'Automated workflow from day one',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.15)',
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
    label: 'Digital NDA signing',
    desc: 'Legally binding e-signatures',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    label: 'Document management',
    desc: 'Secure cloud storage for all docs',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
  },
  {
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    label: 'Real-time tracking',
    desc: 'Live onboarding progress dashboard',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.15)',
  },
]

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }

        .login-page {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          width: 45%;
          background: #1e3a8a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 44px 36px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }

        /* Logo row hidden on left */
        .left-logo-row { display: none; }

        .left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0 20px;
          position: relative;
          z-index: 1;
        }
        .left-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 20px;
          width: fit-content;
        }
        .left-heading {
          color: white;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .left-sub {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 36px;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px;
          transition: background 0.2s;
        }
        .feature-item:hover {
          background: rgba(255,255,255,0.10);
        }
        .feature-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .feature-text {}
        .feature-label {
          color: rgba(255,255,255,0.92);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
        }
        .feature-desc {
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          margin-top: 2px;
        }

        .left-stats {
          display: flex;
          gap: 20px;
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .left-stat {}
        .left-stat-num {
          color: white;
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
        }
        .left-stat-label {
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          margin-top: 4px;
        }

        .left-footer {
          color: rgba(255,255,255,0.3);
          font-size: 11px;
          position: relative;
          z-index: 1;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          flex: 1;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .form-card {
          background: white;
          border-radius: 22px;
          padding: 48px 42px;
          width: 100%;
          max-width: 430px;
          box-shadow: 0 12px 48px rgba(30,58,138,0.10);
          border: 1px solid #e2e8f0;
        }

        /* Form header — logo centered here */
        .form-header {
          margin-bottom: 36px;
          text-align: center;
        }
        .form-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .form-logo-wrap img {
          height: 52px; width: 52px;
          object-fit: contain;
          border-radius: 14px;
        }
        .form-logo-name {
          font-size: 18px;
          font-weight: 800;
          color: #1e3a8a;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .form-logo-sub {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
        }
        .form-welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          color: #2563eb;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .form-sub {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }

        .field-group { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: #9ca3af;
          display: flex;
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 13px 44px;
          border: 1.5px solid #e2e8f0;
          border-radius: 11px;
          font-size: 15px;
          color: #1e293b;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30,58,138,0.1);
          background: white;
        }
        .eye-btn {
          position: absolute; right: 13px;
          background: none; border: none;
          cursor: pointer; color: #9ca3af;
          display: flex; padding: 4px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #1e3a8a; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
          box-shadow: 0 6px 20px rgba(30,58,138,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(30,58,138,0.35);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f1f5f9; }
        .divider-text { font-size: 11px; color: #94a3b8; white-space: nowrap; }

        .form-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.6;
        }

        /* ── TABLET ── */
        @media (max-width: 768px) {
          .login-left { width: 42%; padding: 28px 22px; }
          .left-logo-row img { height: 38px; width: 38px; }
          .left-logo-name { font-size: 14px; }
          .left-body { padding: 24px 0 0; }
          .left-heading { font-size: 20px; }
          .left-sub { font-size: 12px; margin-bottom: 24px; }
          .feature-item { font-size: 12px; }
          .feature-icon { width: 30px; height: 30px; font-size: 14px; }
          .left-stats { gap: 14px; margin-top: 24px; padding-top: 20px; }
          .left-stat-num { font-size: 18px; }
          .form-card { padding: 32px 26px; border-radius: 18px; }
          .form-title { font-size: 22px; }
          .login-input { font-size: 15px; }
          .submit-btn { font-size: 15px; }
        }

        /* ── MOBILE ── */
        @media (max-width: 500px) {
          .login-left { width: 38%; padding: 20px 14px; }
          .left-logo-sub { display: none; }
          .left-tag { display: none; }
          .left-body { padding: 18px 0 0; }
          .left-heading { font-size: 15px; letter-spacing: -0.01em; }
          .left-sub { display: none; }
          .feature-item { padding: 8px 10px; border-radius: 9px; gap: 10px; }
          .feature-icon { width: 30px; height: 30px; border-radius: 8px; }
          .feature-label { font-size: 11px; }
          .feature-desc { display: none; }
          .left-stats { flex-direction: column; gap: 10px; margin-top: 20px; padding-top: 16px; }
          .left-stat-num { font-size: 16px; }
          .left-stat-label { font-size: 10px; }
          .left-footer { display: none; }
          .login-right { padding: 16px 10px; background: #f0f4ff; }
          .form-card { padding: 24px 18px; border-radius: 16px; }
          .form-welcome-tag { font-size: 10px; padding: 3px 10px; }
          .form-title { font-size: 18px; }
          .form-sub { font-size: 12px; }
          .field-label { font-size: 12px; }
          .login-input { font-size: 14px; padding: 12px 38px; border-radius: 9px; }
          .submit-btn { font-size: 14px; padding: 13px; border-radius: 9px; }
          .field-group { margin-bottom: 14px; }
          .form-footer { font-size: 10px; margin-top: 20px; }
          .divider { margin: 18px 0 0; }
        }

        @media (max-width: 360px) {
          .login-left { width: 35%; padding: 16px 10px; }
          .left-logo-name { font-size: 11px; }
          .left-heading { font-size: 13px; }
          .feature-item { font-size: 10px; }
          .feature-icon { width: 22px; height: 22px; font-size: 10px; }
          .form-card { padding: 20px 14px; }
          .form-title { font-size: 16px; }
          .login-input { font-size: 13px; }
          .submit-btn { font-size: 13px; padding: 12px; }
        }
      `}</style>

      <div className="login-page">

        {/* ── LEFT PANEL (one logo only) ── */}
        <div className="login-left">
          <div className="left-logo-row" />

          <div className="left-body">
            <div className="left-tag">🏢 HR Portal</div>
            <h2 className="left-heading">Employee Onboarding<br />Management System</h2>
            <p className="left-sub">Streamline your HR processes with our comprehensive onboarding portal.</p>
            <div className="feature-list">
              {features.map(f => (
                <div key={f.label} className="feature-item">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color, border: `1px solid ${f.color}30` }}>
                    {f.icon}
                  </div>
                  <div className="feature-text">
                    <div className="feature-label">{f.label}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="left-footer">© 2026 Zayron Infotech Pvt. Ltd.</p>
        </div>

        {/* ── RIGHT PANEL (no logo here) ── */}
        <div className="login-right">
          <div className="form-card">
            <div className="form-header">
              <div className="form-logo-wrap">
                <img src="/static/img/logo1.png" alt="Zayron Infotech" />
                <div>
                  <div className="form-logo-name">Zayron Infotech</div>
                  <div className="form-logo-sub">HR Onboarding Portal</div>
                </div>
              </div>
              <h1 className="form-title">Welcome back</h1>
              <p className="form-sub">Sign in to your HR portal account to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                    {showPass
                      ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in...</>
                  : <>Sign In →</>
                }
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Zayron Infotech Pvt. Ltd.</span>
              <div className="divider-line" />
            </div>

            <p className="form-footer">© 2026 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}
