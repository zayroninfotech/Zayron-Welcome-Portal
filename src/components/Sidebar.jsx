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

export default function Sidebar({ collapsed = false, open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }
  const initials = (user?.full_name || user?.username || 'A')[0].toUpperCase()
  const w = collapsed ? 72 : 248

  return (
    <>
      <style>{`
        .sidebar-link-tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%; transform: translateY(-50%);
          background: #1e293b;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 200;
        }
        .sidebar-link-tooltip::before {
          content: '';
          position: absolute;
          right: 100%; top: 50%; transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1e293b;
        }
        .sidebar-nav-link:hover .sidebar-link-tooltip { opacity: 1; }
        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          margin-bottom: 2px;
          transition: background 0.15s, color 0.15s;
          position: relative;
          overflow: ${collapsed ? 'visible' : 'hidden'};
          justify-content: ${collapsed ? 'center' : 'flex-start'};
        }
        .sidebar-nav-link:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
        .sidebar-nav-link.active { background: rgba(99,102,241,0.25); color: white; font-weight: 600; }
        .sidebar-nav-link .link-label {
          white-space: nowrap;
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          max-width: ${collapsed ? 0 : 160}px;
          transition: opacity 0.2s, max-width 0.2s;
          pointer-events: ${collapsed ? 'none' : 'auto'};
        }
        .sidebar-section-title {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: ${collapsed ? '0' : '0 10px'};
          margin-bottom: 6px;
          color: rgba(255,255,255,0.3);
          text-align: ${collapsed ? 'center' : 'left'};
          overflow: hidden;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          height: ${collapsed ? 0 : 'auto'};
          margin-top: ${collapsed ? 0 : 'inherit'};
          transition: opacity 0.2s;
        }
        .logout-label {
          white-space: nowrap; overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          max-width: ${collapsed ? 0 : 120}px;
          transition: opacity 0.2s, max-width 0.2s;
        }
        .user-info-wrap {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          max-width: ${collapsed ? 0 : 160}px;
          transition: opacity 0.2s, max-width 0.2s;
          white-space: nowrap;
        }
      `}</style>

      <aside
        className={`layout-sidebar ${open ? 'open' : ''}`}
        style={{
          width: w,
          minWidth: w,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 12,
          padding: collapsed ? '20px 0' : '22px 20px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          overflow: 'hidden',
          transition: 'padding 0.25s, gap 0.25s',
        }}>
          <img src="/static/img/logo1.png" alt="Zayron" style={{ height: 38, width: 38, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} />
          <div style={{
            overflow: 'hidden', whiteSpace: 'nowrap',
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 160,
            transition: 'opacity 0.2s, max-width 0.2s',
          }}>
            <div style={{ color: 'white', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Zayron Infotech</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>HR Onboarding Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '16px 8px' : '16px 12px', transition: 'padding 0.25s' }}>
          {navItems.map(({ section, links }) => (
            <div key={section} style={{ marginBottom: collapsed ? 16 : 28 }}>
              <div className="sidebar-section-title">{section}</div>
              {collapsed && <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 4px 8px' }} />}
              {links.map(({ to, label, d }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
                >
                  <Icon d={d} size={18} />
                  <span className="link-label">{label}</span>
                  {collapsed && <span className="sidebar-link-tooltip">{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: collapsed ? '14px 8px 20px' : '14px 12px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          transition: 'padding 0.25s',
        }}>
          {/* User row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 10,
            padding: collapsed ? '10px 0' : '10px 10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            overflow: 'hidden',
            transition: 'padding 0.25s, gap 0.25s',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="user-info-wrap">
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.full_name || user?.username}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 10,
              width: '100%', padding: collapsed ? '9px 0' : '9px 12px',
              borderRadius: 9, color: 'rgba(255,255,255,0.5)',
              fontSize: 14, background: 'none', border: 'none',
              cursor: 'pointer', textAlign: 'left',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'padding 0.25s, gap 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
