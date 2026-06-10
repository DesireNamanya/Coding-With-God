import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <NavLink to="/" onClick={closeMenu} className="logo-link">
          <div className="logo-wrapper">
            <Code2 size={28} className="logo-icon" />
            <div className="logo-text">
              <span className="brand-name">Coding With God </span>
              <span className="brand-tagline">technology that serves</span>
            </div>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="desktop-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact us
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(90, 6, 22, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <NavLink to="/contact" className="cta-button">
            Get Started
          </NavLink>
        </div>

        {/* Mobile Toggle Button */}
        <button onClick={toggleMenu} className="mobile-toggle" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={closeMenu} className="mobile-nav-link">
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className="mobile-nav-link">
            About
          </NavLink>
          <NavLink to="/products" onClick={closeMenu} className="mobile-nav-link">
            Products
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu} className="mobile-nav-link">
            Contact us
          </NavLink>

          {/* Mobile Theme Toggle Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>Theme</span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'rgba(90, 6, 22, 0.04)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '50%',
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <NavLink to="/contact" onClick={closeMenu} className="mobile-cta-button">
            Get Started
          </NavLink>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
