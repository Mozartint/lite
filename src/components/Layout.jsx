import { Link } from 'react-router-dom'

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="shell">
      <div className="topbar">
        <Link to="/" className="logo">TableTech Lite</Link>
      </div>
      <div className="card page-head">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
