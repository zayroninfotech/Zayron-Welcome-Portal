import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SignatureCanvas from 'react-signature-canvas'
import api from '../../api/axios'

const PERMANENT_NDA = `NON-DISCLOSURE AGREEMENT (PERMANENT EMPLOYEE)

This Non-Disclosure Agreement ("Agreement") is entered into between Zayron Infotech Pvt. Ltd. ("Company") and the undersigned employee.

1. CONFIDENTIAL INFORMATION
The Employee acknowledges that during employment, they will have access to proprietary and confidential information including but not limited to: technical data, trade secrets, know-how, research, product plans, products, services, customers, markets, software, source code, developments, inventions, processes, formulas, technology, designs, marketing, finances, and other business information.

2. NON-DISCLOSURE OBLIGATIONS
The Employee agrees to:
(a) Keep all Confidential Information strictly confidential and not disclose it to any third party without prior written consent.
(b) Use the Confidential Information solely for performing their duties at the Company.
(c) Take all reasonable precautions to prevent unauthorized disclosure.
(d) Notify the Company immediately upon discovery of any unauthorized use or disclosure.

3. INTELLECTUAL PROPERTY
All inventions, innovations, improvements, developments, methods, designs, analyses, reports, and similar information created by the Employee during employment shall be the sole property of the Company.

4. NON-COMPETE CLAUSE
During employment and for one (1) year thereafter, the Employee shall not engage in any competing business activity without prior written consent.

5. NON-SOLICITATION
For one (1) year following termination, the Employee shall not solicit any employee or client of the Company.

6. RETURN OF MATERIALS
Upon termination or upon Company's request, the Employee shall immediately return all materials containing Confidential Information.

7. DURATION
This Agreement remains in effect during employment and for three (3) years after termination.

8. GOVERNING LAW
This Agreement is governed by the laws of India. Disputes shall be subject to courts at the applicable jurisdiction.`

const CONTRACT_NDA = `NON-DISCLOSURE AGREEMENT (CONTRACT EMPLOYEE)

This Non-Disclosure Agreement ("Agreement") is entered into between Zayron Infotech Pvt. Ltd. ("Company") and the undersigned contractor/consultant.

1. CONFIDENTIAL INFORMATION
The Contractor acknowledges receiving proprietary and confidential information including: technical data, trade secrets, know-how, research, product plans, services, customers, client lists, markets, software, developments, inventions, processes, formulas, technology, designs, business strategies, and financial information.

2. NON-DISCLOSURE OBLIGATIONS
The Contractor agrees to:
(a) Keep all Confidential Information strictly confidential during and after the contract period.
(b) Not disclose any Confidential Information without express written consent.
(c) Use the Confidential Information only for the contracted work.
(d) Limit access to Confidential Information to personnel who need it.
(e) Report any unauthorized disclosure immediately.

3. INTELLECTUAL PROPERTY & WORK PRODUCT
All work product, deliverables, inventions, software, code, designs, and outputs created during the engagement are "work made for hire" and are the sole property of the Company. The Contractor assigns all intellectual property rights to the Company.

4. NON-COMPETE
During the engagement and for six (6) months following termination, the Contractor shall not provide services to any direct competitor without prior written approval.

5. NON-SOLICITATION
For one (1) year following termination, the Contractor shall not solicit any employee or client of the Company.

6. DATA PROTECTION
The Contractor agrees to comply with all applicable data protection laws including the Information Technology Act, 2000.

7. RETURN OF MATERIALS
Upon completion or termination, the Contractor shall immediately return or destroy all materials containing Confidential Information.

8. DURATION
Confidentiality obligations survive for three (3) years after termination of engagement.

9. GOVERNING LAW
This Agreement is governed by the laws of India.`

