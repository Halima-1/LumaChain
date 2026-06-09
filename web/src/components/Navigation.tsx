import { useState, useEffect } from 'react';
import { Sun, Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Assets', path: '/assets' },
    { name: 'Warranty', path: '/warranty' },
    { name: 'Maintenance', path: '/maintenance' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Sun size={20} fill="currentColor" />
          </div>
          <span>LumaChain</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button className="btn btn-outline" title="Documentation">
            <Globe size={18} />
            <span>Docs</span>
          </button>
          <button className="btn btn-primary">
            Connect Wallet
          </button>
          
          <button 
            className="mobile-menu-btn" 
            style={{ display: 'none', color: 'white', background: 'none', border: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div className="logo" style={{ marginBottom: '20px' }}>
              <div className="logo-icon">
                <Sun size={20} fill="currentColor" />
              </div>
              <span>LumaChain</span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
              The golden standard of solar asset traceability and supply chain management.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Protocol</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="nav-link">Smart Contracts</a>
              <a href="#" className="nav-link">SDK</a>
              <a href="#" className="nav-link">API Gateway</a>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Governance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="nav-link">Tokenomics</a>
              <a href="#" className="nav-link">DAO</a>
              <a href="#" className="nav-link">Stake</a>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="nav-link">Help Center</a>
              <a href="#" className="nav-link">Contact</a>
              <a href="#" className="nav-link">Twitter</a>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '14px' }}>
          <p>© 2026 LumaChain. Built on Stellar/Soroban.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
