import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import PageLoader from '../../components/PageLoader'
import api from '../../api/axios'

const DEPT_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']

function Avatar({ name, size = 36 }) {
  const initials = name?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
  const colors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6']
  const color = colors[(name?.charCodeAt(0)||0) % colors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize: size*0.38, flexShrink:0 }}>
      {initials}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending:    { bg:'#fef3c7', color:'#d97706', label:'Pending' },
    nda_signed: { bg:'#ede9fe', color:'#7c3aed', label:'NDA Signed' },
    completed:  { bg:'#d1fae5', color:'#059669', label:'Completed' },
  }
  const s = map[status] || { bg:'#f3f4f6', color:'#6b7280', label: status }
  return <span style={{ background:s.bg, color:s.color, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{s.label}</span>
}

function TypeBadge({ type }) {
  const map = {
    permanent: { bg:'#dbeafe', color:'#1d4ed8' },
    contract:  { bg:'#fce7f3', color:'#be185d' },
    intern:    { bg:'#d1fae5', color:'#065f46' },
  }
  const s = map[type] || { bg:'#f3f4f6', color:'#6b7280' }
  return <span style={{ background:s.bg, color:s.color, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{type}</span>
}

function StatCard({ icon, value, label, color, sub, to }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => to && navigate(to)} style={{
      background:'#fff', borderRadius:16, padding:'20px 22px',
      boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f0f0f5',
      position:'relative', overflow:'hidden', cursor: to ? 'pointer' : 'default',
      transition:'transform 0.15s, box-shadow 0.15s'
    }}
    onMouseEnter={e => { if(to){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.12)' }}}
    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.07)' }}>
      <div style={{ position:'absolute', top:0, left:0, width:4, height:'100%', background:color, borderRadius:'16px 0 0 16px' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:34, fontWeight:800, color:'#111827', lineHeight:1 }}>{value}</div>
          <div style={{ fontSize:12, color:'#6b7280', marginTop:6, fontWeight:500 }}>{label}</div>
          {sub && <div style={{ fontSize:11, color:color, marginTop:3, fontWeight:600 }}>{sub}</div>}
        </div>
        <div style={{ background:color+'18', borderRadius:12, width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{icon}</div>
      </div>
    </div>
  )
}

function DonutChart({ value, total, color, label }) {
  const pct = total ? Math.round((value/total)*100) : 0
  const r = 28, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <div style={{ position:'relative', width:72, height:72 }}>
        <svg viewBox="0 0 70 70" style={{ width:72, height:72, transform:'rotate(-90deg)' }}>
          <circle cx="35" cy="35" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7"/>
          <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition:'stroke-dasharray 0.6s ease' }}/>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#111827' }}>{pct}%</div>
      </div>
      <div style={{ fontSize:11, color:'#6b7280', fontWeight:600, textAlign:'center' }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:800, color }}>{value}</div>
    </div>
  )
}