function Steps({ current }) {
  const steps = [
    { label: 'NDA Agreement', num: 1 },
    { label: 'Personal Details', num: 2 },
    { label: 'Complete', num: 3 },
  ]
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <>
          <div className="step" key={s.num}>
            <div className={`step-num ${s.num < current ? 'done' : s.num === current ? 'active' : 'pending'}`}>
              {s.num < current ? '✓' : s.num}
            </div>
            <span className={`step-label ${s.num > current ? 'pending' : ''}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`step-divider ${s.num < current ? 'done' : ''}`} key={`d${i}`} />}
        </>
      ))}
    </div>
  )
}

export default function NDAForm() {
  const { token } = useParams()
  const navigate = useNavigate()
  const sigRef = useRef(null)
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState({
    full_name: '', address: '', mobile: '', aadhaar_number: '',
    emergency_contact: '', signed_date: new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState({})

  useState(() => {
    api.get(`/employees/token/${token}/`).then(r => {
      const emp = r.data
      if (emp.nda_status) { navigate(`/onboarding/${token}/details`); return }
      if (emp.status === 'completed') { navigate(`/onboarding/${token}/complete`); return }
      setEmployee(emp)
      setForm(f => ({ ...f, full_name: emp.name, mobile: emp.mobile }))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [token])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Required'
    if (!form.address.trim()) errs.address = 'Required'
    if (!form.mobile.trim()) errs.mobile = 'Required'
    if (!/^\d{12}$/.test(form.aadhaar_number)) errs.aadhaar_number = 'Must be 12 digits'
    if (!form.emergency_contact.trim()) errs.emergency_contact = 'Required'
    if (!agreed) errs.agreed = 'You must agree to the NDA terms'
    if (sigRef.current?.isEmpty()) errs.signature = 'Please provide your signature'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const signature = sigRef.current.getTrimmedCanvas().toDataURL('image/png')
      await api.post(`/ndas/submit/${token}/`, { ...form, signature })
      toast.success('NDA submitted successfully!')
      navigate(`/onboarding/${token}/details`)
    } catch (err) {
      const d = err.response?.data
      if (d && typeof d === 'object') setErrors(d)
      toast.error(err.response?.data?.error || 'Submission failed. Please try again.')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="loading-page">
      <div className="spinner-dark" style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderRadius: '50%', borderTopColor: '#1e40af', animation: 'spin 0.8s linear infinite' }} />
      <p>Loading...</p>
    </div>
  )

  if (!employee) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 420 }}>
        <h2 style={{ color: 'var(--danger)' }}>Invalid Link</h2>
        <p style={{ color: 'var(--gray-500)', marginTop: 8 }}>This onboarding link is invalid or has expired.</p>
      </div>
    </div>
  )

  const ndaText = employee.employee_type === 'permanent' ? PERMANENT_NDA : CONTRACT_NDA

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="logo">
            <img src="/static/img/logo1.png" alt="Zayron Infotech" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </div>
          <h1>Employee Onboarding</h1>
          <p>Welcome, {employee.name}! Please complete your onboarding.</p>
        </div>

        <Steps current={1} />

        <div className="onboarding-card">
          <div className="onboarding-card-header">
            <h2>Non-Disclosure Agreement</h2>
            <p>Please read the NDA carefully, fill in your details, and sign below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="onboarding-card-body">
              {/* Employee info summary */}
              <div className="info-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div><strong>Name:</strong> {employee.name}</div>
                <div><strong>Type:</strong> {employee.employee_type === 'permanent' ? 'Permanent' : 'Contract'}</div>
                <div><strong>Joining Date:</strong> {employee.joining_date}</div>
              </div>

              {/* NDA Type */}
              <div className="nda-type-badge">
                📋 {employee.employee_type === 'permanent' ? 'Permanent Employee' : 'Contract Employee'} NDA
              </div>

              {/* NDA Content */}
              <div className="nda-content">{ndaText}</div>

              {/* Form fields */}
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--gray-800)' }}>Your Information</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input className="form-control" value={form.full_name} onChange={e => set('full_name', e.target.value)} autoComplete="off" spellCheck={false} />
                  {errors.full_name && <div className="form-error">{errors.full_name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number <span className="required">*</span></label>
                  <input className="form-control" value={form.mobile} onChange={e => set('mobile', e.target.value)} autoComplete="off" spellCheck={false} />
                  {errors.mobile && <div className="form-error">{errors.mobile}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Aadhaar Number <span className="required">*</span></label>
                  <input className="form-control" placeholder="12-digit Aadhaar number" maxLength={12} value={form.aadhaar_number} onChange={e => set('aadhaar_number', e.target.value.replace(/\D/g, ''))} autoComplete="off" spellCheck={false} />
                  {errors.aadhaar_number && <div className="form-error">{errors.aadhaar_number}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact <span className="required">*</span></label>
                  <input className="form-control" placeholder="Emergency contact number" value={form.emergency_contact} onChange={e => set('emergency_contact', e.target.value)} autoComplete="off" spellCheck={false} />
                  {errors.emergency_contact && <div className="form-error">{errors.emergency_contact}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Date <span className="required">*</span></label>
                  <input type="date" className="form-control" value={form.signed_date} onChange={e => set('signed_date', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address <span className="required">*</span></label>
                <textarea className="form-control" rows={3} placeholder="Full residential address" value={form.address} onChange={e => set('address', e.target.value)} />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>

              {/* Agreement checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: '' })) }} style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer' }} />
                <span style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>
                  I have read, understood, and agree to be legally bound by the terms and conditions of this Non-Disclosure Agreement with Zayron Infotech Pvt. Ltd.
                </span>
              </label>
              {errors.agreed && <div className="form-error" style={{ marginTop: -14, marginBottom: 14 }}>{errors.agreed}</div>}

              {/* Signature */}
              <div className="form-group">
                <label className="form-label">Digital Signature <span className="required">*</span></label>
                <div className="sig-pad-wrap">
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#1e3a8a"
                    canvasProps={{ width: 720, height: 140, style: { width: '100%', height: 140 } }}
                  />
                </div>
                {errors.signature && <div className="form-error">{errors.signature}</div>}
                <div className="sig-pad-actions">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => sigRef.current?.clear()}>Clear Signature</button>
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', alignSelf: 'center' }}>Draw your signature in the box above</span>
                </div>
              </div>
            </div>

            <div className="onboarding-card-footer">
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? <><span className="spinner" /> Submitting NDA...</> : '✓ Submit NDA & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
