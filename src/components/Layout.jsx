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
          {/* Left: empty spacer */}
          <div style={{ flex: 1 }} />

          {/* Right: Logo + Name + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {actions}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0f5ff', borderRadius: 12, padding: '8px 16px', border: '1px solid #dbeafe' }}>
              <img src="/static/img/logo1.png" alt="Zayron" style={{ height: 42, width: 42, objectFit: 'contain', borderRadius: 10 }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1e40af', lineHeight: 1.2, letterSpacing: '-0.01em' }}>Zayron Infotech</div>
                <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.04em', marginTop: 2 }}>HR Onboarding Portal</div>
              </div>
            </div>
          </div>
        </div>

        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
