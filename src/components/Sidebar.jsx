import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const navItems = [
  {
    section: 'MAIN',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', badge: null },
    ]
  },
  {
    section: 'EMPLOYEES',
    links: [
      { to: '/admin/employees', label: 'Employees', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z', badge: null },
      { to: '/admin/employees/new', label: 'Add Employee', icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12.5 7a4 4 0 1 1 0 .001 M20 8v6 M23 11h-6', badge: 'New' },
    ]
  },
  {
    section: 'PROJECTS',
    links: [
      { to: '/admin/projects', label: 'Project Tracker', icon: 'M3 3h18v18H3z M9 3v18 M3 9h6 M3 15h6', badge: null },
      { to: '/admin/projects/assign', label: 'Project Assign', icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z', badge: null },
    ]
  },
  {
    section: 'REPORTS',
    links: [
      { to: '/admin/reports', label: 'Reports & Export', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', badge: null },
    ]
  }
]

const SIDEBAR_W = 260

export default function Sidebar({ open = true, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }
  const initials = (user?.full_name || user?.username || 'A').slice(0, 2).toUpperCase()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <>
      <style>{`
        .sb-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 98;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .sb-overlay.open { opacity: 1; pointer-events: auto; }

        .sidebar-root {
          position: fixed; top: 0; left: 0;
          width: ${SIDEBAR_W}px;
          height: 100vh;
          background: #0d1b4b;
          display: flex; flex-direction: column;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          box-shadow: 4px 0 24px rgba(0,0,0,0.25);
        }
        .sidebar-root.open {
          transform: translateX(0);
        }

        /* inner gradient overlay */
        .sidebar-root::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 90% 100%, rgba(139,92,246,0.12) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }

        .sb-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; overflow-y: auto; }
        .sb-inner::-webkit-scrollbar { width: 4px; }
        .sb-inner::-webkit-scrollbar-track { background: transparent; }
        .sb-inner::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Logo area */
        .sb-logo {
          display: flex; align-items: center; gap: 12px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .sb-logo img { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .sb-logo-name { font-size: 15px; font-weight: 800; color: #fff; line-height: 1.2; letter-spacing: -0.01em; }
        .sb-logo-sub { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 2px; letter-spacing: 0.04em; }

        /* Greeting card */
        .sb-greeting {
          margin: 14px 14px 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 14px;
          padding: 14px 16px;
          flex-shrink: 0;
        }
        .sb-greeting-hi { font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 500; margin-bottom: 3px; }
        .sb-greeting-name { font-size: 14px; color: #fff; font-weight: 700; }
        .sb-greeting-role {
          display: inline-block; margin-top: 7px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          background: rgba(99,102,241,0.3); color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.35);
          border-radius: 20px; padding: 2px 10px;
          text-transform: uppercase;
        }

        /* Search */
        .sb-search {
          margin: 14px 14px 0;
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 9px 12px;
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
          cursor: text;
        }
        .sb-search:focus-within {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.08);
        }
        .sb-search input {
          background: none; border: none; outline: none;
          color: rgba(255,255,255,0.8); font-size: 13px; width: 100%;
          font-family: inherit;
        }
        .sb-search input::placeholder { color: rgba(255,255,255,0.25); }

        /* Nav */
        .sb-nav { flex: 1; padding: 16px 12px 8px; }
        .sb-section { margin-bottom: 6px; }
        .sb-section-label {
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.22);
          padding: 0 10px; margin-bottom: 4px;
          display: flex; align-items: center; gap: 8px;
        }
        .sb-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .sb-section-links { margin-bottom: 18px; }

        .sb-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.55);
          font-size: 13.5px; font-weight: 500;
          text-decoration: none;
          margin-bottom: 2px;
          transition: background 0.15s, color 0.15s, padding-left 0.15s;
          position: relative;
        }
        .sb-link:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }
        .sb-link.active {
          background: linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.1) 100%);
          color: #fff; font-weight: 600;
        }
        .sb-link.active::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 0 3px 3px 0;
          background: #818cf8;
        }
        .sb-link-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .sb-link:hover .sb-link-icon { background: rgba(255,255,255,0.1); }
        .sb-link.active .sb-link-icon { background: rgba(99,102,241,0.35); }
        .sb-badge {
          margin-left: auto;
          font-size: 9px; font-weight: 700;
          background: rgba(99,102,241,0.3); color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.3);
          padding: 2px 7px; border-radius: 20px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* Quick stats */
        .sb-stats {
          margin: 0 14px 14px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; flex-shrink: 0;
        }
        .sb-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 12px;
          text-align: center;
        }
        .sb-stat-val { font-size: 18px; font-weight: 800; color: #fff; line-height: 1; }
        .sb-stat-lbl { font-size: 9.5px; color: rgba(255,255,255,0.3); margin-top: 3px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

        /* Footer */
        .sb-footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 12px 14px 16px;
          flex-shrink: 0;
        }
        .sb-user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 8px;
        }
        .sb-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 13px; flex-shrink: 0;
          box-shadow: 0 3px 8px rgba(99,102,241,0.4);
        }
        .sb-uname { color: #fff; font-size: 13px; font-weight: 600; line-height: 1.2; }
        .sb-urole { color: rgba(255,255,255,0.35); font-size: 11px; margin-top: 2px; }
        .sb-logout {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 12px;
          border-radius: 9px; color: rgba(255,255,255,0.4);
          font-size: 13px; font-weight: 500;
          background: none; border: none;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, color 0.15s;
        }
        .sb-logout:hover { background: rgba(239,68,68,0.12); color: #fca5a5; }
        .sb-version { text-align: center; font-size: 10px; color: rgba(255,255,255,0.15); margin-top: 10px; }
      `}</style>

      {/* Overlay for mobile */}
      <div className={`sb-overlay ${open ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar-root ${open ? 'open' : ''}`}>
        <div className="sb-inner">

          {/* Logo */}
          <div className="sb-logo">
            <img src="/static/img/logo1.png" alt="Zayron" />
            <div>
              <div className="sb-logo-name">Zayron Infotech</div>
              <div className="sb-logo-sub">HR Onboarding Portal</div>
            </div>
          </div>

          {/* Greeting */}
          <div className="sb-greeting">
            <div className="sb-greeting-hi">{greeting} 👋</div>
            <div className="sb-greeting-name">{user?.full_name || user?.username}</div>
            <div className="sb-greeting-role">{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
          </div>

          {/* Search */}
          <div className="sb-search">
            <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Quick search…" />
          </div>

          {/* Nav */}
          <nav className="sb-nav">
            {navItems.map(({ section, links }) => (
              <div key={section} className="sb-section">
                <div className="sb-section-label">{section}</div>
                <div className="sb-section-links">
                  {links.map(({ to, label, icon, badge }) => (
                    <NavLink key={to} to={to}
                      className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                      <span className="sb-link-icon">
                        <Icon d={icon} size={16} />
                      </span>
                      {label}
                      {badge && <span className="sb-badge">{badge}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Quick stats */}
          <div className="sb-stats">
            {[['👥', 'Employees', '—'], ['✅', 'Completed', '—']].map(([ico, lbl, val]) => (
              <div key={lbl} className="sb-stat">
                <div style={{ fontSize: 18, marginBottom: 4 }}>{ico}</div>
                <div className="sb-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">{initials}</div>
              <div>
                <div className="sb-uname">{user?.full_name || user?.username}</div>
                <div className="sb-urole">{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</div>
              </div>
            </div>
            <button className="sb-logout" onClick={handleLogout}>
              <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={16} />
              Sign Out
            </button>
            <div className="sb-version">v1.0 · Zayron Infotech © 2026</div>
          </div>

        </div>
      </aside>
    </>
  )
}
