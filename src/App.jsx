import { BrowserRouter, Routes, Route, Navigate, useNavigation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function TopBar() {
  const nav = useNavigation()
  if (nav.state === 'idle') return null
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 99999, background: '#e0e7ff' }}>
      <div style={{ height: '100%', background: '#1e40af', width: '70%', animation: 'topbar 1s ease-in-out infinite alternate' }} />
      <style>{`@keyframes topbar { from { width: 30%; } to { width: 90%; } }`}</style>
    </div>
  )
}

import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import EmployeeList from './pages/admin/EmployeeList'
import CreateEmployee from './pages/admin/CreateEmployee'
import EmployeeDetail from './pages/admin/EmployeeDetail'
import Reports from './pages/admin/Reports'
import ProjectList from './pages/admin/projects/ProjectList'
import ProjectDetail from './pages/admin/projects/ProjectDetail'
import NDAForm from './pages/onboarding/NDAForm'
import DetailsForm from './pages/onboarding/DetailsForm'
import Completion from './pages/onboarding/Completion'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopBar />
        <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} theme="colored" />
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/admin/employees/new" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
          <Route path="/admin/employees/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
          <Route path="/admin/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />

          {/* Employee onboarding routes (public) */}
          <Route path="/onboarding/:token/nda" element={<NDAForm />} />
          <Route path="/onboarding/:token/details" element={<DetailsForm />} />
          <Route path="/onboarding/:token/complete" element={<Completion />} />
          <Route path="/onboarding/:token" element={<Navigate to="nda" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
