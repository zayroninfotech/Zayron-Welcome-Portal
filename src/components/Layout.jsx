import Sidebar from './Sidebar'

export default function Layout({ title, actions, children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>{title}</h1>
          {actions && <div className="page-actions">{actions}</div>}
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
