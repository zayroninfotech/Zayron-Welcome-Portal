import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Zayron Infotech</h2>
        <p>HR Onboarding Portal</p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Main</div>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/employees" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
            Employees
          </NavLink>
          <NavLink to="/admin/employees/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon d="M12 5v14 M5 12h14" />
            Add Employee
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Reports</div>
          <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
            Reports & Export
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{(user?.full_name || user?.username || 'A')[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <p>{user?.full_name || user?.username}</p>
            <span>{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full mt-2" style={{ cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left' }}>
          <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
          Logout
        </button>
      </div>
    </aside>
  )
}
