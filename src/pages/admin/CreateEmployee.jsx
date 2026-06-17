import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Support']

function FormGroup({ label, error, required, hint, children }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}{required && <span className="required">*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{hint}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  )
}

export default function CreateEmployee() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', employee_type: 'permanent',
    department: '', designation: '', joining_date: ''
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required'
    if (!form.department.trim()) errs.department = 'Department is required'
    if (!form.designation.trim()) errs.designation = 'Designation is required'
    if (!form.joining_date) errs.joining_date = 'Joining date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/employees/', form)
      toast.success(`Employee created! Onboarding email sent to ${data.email}.`)
      navigate('/admin/employees')
    } catch (err) {
      const d = err.response?.data
      if (d && typeof d === 'object') {
        setErrors(d)
        toast.error('Please fix the errors and try again.')
      } else {
        toast.error('Failed to create employee. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Add New Employee" actions={
      <button onClick={() => navigate('/admin/employees')} className="btn btn-secondary">← Back to Employees</button>
    }>
      {/* Page intro banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
        borderRadius: 14, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 24, color: 'white'
      }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>New Employee Registration</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 14 }}>
            Register a new employee and automatically trigger their onboarding workflow at Zayron Infotech Pvt. Ltd.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          {[
            { icon: '✉', label: 'Welcome Email', sub: 'Auto-sent' },
            { icon: '📄', label: 'NDA Agreement', sub: 'Digital sign' },
            { icon: '✅', label: 'Onboarding', sub: 'Self-service' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', minWidth: 90 }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, background: 'white', borderRadius: 10, padding: '16px 28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)' }}>
        {[
          { num: 1, label: 'Fill Registration Form', active: true },
          { num: 2, label: 'System Sends Welcome Email' },
          { num: 3, label: 'Employee Signs NDA' },
          { num: 4, label: 'Employee Submits Details' },
          { num: 5, label: 'Onboarding Complete' },
        ].map((s, i, arr) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: s.active ? 'var(--primary)' : 'var(--gray-100)',
                color: s.active ? 'white' : 'var(--gray-400)',
                border: s.active ? '2px solid var(--primary)' : '2px solid var(--gray-200)',
              }}>{s.num}</div>
              <span style={{ fontSize: 11, color: s.active ? 'var(--primary)' : 'var(--gray-400)', fontWeight: s.active ? 600 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ flex: 1, height: 2, background: 'var(--gray-200)', margin: '0 8px', marginBottom: 18 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Main form */}
        <div className="card">
          <div className="card-header" style={{ background: 'var(--gray-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📋</div>
              <div>
                <h2 style={{ margin: 0 }}>Employee Details</h2>
                <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0 }}>All fields marked * are required</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18 }}>📧</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>Welcome Email Will Be Sent Automatically</div>
                <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>A unique onboarding link will be emailed to the employee immediately after registration.</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section: Personal */}
              <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15 }}>👤</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Information</span>
              </div>
              <div className="form-grid" style={{ marginTop: 16 }}>
                <FormGroup label="Employee Full Name" error={errors.name} required hint="As per official ID">
                  <input
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </FormGroup>
                <FormGroup label="Mobile Number" error={errors.mobile} required hint="10-digit Indian mobile">
                  <input
                    className="form-control"
                    placeholder="+91 9XXXXXXXXX"
                    value={form.mobile}
                    onChange={e => set('mobile', e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Official Email Address" error={errors.email} required hint="Onboarding link will be sent to this email">
                <input
                  type="email"
                  className="form-control"
                  placeholder="employee@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </FormGroup>

              {/* Section: Employment */}
              <div style={{ marginTop: 24, marginBottom: 8, paddingBottom: 6, borderBottom: '2px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15 }}>🏢</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employment Details</span>
              </div>
              <div className="form-grid" style={{ marginTop: 16 }}>
                <FormGroup label="Employee Type" error={errors.employee_type} required>
                  <select
                    className="form-control"
                    value={form.employee_type}
                    onChange={e => set('employee_type', e.target.value)}
                  >
                    <option value="permanent">Permanent Employee</option>
                    <option value="contract">Contract / Freelancer</option>
                  </select>
                </FormGroup>
                <FormGroup label="Joining Date" error={errors.joining_date} required>
                  <input
                    type="date"
                    className="form-control"
                    value={form.joining_date}
                    onChange={e => set('joining_date', e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Department" error={errors.department} required>
                  <input
                    list="depts"
                    className="form-control"
                    placeholder="Select or type department"
                    value={form.department}
                    onChange={e => set('department', e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <datalist id="depts">
                    {DEPARTMENTS.map(d => <option key={d} value={d} />)}
                  </datalist>
                </FormGroup>
                <FormGroup label="Designation / Job Title" error={errors.designation} required>
                  <input
                    className="form-control"
                    placeholder="e.g. Software Engineer"
                    value={form.designation}
                    onChange={e => set('designation', e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </FormGroup>
              </div>

              {/* NDA notice */}
              <div style={{
                marginTop: 8, background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>
                    {form.employee_type === 'permanent' ? 'Permanent Employee NDA' : 'Contract Employee NDA'} will be assigned
                  </div>
                  <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>
                    The employee will be required to digitally sign the NDA as part of their onboarding process.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                  {loading
                    ? <><span className="spinner" /> Creating Employee...</>
                    : <> ✉ Create & Send Onboarding Email</>}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin/employees')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* What happens next */}
          <div className="card">
            <div className="card-header" style={{ background: 'var(--gray-50)', padding: '14px 20px' }}>
              <h2 style={{ fontSize: 14 }}>What Happens Next?</h2>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              {[
                { icon: '✉', color: '#3b82f6', bg: '#eff6ff', title: 'Welcome Email Sent', desc: 'Employee receives a personalised welcome email with their unique onboarding link.' },
                { icon: '📄', color: '#7c3aed', bg: '#f5f3ff', title: 'NDA Signing', desc: 'Employee reads and digitally signs the NDA agreement online.' },
                { icon: '📝', color: '#059669', bg: '#f0fdf4', title: 'Personal Details', desc: 'Employee fills personal info and uploads required documents.' },
                { icon: '✅', color: '#d97706', bg: '#fffbeb', title: 'Onboarding Done', desc: 'HR is notified and employee profile is marked complete.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 16 : 0, paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NDA type info */}
          <div className="card">
            <div className="card-header" style={{ background: 'var(--gray-50)', padding: '14px 20px' }}>
              <h2 style={{ fontSize: 14 }}>NDA Type Guide</h2>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ background: '#ede9fe', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4c1d95' }}>🔵 Permanent Employee</div>
                <div style={{ fontSize: 12, color: '#5b21b6', marginTop: 4, lineHeight: 1.5 }}>Full-time staff. NDA covers 3 years post-employment with 1-year non-compete.</div>
              </div>
              <div style={{ background: '#fce7f3', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#831843' }}>🟣 Contract / Freelancer</div>
                <div style={{ fontSize: 12, color: '#9d174d', marginTop: 4, lineHeight: 1.5 }}>Project-based staff. NDA covers 3 years post-contract with 6-month non-compete.</div>
              </div>
            </div>
          </div>

          {/* Required docs reminder */}
          <div className="card">
            <div className="card-header" style={{ background: 'var(--gray-50)', padding: '14px 20px' }}>
              <h2 style={{ fontSize: 14 }}>Employee Will Need to Upload</h2>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              {['Photograph (passport size)', 'Resume / CV', 'Aadhaar Card copy', 'PAN Card copy', 'Educational Certificates'].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 4 ? 10 : 0, fontSize: 13, color: 'var(--gray-600)' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span> {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
