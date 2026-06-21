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
        body { font-family: 'Segoe UI', system-ui, sans-serif; }

        .login-page {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL — single solid dark blue, no decorations ── */
        .login-left {
          width: 45%;
          background: #0d1b4b;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 48px 40px;
        }

        .left-top-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 28px;
        }
        .left-top-label span { width: 6px; height: 6px; border-radius: 50%; background: #60a5fa; display: inline-block; }

        .left-heading {
          color: white;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.22;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .left-sub {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 44px;
        }

        /* Onboarding steps */
        .steps-title {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .step-item {
          display: flex;
          gap: 16px;
          padding-bottom: 20px;
          position: relative;
        }
        .step-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 17px;
          top: 36px;
          width: 1px;
          height: calc(100% - 16px);
          background: rgba(255,255,255,0.1);
        }
        .step-num {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #93c5fd;
          flex-shrink: 0;
        }
        .step-body {}
        .step-title {
          color: rgba(255,255,255,0.88);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 2px;
          line-height: 1.3;
          padding-top: 6px;
        }
        .step-desc {
          color: rgba(255,255,255,0.38);
          font-size: 12px;
          line-height: 1.5;
        }

        .left-footer {
          color: rgba(255,255,255,0.25);
          font-size: 11px;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          flex: 1;
          background: #eef2ff;
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
          box-shadow: 0 12px 48px rgba(13,27,75,0.10);
          border: 1px solid #e2e8f0;
        }

        .form-header {
          margin-bottom: 36px;
          text-align: center;
        }
        .form-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid #f1f5f9;
        }
        .form-logo-wrap img {
          height: 50px; width: 50px;
          object-fit: contain;
          border-radius: 12px;
        }
        .form-logo-name {
          font-size: 18px;
          font-weight: 800;
          color: #0d1b4b;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-align: left;
        }
        .form-logo-sub {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
          text-align: left;
        }
        .form-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .form-sub {
          font-size: 13px;
          color: #64748b;
        }

        .field-group { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
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
          border-color: #0d1b4b;
          box-shadow: 0 0 0 3px rgba(13,27,75,0.08);
          background: white;
        }
        .eye-btn {
          position: absolute; right: 13px;
          background: none; border: none;
          cursor: pointer; color: #9ca3af;
          display: flex; padding: 4px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #0d1b4b; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #0d1b4b;
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
          box-shadow: 0 6px 20px rgba(13,27,75,0.28);
          transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f1f5f9; }
        .divider-text { font-size: 11px; color: #94a3b8; white-space: nowrap; }

        .form-footer {
          text-align: center; margin-top: 20px;
          font-size: 11px; color: #94a3b8; line-height: 1.6;
        }

        /* ── TABLET ── */
        @media (max-width: 768px) {
          .login-left { width: 42%; padding: 28px 24px; }
          .left-heading { font-size: 22px; }
          .left-sub { font-size: 12px; margin-bottom: 28px; }
          .step-title { font-size: 12px; }
          .step-desc { font-size: 11px; }
          .form-card { padding: 32px 26px; }
          .form-title { font-size: 20px; }
        }

        /* ── MOBILE ── */
        @media (max-width: 500px) {
          .login-left { width: 38%; padding: 20px 14px; }
          .left-top-label { font-size: 9px; padding: 4px 10px; margin-bottom: 18px; }
          .left-heading { font-size: 14px; margin-bottom: 8px; }
          .left-sub { display: none; }
          .steps-title { font-size: 9px; margin-bottom: 10px; }
          .step-item { gap: 10px; padding-bottom: 14px; }
          .step-num { width: 26px; height: 26px; font-size: 9px; }
          .step-item:not(:last-child)::before { left: 12px; top: 28px; }
          .step-title { font-size: 11px; padding-top: 4px; }
          .step-desc { display: none; }
          .left-footer { display: none; }
          .login-right { padding: 14px 10px; }
          .form-card { padding: 22px 16px; border-radius: 16px; }
          .form-logo-wrap { margin-bottom: 16px; padding-bottom: 16px; }
          .form-logo-wrap img { height: 38px; width: 38px; }
          .form-logo-name { font-size: 15px; }
          .form-title { font-size: 18px; }
          .form-sub { font-size: 12px; }
          .login-input { font-size: 14px; padding: 12px 38px; }
          .submit-btn { font-size: 14px; padding: 13px; border-radius: 9px; }
          .field-group { margin-bottom: 14px; }
          .form-footer { font-size: 10px; margin-top: 16px; }
        }

        @media (max-width: 360px) {
          .login-left { width: 35%; padding: 14px 10px; }
          .left-heading { font-size: 12px; }
          .step-title { font-size: 10px; }
          .form-card { padding: 18px 12px; }
          .form-title { font-size: 16px; }
        }
      `}</style>

      <div className="login-page">

        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <div>
            <div className="left-top-label"><span />HR Onboarding Portal</div>
            <h2 className="left-heading">Employee Onboarding<br />Management System</h2>
            <p className="left-sub">Streamline your HR processes with our comprehensive digital onboarding portal.</p>

            <div className="steps-title">How it works</div>
            <div className="steps-list">
              {steps.map(s => (
                <div key={s.num} className="step-item">
                  <div className="step-num">{s.num}</div>
                  <div className="step-body">
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="left-footer">© 2026 Zayron Infotech Pvt. Ltd.</p>
        </div>

        {/* ── RIGHT PANEL ── */}
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
                      ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in...</> : <>Sign In →</>}
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
