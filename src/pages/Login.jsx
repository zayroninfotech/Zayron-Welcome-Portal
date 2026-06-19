import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

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
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h2 style={styles.leftHeading}>Employee Onboarding<br />Management System</h2>
          <p style={styles.leftSub}>Streamline your HR processes with our comprehensive onboarding portal.</p>
          <div style={styles.featureList}>
            {['Seamless employee onboarding', 'Digital NDA signing', 'Document management', 'Real-time tracking'].map(f => (
              <div key={f} style={styles.featureItem}>
                <span style={styles.featureDot}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={styles.leftFooter}>© 2026 Zayron Infotech Pvt. Ltd.</p>
      </div>

      {/* Right panel — form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <img src="/static/img/logo1.png" alt="Zayron Infotech" style={styles.formLogo} />
            <h1 style={styles.formTitle}>Welcome back</h1>
            <p style={styles.formSub}>Sign in to your HR portal account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  style={styles.input}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  {showPass
                    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
            >
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in...</>
                : 'Sign In →'
              }
            </button>
          </form>

          <p style={styles.formFooter}>
            © 2026 Zayron Infotech Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  // Left branding panel
  leftPanel: {
    width: '45%',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px 48px 36px',
    position: 'relative',
    overflow: 'hidden',
  },
  leftContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  leftLogo: { height: 56, objectFit: 'contain', marginBottom: 36 },
  leftHeading: { color: 'white', fontSize: 28, fontWeight: 700, lineHeight: 1.3, marginBottom: 14 },
  leftSub: { color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 },
  featureList: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  featureDot: { width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#60efb0', flexShrink: 0 },
  leftFooter: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 32 },

  // Right form panel
  rightPanel: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  formCard: {
    background: 'white',
    borderRadius: 20,
    padding: '44px 40px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
    border: '1px solid #e2e8f0',
  },
  formHeader: { textAlign: 'center', marginBottom: 32 },
  formLogo: { height: 48, objectFit: 'contain', marginBottom: 20 },
  formTitle: { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 6 },
  formSub: { fontSize: 13, color: '#64748b' },

  // Fields
  fieldGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 13, color: '#9ca3af', display: 'flex', pointerEvents: 'none' },
  input: {
    width: '100%',
    padding: '11px 42px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 12, background: 'none', border: 'none',
    cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 2,
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(30,58,138,0.35)',
    transition: 'opacity 0.2s',
  },
  formFooter: { textAlign: 'center', marginTop: 28, fontSize: 11, color: '#94a3b8' },
}
