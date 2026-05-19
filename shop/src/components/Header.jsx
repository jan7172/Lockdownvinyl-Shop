import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-dot" />
          </span>
          <span className="brand-name">
            Lockdownvinyl
            <span className="brand-sub">Shop</span>
          </span>
        </Link>

        <nav className="nav">
          <a href="https://lockdownvinyl.de" className="nav-link">
            ← Zur Hauptseite
          </a>
        </nav>
      </div>
    </header>
  )
}
