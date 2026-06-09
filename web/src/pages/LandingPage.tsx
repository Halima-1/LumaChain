import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Shield, Settings, History, ArrowRight, Zap, Globe, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <Sun />,
      title: 'Digital Twin Assets',
      description: 'Convert physical solar components into verifiable on-chain NFTs with detailed static metadata.'
    },
    {
      icon: <History />,
      title: 'Immutable Ledger',
      description: 'End-to-end traceability of every transfer, repair, and ownership change throughout the asset lifecycle.'
    },
    {
      icon: <Shield />,
      title: 'Smart Warranty',
      description: 'Self-executing warranty claims with cryptographic proof and automated manufacturer resolution flow.'
    },
    {
      icon: <Settings />,
      title: 'Maintenance Sync',
      description: 'Authorized technicians log service history directly to the asset, creating a permanent reliability score.'
    },
    {
      icon: <Globe />,
      title: 'Supply Chain Registry',
      description: 'Decentralized global directory mapping physical serial numbers to their immutable on-chain identity.'
    },
    {
      icon: <Zap />,
      title: 'Real-time Verification',
      description: 'Instantly verify the authenticity and status of any solar component via mobile or desktop.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-center" style={{ marginBottom: '32px' }}>
              <span className="glass" style={{ padding: '8px 20px', borderRadius: '40px', fontSize: '14px', fontWeight: 600, border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                BETA • NOW LIVE ON TESTNET
              </span>
            </div>
            <h1 className="hero-h1 text-gradient">
              The Transparent Future of <span className="solar-gradient">Solar Supply Chains</span>
            </h1>
            <p className="hero-p">
              LumaChain provides institutional-grade traceability and lifecycle management for solar assets, built natively on the Stellar network.
            </p>
            <div className="flex-center" style={{ gap: '16px' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '16px 32px' }}>
                Enter Application <ArrowRight size={18} />
              </Link>
              <button className="btn btn-outline" style={{ padding: '16px 32px' }}>
                Read Whitepaper
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="feature-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} className="feature-card" variants={itemVariants}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '100px 0', background: 'rgba(255,184,0,0.02)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', textAlign: 'center' }}>
            <div>
              <h2 style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '8px' }}>4,200+</h2>
              <p style={{ color: 'var(--text-dim)' }}>Assets Tracked</p>
            </div>
            <div>
              <h2 style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '8px' }}>128</h2>
              <p style={{ color: 'var(--text-dim)' }}>Manufacturers Joined</p>
            </div>
            <div>
              <h2 style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '8px' }}>$12M+</h2>
              <p style={{ color: 'var(--text-dim)' }}>Warranty Value Managed</p>
            </div>
            <div>
              <h2 style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '8px' }}>0</h2>
              <p style={{ color: 'var(--text-dim)' }}>Counterfeit Assets</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="glass" style={{ padding: '80px', borderRadius: 'var(--radius-xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 60%)', zIndex: -1 }} />
            <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>Ready to illuminate your supply chain?</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Connect your manufacturer identity or start tracking your solar array today on the most secure ledger.
            </p>
            <button className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '16px', margin: '0 auto' }}>
              Launch Developer SDK
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
