function Header() {
  return (
    <header className="site-header">
      <a href="/" className="brand">
        <span className="brand-icon">◷</span>
        <span>WORLD<span className="brand-highlight">CLOCK</span></span>
      </a>

      <div className="header-credit">
        Developed by <span>Hassan Naveed</span>
      </div>

      <div className="header-status">
        <span className="status-dot" />
        LIVE WORLD TIME
      </div>
    </header>
  )
}

export default Header