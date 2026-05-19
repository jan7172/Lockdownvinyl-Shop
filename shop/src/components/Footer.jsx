export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-dot" />
          </span>
          <span>Lockdownvinyl · Shop</span>
        </div>

        <nav className="footer-nav">
          <a href="https://lockdownvinyl.de">Hauptseite</a>
          <a href="https://lockdownvinyl.de/#kontakt">Kontakt</a>
          <a href="https://lockdownvinyl.de/impressum">Impressum</a>
          <a href="https://lockdownvinyl.de/privacy">Datenschutz</a>
        </nav>

        <div className="footer-meta">
          © {new Date().getFullYear()} Lockdownvinyl · Castrop-Rauxel
        </div>
      </div>
    </footer>
  )
}
