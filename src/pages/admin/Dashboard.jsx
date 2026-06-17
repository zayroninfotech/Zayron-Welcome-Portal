import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '20', color }}>{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
)

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
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

  return (
    <Layout title="Dashboard" actions={
      <Link to="/admin/employees/new" className="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        Add Employee
      </Link>
    }>
      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="👥" value={stats?.total ?? 0} label="Total Employees" color="#1e40af" />
        <StatCard icon="⏳" value={stats?.pending ?? 0} label="Pending Onboarding" color="#d97706" />
        <StatCard icon="📝" value={stats?.nda_signed ?? 0} label="NDA Signed" color="#7c3aed" />
        <StatCard icon="✅" value={stats?.completed ?? 0} label="Completed" color="#059669" />
        <StatCard icon="🏢" value={stats?.permanent ?? 0} label="Permanent" color="#0ea5e9" />
        <StatCard icon="📋" value={stats?.contract ?? 0} label="Contract" color="#ec4899" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Employees */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Employees</h2>
            <Link to="/admin/employees" style={{ fontSize: 13, color: 'var(--primary-light)' }}>View all →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_employees?.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 24 }}>No employees yet</td></tr>
                )}
                {stats?.recent_employees?.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <Link to={`/admin/employees/${emp.id}`} style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{emp.name}</Link>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{emp.email}</div>
                    </td>
                    <td><span className={`badge badge-${emp.employee_type}`}>{emp.employee_type}</span></td>
                    <td><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* By Department */}
        <div className="card">
          <div className="card-header"><h2>By Department</h2></div>
          <div className="card-body">
            {stats?.by_department?.length === 0 && (
              <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '20px 0' }}>No data yet</p>
            )}
            {stats?.by_department?.map(d => (
              <div key={d.department} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{d.department}</span>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{d.count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(d.count / (stats?.total || 1)) * 100}%`,
                    background: 'var(--primary)',
                    borderRadius: 4,
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