function FunnelStep({ label, value, total, color, icon }) {
  const pct = total ? Math.round((value/total)*100) : 0
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
      <div style={{ background:color+'18', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{label}</span>
          <span style={{ fontSize:12, fontWeight:700, color }}>{value} <span style={{ color:'#9ca3af', fontWeight:400 }}>({pct}%)</span></span>
        </div>
        <div style={{ height:7, background:'#f3f4f6', borderRadius:6, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:6, transition:'width 0.6s ease' }}/>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/employees/dashboard/stats/').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader text="Loading Dashboard..." />

  const total = stats?.total || 0
  const completionRate = total ? Math.round((stats.completed / total) * 100) : 0
  const r = 60, circ = 2 * Math.PI * r
  const dash = (completionRate / 100) * circ

  return (
    <Layout title="Dashboard">
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

        {/* Welcome Card */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14 }}>
          <div style={{ gridColumn:'span 2', background:'linear-gradient(135deg,#1e40af,#6366f1)', borderRadius:16, padding:'24px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:130 }}>
            <div>
              <div style={{ color:'#bfdbfe', fontSize:12, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>Welcome Back 👋</div>
              <div style={{ color:'#fff', fontSize:26, fontWeight:800, marginTop:6 }}>HR Onboarding Dashboard</div>
              <div style={{ color:'#93c5fd', fontSize:13, marginTop:4 }}>Manage employees, track progress and projects</div>
            </div>
            <div style={{ color:'#bfdbfe', fontSize:12, marginTop:16 }}>{new Date().toLocaleDateString('en-IN',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#059669,#10b981)', borderRadius:16, padding:'24px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ color:'#a7f3d0', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Completion Rate</div>
            <div>
              <div style={{ color:'#fff', fontSize:40, fontWeight:900, lineHeight:1 }}>{completionRate}%</div>
              <div style={{ color:'#6ee7b7', fontSize:12, marginTop:4 }}>{stats?.completed} of {total} onboarded</div>
              <div style={{ marginTop:10, height:6, background:'rgba(255,255,255,0.2)', borderRadius:4 }}>
                <div style={{ width:`${completionRate}%`, height:'100%', background:'#fff', borderRadius:4, transition:'width 0.6s' }}/>
              </div>
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#d97706,#f59e0b)', borderRadius:16, padding:'24px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ color:'#fef3c7', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Joining This Month</div>
            <div>
              <div style={{ color:'#fff', fontSize:40, fontWeight:900, lineHeight:1 }}>{stats?.joining_this_month || 0}</div>
              <div style={{ color:'#fde68a', fontSize:12, marginTop:4 }}>New team members</div>
              <div style={{ color:'#fef3c7', fontSize:11, marginTop:8 }}>📅 {new Date().toLocaleDateString('en-IN',{ month:'long', year:'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          <StatCard icon="👥" value={total} label="Total Employees" color="#1e40af" to="/admin/employees" />
          <StatCard icon="⏳" value={stats?.pending??0} label="Pending Onboarding" color="#d97706" sub="Awaiting action" to="/admin/employees" />
          <StatCard icon="📝" value={stats?.nda_signed??0} label="NDA Signed" color="#7c3aed" sub="Step 2 pending" />
          <StatCard icon="✅" value={stats?.completed??0} label="Completed" color="#059669" sub={`${completionRate}% rate`} />
        </div>

        {/* Second row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          <StatCard icon="🏢" value={stats?.permanent??0} label="Permanent" color="#0ea5e9" />
          <StatCard icon="📋" value={stats?.contract??0} label="Contract" color="#ec4899" />
          <StatCard icon="🎓" value={stats?.intern??0} label="Intern" color="#10b981" />
        </div>

        {/* Main content grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20 }}>

          {/* Recent Employees */}
          <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f0f0f5', overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>Recent Employees</h2>
                <p style={{ fontSize:12, color:'#9ca3af', margin:'2px 0 0' }}>Latest additions to the team</p>
              </div>
              <Link to="/admin/employees" style={{ fontSize:12, color:'#2563eb', fontWeight:600, textDecoration:'none', background:'#eff6ff', padding:'5px 12px', borderRadius:20 }}>View all →</Link>
            </div>
            <div>
              {stats?.recent_employees?.map(emp => (
                <Link key={emp.id} to={`/admin/employees/${emp.id}`}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 24px', textDecoration:'none', borderBottom:'1px solid #f9fafb', transition:'background 0.12s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <Avatar name={emp.name} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:13, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{emp.name}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{emp.department || 'No department'} • {emp.email}</div>
                  </div>
                  <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                    <TypeBadge type={emp.employee_type} />
                    <StatusBadge status={emp.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Onboarding Funnel */}
            <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f0f0f5', overflow:'hidden' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f3f4f6' }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>Onboarding Funnel</h2>
              </div>
              <div style={{ padding:'8px 20px 16px' }}>
                <FunnelStep label="Total Invited" value={total} total={total} color="#1e40af" icon="📨" />
                <FunnelStep label="Pending" value={stats?.pending??0} total={total} color="#d97706" icon="⏳" />
                <FunnelStep label="NDA Signed" value={stats?.nda_signed??0} total={total} color="#7c3aed" icon="📝" />
                <FunnelStep label="Completed" value={stats?.completed??0} total={total} color="#059669" icon="✅" />
              </div>
            </div>

            {/* By Department */}
            <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f0f0f5', overflow:'hidden' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f3f4f6' }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#111827', margin:0 }}>By Department</h2>
              </div>
              <div style={{ padding:'12px 20px 16px', display:'flex', flexDirection:'column', gap:10 }}>
                {stats?.by_department?.map((d,i) => (
                  <div key={d.department}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{d.department}</span>
                      <span style={{ fontSize:12, fontWeight:700, color: DEPT_COLORS[i % DEPT_COLORS.length] }}>{d.count}</span>
                    </div>
                    <div style={{ height:7, background:'#f3f4f6', borderRadius:6, overflow:'hidden' }}>
                      <div style={{ width:`${(d.count/total)*100}%`, height:'100%', background:DEPT_COLORS[i%DEPT_COLORS.length], borderRadius:6, transition:'width 0.6s' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f0f0f5', padding:'20px 24px' }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:'#111827', margin:'0 0 16px' }}>Quick Actions</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              { icon:'👤', label:'Add Employee', sub:'Invite new team member', to:'/admin/employees/new', color:'#1e40af' },
              { icon:'👥', label:'View All Employees', sub:'Manage your team', to:'/admin/employees', color:'#0ea5e9' },
              { icon:'📋', label:'Project Tracker', sub:'Track tasks & stories', to:'/admin/projects', color:'#7c3aed' },
              { icon:'📊', label:'Reports & Export', sub:'Download employee data', to:'/admin/reports', color:'#059669' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ textDecoration:'none', background:'#f8faff', border:'1px solid #e0e7ff', borderRadius:12, padding:'16px', display:'flex', flexDirection:'column', gap:8, transition:'all 0.15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background=a.color+'12'; e.currentTarget.style.borderColor=a.color+'40' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='#f8faff'; e.currentTarget.style.borderColor='#e0e7ff' }}>
                <div style={{ fontSize:24 }}>{a.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{a.label}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{a.sub}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
