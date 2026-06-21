import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '👥', label: 'Seamless employee onboarding' },
  { icon: '📄', label: 'Digital NDA signing' },
  { icon: '📁', label: 'Document management' },
  { icon: '📊', label: 'Real-time tracking' },
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }

        .login-page {
          min-height: 100vh;
          display: flex;
        }

        /* Left branding panel */
        .login-left {
          width: 45%;
          background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 48px 36px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .left-logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .left-logo-row img {
          height: 44px;
          width: 44px;
          object-fit: contain;
          border-radius: 10px;
        }
        .left-logo-name {
          color: white;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        }
        .left-logo-sub {
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          margin-top: 2px;
        }
        .left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0 20px;
        }
        .left-heading {
          color: white;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
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
          gap: 14px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.85);
          font-size: 14px;
        }
        .feature-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .left-footer {
          color: rgba(255,255,255,0.3);
          font-size: 11px;
        }

        /* Right form panel */
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
          border-radius: 20px;
          padding: 44px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.10);
          border: 1px solid #e2e8f0;
        }
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .form-header img {
          height: 56px;
          object-fit: contain;
          margin-bottom: 16px;
        }
        .form-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .form-sub {
          font-size: 13px;
          color: #64748b;
        }
        .field-group { margin-bottom: 20px; }
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
          left: 13px;
          color: #9ca3af;
          display: flex;
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 13px 44px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: white;
        }
        .eye-btn {
          position: absolute; right: 12px;
          background: none; border: none;
          cursor: pointer; color: #9ca3af;
          display: flex; padding: 4px;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          box-shadow: 0 4px 14px rgba(30,58,138,0.35);
          transition: opacity 0.2s, transform 0.1s;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        .form-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 11px;
          color: #94a3b8;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .login-page {
            flex-direction: column;
            min-height: 100vh;
          }

          /* Left panel becomes a compact top banner */
          .login-left {
            width: 100%;
            padding: 28px 24px 32px;
            min-height: auto;
          }
          .left-logo-row img { height: 38px; width: 38px; }
          .left-logo-name { font-size: 15px; }
          .left-body { padding: 24px 0 0; }
          .left-heading { font-size: 22px; margin-bottom: 10px; }
          .left-sub { font-size: 13px; margin-bottom: 24px; }
          .feature-list { gap: 10px; }
          .feature-item { font-size: 13px; }
          .feature-icon { width: 30px; height: 30px; font-size: 14px; border-radius: 8px; }
          .left-footer { display: none; }

          /* Right panel takes remaining space */
          .login-right {
            flex: 1;
            padding: 24px 16px 32px;
            background: #f0f4ff;
            align-items: flex-start;
          }
          .form-card {
            padding: 28px 22px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .form-header { margin-bottom: 24px; }
          .form-header img { height: 46px; margin-bottom: 12px; }
          .form-title { font-size: 20px; }
          .login-input { font-size: 16px; padding: 14px 44px; }
          .submit-btn { font-size: 16px; padding: 15px; border-radius: 12px; }
          .field-group { margin-bottom: 16px; }
        }

        @media (max-width: 400px) {
          .login-left { padding: 22px 18px 26px; }
          .form-card { padding: 24px 18px; }
          .left-heading { font-size: 19px; }
        }
      `}</style>

      <div className="login-page">
        {/* Left branding panel */}
        <div className="login-left">
          <div className="left-logo-row">
            <img src="/static/img/logo1.png" alt="Zayron Infotech" />
            <div>
              <div className="left-logo-name">Zayron Infotech</div>
              <div className="left-logo-sub">HR Onboarding Portal</div>
            </div>
          </div>

          <div className="left-body">
            <h2 className="left-heading">Employee Onboarding<br />Management System</h2>
            <p className="left-sub">Streamline your HR processes with our comprehensive onboarding portal.</p>
            <div className="feature-list">
              {features.map(f => (
                <div key={f.label} className="feature-item">
                  <div className="feature-icon">{f.icon}</div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="left-footer">© 2026 Zayron Infotech Pvt. Ltd.</p>
        </div>

        {/* Right form panel */}
        <div className="login-right">
          <div className="form-card">
            <div className="form-header">
              <img src="/static/img/logo1.png" alt="Zayron Infotech" />
              <h1 className="form-title">Welcome back</h1>
              <p className="form-sub">Sign in to your HR portal account</p>
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
                  : 'Sign In →'
                }
              </button>
            </form>

            <p className="form-footer">© 2026 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}
