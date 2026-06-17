import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Support']

export default function CreateEmployee() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', employee_type: 'permanent',
    department: '', designation: '', joining_date: ''
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required'
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
        toast.error('Failed to create employee.')
      }
    } finally {
      setLoading(false)
    }
  }

  const F = ({ label, name, required, children }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="required">*</span>}</label>
      {children}
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  )

  return (
    <Layout title="Add New Employee" actions={
      <button onClick={() => navigate('/admin/employees')} className="btn btn-secondary">← Back</button>
    }>
      <div style={{ maxWidth: 720 }}>
        <div className="card">
          <div className="card-header">
            <h2>Employee Registration</h2>
          </div>
          <div className="card-body">
            <div className="info-block">
              📧 After submission, an onboarding email with a unique link will be automatically sent to the employee.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <F label="Employee Name" name="name" required>
                  <input className={`form-control ${errors.name ? 'border-red' : ''}`} placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
                </F>
                <F label="Email Address" name="email" required>
                  <input type="email" className="form-control" placeholder="employee@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </F>
                <F label="Mobile Number" name="mobile" required>
                  <input className="form-control" placeholder="+91 9XXXXXXXXX" value={form.mobile} onChange={e => set('mobile', e.target.value)} />
                </F>
                <F label="Employee Type" name="employee_type" required>
                  <select className="form-control" value={form.employee_type} onChange={e => set('employee_type', e.target.value)}>
                    <option value="permanent">Permanent Employee</option>
                    <option value="contract">Contract Employee</option>
                  </select>
                </F>
                <F label="Department" name="department" required>
                  <input list="depts" className="form-control" placeholder="Select or type department" value={form.department} onChange={e => set('department', e.target.value)} />
                  <datalist id="depts">{DEPARTMENTS.map(d => <option key={d} value={d} />)}</datalist>
                </F>
                <F label="Designation" name="designation" required>
                  <input className="form-control" placeholder="e.g. Software Engineer" value={form.designation} onChange={e => set('designation', e.target.value)} />
                </F>
                <F label="Joining Date" name="joining_date" required>
                  <input type="date" className="form-control" value={form.joining_date} onChange={e => set('joining_date', e.target.value)} />
                </F>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? <><span className="spinner" /> Creating...</> : '✉ Create & Send Invitation'}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin/employees')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
