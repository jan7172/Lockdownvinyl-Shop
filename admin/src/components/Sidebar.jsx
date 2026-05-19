import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Sidebar() {
  const navigate = useNavigate()
  const links = [
    { to: '/produkte', label: 'Produkte', icon: 'cube' },
    { to: '/einstellungen', label: 'Einstellungen', icon: 'settings' },
  ]
  const logout = () => {
    api.logout()
    navigate('/login', { replace: true })
  }
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-mark" aria-hidden="true"><span className="brand-mark-dot" /></span><div className="sidebar-brand-text"><span className="sidebar-brand-name">Lockdownvinyl</span><span className="sidebar-brand-sub">Adminpanel</span></div></div>
      <nav className="sidebar-nav"><p className="sidebar-nav-label">Verwaltung</p>{links.map((l) => <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><Icon name={l.icon} /><span>{l.label}</span></NavLink>)}</nav>
      <div className="sidebar-foot"><div className="sidebar-user"><div className="sidebar-avatar" aria-hidden="true">AD</div><div className="sidebar-user-text"><span className="sidebar-user-name">Admin</span><span className="sidebar-user-role">Lokal</span></div></div><button className="sidebar-logout" onClick={logout}><Icon name="logout" /><span>Abmelden</span></button></div>
    </aside>
  )
}

function Icon({ name }) {
  const paths = {
    cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.3L5.8 8.5 12 11.7l6.2-3.2L12 5.3zM5 10.1v6.4l6 3.4v-6.4l-6-3.4zm14 0l-6 3.4v6.4l6-3.4v-6.4z',
    settings: 'M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a7.2 7.2 0 0 0-2.6-1.5L14 2h-4l-.4 2.5A7.2 7.2 0 0 0 7 6L4.6 5 2.6 8.5l2 1.5c-.1.5-.1 1-.1 1.5s0 1 .1 1.5l-2 1.5 2 3.5 2.4-1a7.2 7.2 0 0 0 2.6 1.5L10 22h4l.4-2.5A7.2 7.2 0 0 0 17 18l2.4 1 2-3.5-2-1.5zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z',
    logout: 'M16 17l5-5-5-5v3H9v4h7v3zM14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v-2H5V6h9V4z',
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={paths[name]} /></svg>
}
