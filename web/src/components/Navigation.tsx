import { useState, useEffect } from 'react';
import { Sun, Menu, X, Globe, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const wallet = useWallet();

  useEffect(() => {
    wallet.checkConnection();
  }, []);

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

          {wallet.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '13px',
                color: 'var(--secondary)',
                fontFamily: 'monospace',
                maxWidth: '160px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {wallet.publicKey}
              </span>
              <button className="btn btn-outline" onClick={wallet.disconnect} title="Disconnect wallet">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={wallet.connect} disabled={wallet.loading}>
              {wallet.loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}

          {wallet.error && !wallet.connected && (
            <span style={{ fontSize: '12px', color: '#FF6B00', maxWidth: '200px' }}>{wallet.error}</span>
          )}

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