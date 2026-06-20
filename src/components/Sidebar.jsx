import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

// Flow step shown between sections
function FlowArrow({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0 6px', gap: 2 }}>
      <div style={{ width: 1, height: 10, background: 'rgba(99,102,241,0.35)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 1, height: 10, background: 'rgba(99,102,241,0.35)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '3px 10px' }}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(165,180,252,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span style={{ fontSize: 9, color: 'rgba(165,180,252,0.8)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }
  const initials = (user?.full_name || user?.username || 'A')[0].toUpperCase()

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoWrap}>
        <img src="/static/img/logo1.png" alt="Zayron Infotech" style={s.logoImg} />
        <div>
          <div style={s.logoName}>Zayron Infotech</div>
          <div style={s.logoSub}>HR Onboarding Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={s.nav}>

        {/* Step 1: Main */}
        <div style={s.section}>
          <div style={s.sectionLabel}>
            <span style={s.stepBadge}>1</span>
            <span style={s.sectionTitle}>MAIN</span>
          </div>
          <NavLink to="/admin/dashboard" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
            Dashboard
          </NavLink>
        </div>

        <FlowArrow label="Manage" />

        {/* Step 2: Employees */}
        <div style={s.section}>
          <div style={s.sectionLabel}>
            <span style={s.stepBadge}>2</span>
            <span style={s.sectionTitle}>EMPLOYEES</span>
          </div>
          <NavLink to="/admin/employees" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
            Employees
          </NavLink>
          <NavLink to="/admin/employees/new" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            <Icon d="M12 5v14 M5 12h14" />
            Add Employee
          </NavLink>
        </div>

        <FlowArrow label="NDA Completed" />

        {/* Step 3: Projects */}
        <div style={s.section}>
          <div style={s.sectionLabel}>
            <span style={{ ...s.stepBadge, background: 'rgba(139,92,246,0.35)', color: '#c4b5fd' }}>3</span>
            <span style={s.sectionTitle}>PROJECTS</span>
          </div>
          {/* Flow hint */}
          <div style={s.flowHint}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(167,243,208,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />
            </svg>
            <span>Only completed employees can be assigned</span>
          </div>
          <NavLink to="/admin/projects" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            <Icon d="M3 3h18v18H3z M9 3v18 M3 9h6 M3 15h6" />
            Project Tracker
          </NavLink>
        </div>

        <FlowArrow label="Track Work" />

        {/* Step 4: Reports */}
        <div style={s.section}>
          <div style={s.sectionLabel}>
            <span style={{ ...s.stepBadge, background: 'rgba(16,185,129,0.25)', color: '#6ee7b7' }}>4</span>
            <span style={s.sectionTitle}>REPORTS</span>
          </div>
          <NavLink to="/admin/reports" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
            <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
            Reports & Export
          </NavLink>
        </div>

      </nav>

      {/* User footer */}
      <div style={s.footer}>
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.userInfo}>
            <div style={s.userName}>{user?.full_name || user?.username}</div>
            <div style={s.userRole}>{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={s.logoutBtn}>
          <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
          Logout
        </button>
      </div>
    </aside>
  )
}

const s = {
  sidebar: {
    width: 'var(--sidebar-w)',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
    position: 'fixed',
    top: 0, left: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflowY: 'auto',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '22px 20px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logoImg: { height: 38, width: 38, objectFit: 'contain', borderRadius: 8, flexShrink: 0 },
  logoName: { color: 'white', fontSize: 14, fontWeight: 700, lineHeight: 1.2 },
  logoSub: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 },
  nav: { flex: 1, padding: '16px 12px' },
  section: { marginBottom: 4 },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '0 10px',
    marginBottom: 6,
  },
  stepBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.3)',
    color: '#a5b4fc',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  flowHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: 6,
    padding: '4px 10px',
    margin: '0 0 6px',
    fontSize: 10,
    color: 'rgba(167,243,208,0.7)',
    lineHeight: 1.4,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 9,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: 400,
    textDecoration: 'none',
    marginBottom: 2,
    transition: 'all 0.15s',
  },
  linkActive: {
    background: 'rgba(99,102,241,0.25)',
    color: 'white',
    fontWeight: 600,
  },
  footer: {
    padding: '14px 12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 10px 12px',
  },
  avatar: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  userInfo: {},
  userName: { color: 'white', fontSize: 13, fontWeight: 600 },
  userRole: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '9px 12px',
    borderRadius: 9,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
}
