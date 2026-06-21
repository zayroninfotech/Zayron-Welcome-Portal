import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const steps = [
  { num: '01', title: 'Register Employee', desc: 'Add employee details and send onboarding invite automatically.' },
  { num: '02', title: 'Sign NDA Digitally', desc: 'Employee signs the NDA online with a legally binding e-signature.' },
  { num: '03', title: 'Submit Documents', desc: 'Upload Aadhaar, PAN, photo, resume and certificates securely.' },
  { num: '04', title: 'Onboarding Complete', desc: 'HR gets notified and employee profile is marked complete.' },
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
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }

        .login-page {
          min-height: 100vh;
          display: flex;
          background: #f0f2f8;
        }

        /* ══════════════ LEFT PANEL ══════════════ */
        .login-left {
          width: 48%;
          background: #0d1b4b;
          display: flex;
          flex-direction: column;
          padding: 44px 52px;
          position: relative;
          overflow: hidden;
        }

        /* subtle grid pattern */
        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        /* glow accent */
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -120px; right: -120px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }

        /* top badge */
        .left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 30px;
          padding: 7px 16px;
          font-size: 11px;
          color: #93c5fd;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 36px;
        }
        .left-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 6px rgba(59,130,246,0.8);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .left-heading {
          color: #ffffff;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
        }
        .left-heading span { color: #60a5fa; }

        .left-sub {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          line-height: 1.75;
          margin-bottom: 48px;
          max-width: 340px;
        }

        /* HOW IT WORKS */
        .how-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .how-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .steps-list { display: flex; flex-direction: column; gap: 0; flex: 1; }
        .step-item {
          display: flex;
          gap: 16px;
          padding-bottom: 24px;
          position: relative;
        }
        .step-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 15px; top: 34px;
          width: 1px;
          height: calc(100% - 10px);
          background: linear-gradient(to bottom, rgba(59,130,246,0.3), rgba(255,255,255,0.05));
        }
        .step-num {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
          color: #60a5fa;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .step-title {
          color: rgba(255,255,255,0.88);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 3px;
          line-height: 1.3;
        }
        .step-desc {
          color: rgba(255,255,255,0.35);
          font-size: 12px;
          line-height: 1.5;
        }

        /* trust strip */
        .trust-strip {
          display: flex;
          gap: 20px;
          margin-top: auto;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          font-weight: 500;
        }
        .trust-icon {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .left-footer {
          color: rgba(255,255,255,0.18);
          font-size: 11px;
          margin-top: 20px;
        }

        /* ══════════════ RIGHT PANEL ══════════════ */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          background: #eef1fb;
        }

        .form-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 52px 44px;
          width: 100%;
          max-width: 440px;
          box-shadow:
            0 0 0 1px rgba(13,27,75,0.07),
            0 20px 60px rgba(13,27,75,0.10);
        }

        /* card top: logo */
        .card-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
        }
        .card-logo img {
          height: 52px; width: 52px;
          object-fit: contain;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(13,27,75,0.12);
        }
        .card-logo-name {
          font-size: 19px;
          font-weight: 800;
          color: #0d1b4b;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .card-logo-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 3px;
          font-weight: 500;
        }

        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #0d1b4b;
          margin-bottom: 6px;
          letter-spacing: -0.025em;
        }
        .form-sub {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 32px;
          font-weight: 400;
        }

        .field-group { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 14px;
          color: #cbd5e1; display: flex; pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 14px 46px;
          border: 1.5px solid #e8ecf4;
          border-radius: 12px;
          font-size: 15px;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .login-input::placeholder { color: #c0cad8; }
        .login-input:focus {
          border-color: #0d1b4b;
          box-shadow: 0 0 0 4px rgba(13,27,75,0.07);
          background: #ffffff;
        }
        .eye-btn {
          position: absolute; right: 13px;
          background: none; border: none;
          cursor: pointer; color: #c0cad8;
          display: flex; padding: 5px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .eye-btn:hover { color: #0d1b4b; background: #f0f2f8; }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #0d1b4b;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          box-shadow: 0 8px 24px rgba(13,27,75,0.25);
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          background: #162057;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(13,27,75,0.30);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .form-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
          font-size: 11px;
          color: #c0cad8;
          line-height: 1.7;
        }

        /* ── TABLET ── */
        @media (max-width: 900px) {
          .login-left { width: 44%; padding: 36px 36px; }
          .left-heading { font-size: 26px; }
          .form-card { padding: 40px 32px; }
        }
        @media (max-width: 768px) {
          .login-left { width: 42%; padding: 28px 24px; }
          .left-heading { font-size: 22px; margin-bottom: 10px; }
          .left-sub { font-size: 13px; margin-bottom: 32px; }
          .step-desc { font-size: 11px; }
          .trust-strip { gap: 12px; }
          .form-card { padding: 32px 24px; border-radius: 18px; }
          .form-title { font-size: 22px; }
        }

        /* ── MOBILE ── */
        @media (max-width: 520px) {
          .login-left { width: 40%; padding: 20px 16px; }
          .left-badge { font-size: 9px; padding: 5px 10px; margin-bottom: 20px; }
          .left-heading { font-size: 15px; margin-bottom: 8px; }
          .left-sub { display: none; }
          .how-label { font-size: 9px; margin-bottom: 12px; }
          .step-item { gap: 10px; padding-bottom: 16px; }
          .step-num { width: 26px; height: 26px; font-size: 9px; }
          .step-item:not(:last-child)::before { left: 12px; top: 28px; }
          .step-title { font-size: 11px; }
          .step-desc { display: none; }
          .trust-strip { display: none; }
          .left-footer { display: none; }
          .login-right { padding: 12px 10px; }
          .form-card { padding: 24px 16px; border-radius: 16px; }
          .card-logo { margin-bottom: 22px; padding-bottom: 18px; }
          .card-logo img { height: 40px; width: 40px; border-radius: 10px; }
          .card-logo-name { font-size: 16px; }
          .form-title { font-size: 19px; }
          .form-sub { font-size: 12px; margin-bottom: 22px; }
          .login-input { font-size: 14px; padding: 12px 40px; border-radius: 10px; }
          .submit-btn { font-size: 15px; padding: 14px; border-radius: 10px; }
          .field-group { margin-bottom: 14px; }
        }
        @media (max-width: 380px) {
          .login-left { width: 36%; padding: 16px 12px; }
          .left-heading { font-size: 13px; }
          .step-title { font-size: 10px; }
          .form-card { padding: 20px 14px; }
          .form-title { font-size: 17px; }
        }
      `}</style>

      <div className="login-page">

        {/* ══ LEFT ══ */}
        <div className="login-left">
          <div className="left-inner">
            <div>
              <div className="left-badge">
                <span className="left-badge-dot" />
                HR Onboarding Portal
              </div>

              <h2 className="left-heading">
                Employee<br />
                Onboarding<br />
                <span>Management</span><br />
                System
              </h2>
              <p className="left-sub">
                Streamline your HR processes with our comprehensive digital onboarding platform built for modern teams.
              </p>

              <div className="how-label">How it works</div>
              <div className="steps-list">
                {steps.map(s => (
                  <div key={s.num} className="step-item">
                    <div className="step-num">{s.num}</div>
                    <div>
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="trust-strip">
                {[['🔒', 'Secure & Encrypted'], ['⚡', 'Fast Onboarding'], ['📋', 'Paperless Process']].map(([icon, label]) => (
                  <div key={label} className="trust-item">
                    <div className="trust-icon">{icon}</div>
                    {label}
                  </div>
                ))}
              </div>
              <p className="left-footer">© 2026 Zayron Infotech Pvt. Ltd.</p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="login-right">
          <div className="form-card">

            <div className="card-logo">
              <img src="/static/img/logo1.png" alt="Zayron Infotech" />
              <div>
                <div className="card-logo-name">Zayron Infotech</div>
                <div className="card-logo-sub">HR Onboarding Portal</div>
              </div>
            </div>

            <h1 className="form-title">Welcome back</h1>
            <p className="form-sub">Sign in to continue to your HR portal</p>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input type="text" className="login-input" placeholder="Enter your username"
                    value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    required autoFocus autoComplete="username" />
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
                  <input type={showPass ? 'text' : 'password'} className="login-input" placeholder="Enter your password"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required autoComplete="current-password" />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                    {showPass
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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

            <div className="form-footer">
              © 2026 Zayron Infotech Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
