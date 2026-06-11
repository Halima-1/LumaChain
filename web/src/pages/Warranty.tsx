import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText, ArrowUpRight } from 'lucide-react';

const Warranty = () => {
  const warranties = [
    {
      asset: 'LumaPrime Gen 3',
      serial: 'SN-04928174',
      type: 'Standard 10yr',
      status: 'Active',
      expiry: '2036-04-15',
      claims: 0,
    },
    {
      asset: 'LumaStorage XL',
      serial: 'SN-99281023',
      type: 'Extended 15yr',
      status: 'Active',
      expiry: '2041-08-20',
      claims: 0,
    },
    {
      asset: 'SmartInvert 500',
      serial: 'SN-11029384',
      type: 'Standard 5yr',
      status: 'Claim Pending',
      expiry: '2031-01-10',
      claims: 1,
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Smart Warranty</h1>
        <p style={{ color: 'var(--text-dim)' }}>Self-executing warranty claims with cryptographic proof and automated resolution.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#00FF94', background: 'rgba(0,255,148,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <span style={{ color: '#00FF94', fontSize: '14px', fontWeight: 600 }}>+5%</span>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Active Warranties</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>942</p>
        </motion.div>

        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: 'var(--primary)', background: 'rgba(255,184,0,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <Clock size={24} />
            </div>
            <span style={{ color: '#FF6B00', fontSize: '14px', fontWeight: 600 }}>3 pending</span>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Pending Claims</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>3</p>
        </motion.div>

        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#00FF94', background: 'rgba(0,255,148,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <span style={{ color: '#00FF94', fontSize: '14px', fontWeight: 600 }}>100%</span>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Resolution Rate</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>100%</p>
        </motion.div>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Warranty Registry</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Asset / Serial</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Coverage</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Expiry</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Claims</th>
            </tr>
          </thead>
          <tbody>
            {warranties.map((w, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              >
                <td style={{ padding: '20px 0' }}>
                  <div style={{ fontWeight: 600 }}>{w.asset}</div>
                  <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>{w.serial}</div>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{w.type}</td>
                <td style={{ padding: '20px 0' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: w.status === 'Active' ? 'rgba(0,255,148,0.1)' : 'rgba(255,107,0,0.1)',
                    color: w.status === 'Active' ? '#00FF94' : '#FF6B00',
                  }}>
                    {w.status}
                  </span>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{w.expiry}</td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{w.claims}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', marginTop: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          View All Warranties <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Warranty;