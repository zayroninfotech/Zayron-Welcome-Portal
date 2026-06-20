import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const navItems = [
  {
    section: 'MAIN',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
    ]
  },
  {
    section: 'EMPLOYEES',
    links: [
      { to: '/admin/employees', label: 'Employees', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z' },
      { to: '/admin/employees/new', label: 'Add Employee', d: 'M12 5v14 M5 12h14' },
    ]
  },
  {
    section: 'PROJECTS',
    links: [
      { to: '/admin/projects', label: 'Project Tracker', d: 'M3 3h18v18H3z M9 3v18 M3 9h6 M3 15h6' },
      { to: '/admin/projects/assign', label: 'Project Assign', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z M12 11l4 4-4 4' },
    ]
  },
  {
    section: 'REPORTS',
    links: [
      { to: '/admin/reports', label: 'Reports & Export', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    ]
  }
]

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
        {navItems.map(({ section, links }) => (
          <div key={section} style={s.section}>
            <div style={s.sectionTitle}>{section}</div>
            {links.map(({ to, label, d }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
                <Icon d={d} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
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
  section: { marginBottom: 28 },
  sectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0 10px',
    marginBottom: 6,
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
