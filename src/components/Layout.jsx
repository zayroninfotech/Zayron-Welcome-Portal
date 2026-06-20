import Sidebar from './Sidebar'

export default function Layout({ title, actions, children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        {/* Top Header Bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 60,
        }}>
          {/* Left: Logo + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/static/img/logo1.png" alt="Zayron" style={{ height: 34, width: 34, objectFit: 'contain', borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', lineHeight: 1.2 }}>Zayron Infotech</div>
              <div style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.05em' }}>HR Onboarding Portal</div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {actions}
          </div>
        </div>

        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
