import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout({ title, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const initials = (user?.full_name || user?.username || 'A')[0].toUpperCase()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
      <style>{`
        /* Mobile overlay */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 99;
        }
        .sidebar-overlay.open { display: block; }

        @media (max-width: 768px) {
          .layout-sidebar { transform: translateX(-100%); transition: transform 0.25s ease; }
          .layout-sidebar.open { transform: translateX(0) !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      <div className="layout" style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>

        {/* Mobile overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main */}
        <div className="main-content" style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* ── HEADER ── */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: '#ffffff',
            borderBottom: '1px solid #e8ecf4',
            height: 64,
            display: 'flex', alignItems: 'center',
            padding: '0 24px',
            gap: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                display: 'none',
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 6, borderRadius: 8,
                color: '#64748b',
              }}
              className="hamburger-btn"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Page title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{today}</div>
            </div>

            {/* Actions slot */}
            {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}

            {/* Divider */}
            <div style={{ width: 1, height: 32, background: '#e8ecf4', flexShrink: 0 }} />

            {/* Notification bell */}
            <button style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: 8, borderRadius: 9,
              color: '#94a3b8', position: 'relative',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8' }}
            >
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {/* red dot */}
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7, borderRadius: '50%',
                background: '#ef4444', border: '2px solid white',
              }} />
            </button>

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#f8fafc', border: '1px solid #e8ecf4',
              borderRadius: 12, padding: '7px 14px 7px 8px',
              cursor: 'default',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                  {user?.full_name || user?.username}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            </div>

          </header>

          <main className="page-content">{children}</main>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
