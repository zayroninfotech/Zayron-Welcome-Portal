import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout({ title, actions, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const initials = (user?.full_name || user?.username || 'A')[0].toUpperCase()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

  const sidebarW = collapsed ? 72 : 248

  return (
    <>
      <style>{`
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 99;
        }
        .sidebar-overlay.open { display: block; }

        .ham-btn {
          display: flex;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          background: none; border: none;
          cursor: pointer;
          color: #64748b;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .ham-btn:hover { background: #f1f5f9; color: #0f172a; }

        .notif-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: none; border: none;
          cursor: pointer; color: #94a3b8; position: relative;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .notif-btn:hover { background: #f1f5f9; color: #475569; }

        @media (max-width: 768px) {
          .layout-sidebar { transform: translateX(-100%); transition: transform 0.25s ease; }
          .layout-sidebar.open { transform: translateX(0) !important; }
          .main-content-wrap { margin-left: 0 !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>

        {/* Mobile overlay */}
        <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main */}
        <div
          className="main-content-wrap"
          style={{ flex: 1, marginLeft: sidebarW, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'margin-left 0.25s ease' }}
        >

          {/* ── HEADER ── */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: '#ffffff',
            borderBottom: '1px solid #e8ecf4',
            height: 64,
            display: 'flex', alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}>

            {/* Hamburger — always visible */}
            <button
              className="ham-btn"
              onClick={() => { setCollapsed(v => !v); setMobileOpen(v => !v) }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed
                ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="15" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
              }
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: '#e8ecf4', flexShrink: 0 }} />

            {/* Page title + date */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{today}</div>
            </div>

            {/* Page actions */}
            {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}

            {/* Notification bell */}
            <button className="notif-btn">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: '#ef4444', border: '2px solid white',
              }} />
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: '#e8ecf4', flexShrink: 0 }} />

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: '#f8fafc', border: '1px solid #e8ecf4',
              borderRadius: 12, padding: '6px 14px 6px 7px',
              cursor: 'default', userSelect: 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0,
                boxShadow: '0 2px 6px rgba(79,70,229,0.35)',
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
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
    </>
  )
}
