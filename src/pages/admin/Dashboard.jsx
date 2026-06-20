import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const DEPT_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']

const StatCard = ({ icon, value, label, color, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '22px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f5',
    display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: color, borderRadius: '16px 0 0 16px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
      </div>
      <div style={{ background: color + '18', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
        {icon}
      </div>
    </div>
  </div>
)

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
    nda_signed: { bg: '#ede9fe', color: '#7c3aed', label: 'NDA Signed' },
    completed: { bg: '#d1fae5', color: '#059669', label: 'Completed' },
  }
  const s = map[status] || { bg: '#f3f4f6', color: '#6b7280', label: status }
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function TypeBadge({ type }) {
  const map = {
    permanent: { bg: '#dbeafe', color: '#1d4ed8' },
    contract: { bg: '#fce7f3', color: '#be185d' },
    intern: { bg: '#d1fae5', color: '#065f46' },
  }
  const s = map[type] || { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
      {type}
    </span>
  )
}

function Avatar({ name }) {
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const colors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6']
  const color = colors[name?.charCodeAt(0) % colors.length] || '#6366f1'
  return (
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/employees/dashboard/stats/').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout title="Dashboard">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <span className="spinner-dark spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    </Layout>
  )

  const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <Layout title="Dashboard" actions={
      <Link to="/admin/employees/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        Add Employee
      </Link>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard icon="👥" value={stats?.total ?? 0} label="Total Employees" color="#1e40af" />
          <StatCard icon="⏳" value={stats?.pending ?? 0} label="Pending Onboarding" color="#d97706" />
          <StatCard icon="📝" value={stats?.nda_signed ?? 0} label="NDA Signed" color="#7c3aed" />
          <StatCard icon="✅" value={stats?.completed ?? 0} label="Completed" color="#059669" sub={`${completionRate}% completion rate`} />
          <StatCard icon="🏢" value={stats?.permanent ?? 0} label="Permanent" color="#0ea5e9" />
          <StatCard icon="📋" value={stats?.contract ?? 0} label="Contract" color="#ec4899" />
        </div>

        {/* Completion Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #6366f1 100%)', borderRadius: 16, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#bfdbfe', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Overall Onboarding Progress</div>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 800 }}>{completionRate}% Complete</div>
            <div style={{ color: '#93c5fd', fontSize: 13, marginTop: 2 }}>{stats?.completed} of {stats?.total} employees fully onboarded</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: 120, height: 120, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3"
                  strokeDasharray={`${completionRate} ${100 - completionRate}`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', color: '#fff', fontWeight: 800, fontSize: 20 }}>{completionRate}%</div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

          {/* Recent Employees */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f5', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Employees</h2>
              <Link to="/admin/employees" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ padding: '8px 0' }}>
              {stats?.recent_employees?.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: 13 }}>No employees yet</div>
              )}
              {stats?.recent_employees?.map((emp, i) => (
                <Link key={emp.id} to={`/admin/employees/${emp.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Avatar name={emp.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <TypeBadge type={emp.employee_type} />
                    <StatusBadge status={emp.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* By Department */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f5', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>By Department</h2>
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {stats?.by_department?.length === 0 && (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '12px 0', fontSize: 13 }}>No data yet</p>
              )}
              {stats?.by_department?.map((d, i) => (
                <div key={d.department}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{d.department}</span>
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{d.count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>emp</span></span>
                  </div>
                  <div style={{ height: 8, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(d.count / (stats?.total || 1)) * 100}%`,
                      background: DEPT_COLORS[i % DEPT_COLORS.length],
                      borderRadius: 6,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
