import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShieldCheck, 
  Search, 
  Plus, 
  ArrowUpRight,
  MoreVertical,
  Activity,
  Zap,
  Box
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Assets', value: '1,284', icon: <Package size={24} />, change: '+12%', color: 'var(--primary)' },
    { label: 'Active Warranties', value: '942', icon: <ShieldCheck size={24} />, change: '+5%', color: '#00FF94' },
    { label: 'Maintenance Pending', value: '23', icon: <Activity size={24} />, change: '-2%', color: '#FF6B00' },
    { label: 'Energy Generation', value: '4.2 MW', icon: <Zap size={24} />, change: '+18%', color: 'var(--secondary)' },
  ];

  const recentAssets = [
    { 
      id: 'SOL-8291-X', 
      model: 'LumaPrime Gen 3', 
      type: 'Solar Panel', 
      status: 'In Transit', 
      owner: 'GreenHome Solar', 
      date: '2 hours ago',
      serial: 'SN-04928174'
    },
    { 
      id: 'BAT-4420-Y', 
      model: 'LumaStorage XL', 
      type: 'Battery Wall', 
      status: 'Active', 
      owner: 'Self-Custody', 
      date: 'Yesterday',
      serial: 'SN-99281023'
    },
    { 
      id: 'INV-1102-Z', 
      model: 'SmartInvert 500', 
      type: 'Inverter', 
      status: 'Maintenance', 
      owner: 'EcoDistric Inc', 
      date: '3 days ago',
      serial: 'SN-11029384'
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Supply Chain Overview</h1>
          <p style={{ color: 'var(--text-dim)' }}>Monitor your solar asset portfolio and lifecycle events.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline">
            <Search size={18} />
            Search Serial
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Register New Asset
          </button>
        </div>
      </header>

      {/* Stats Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="glass" 
            style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ color: stat.color, background: `${stat.color}15`, padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <span style={{ color: stat.change.startsWith('+') ? '#00FF94' : '#FF6B00', fontSize: '14px', fontWeight: 600 }}>
                {stat.change}
              </span>
            </div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 500 }}>{stat.label}</h3>
            <p style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main Feed */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px' }}>Recent Asset Movements</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>Weekly</button>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--glass-bg)' }}>Monthly</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Asset & Serial</th>
                <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Last Event</th>
                <th style={{ padding: '16px 0', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {recentAssets.map((asset, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <td style={{ padding: '20px 0' }}>
                    <div style={{ fontWeight: 600 }}>{asset.model}</div>
                    <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>{asset.serial}</div>
                  </td>
                  <td style={{ padding: '20px 0', fontSize: '14px' }}>{asset.type}</td>
                  <td style={{ padding: '20px 0' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      background: asset.status === 'Active' ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 184, 0, 0.1)',
                      color: asset.status === 'Active' ? '#00FF94' : 'var(--primary)'
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: '20px 0', color: 'var(--text-dim)', fontSize: '14px' }}>{asset.date}</td>
                  <td style={{ padding: '20px 0' }}><MoreVertical size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary)', marginTop: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            View All Assets <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Side Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', background: 'linear-gradient(135deg, rgba(255,184,0,0.1) 0%, rgba(5,5,6,1) 100%)' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box size={18} color="var(--primary)" /> Smart Minting
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you a manufacturer? Mint your physical components to the LumaChain ledger to enable global tracking.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Launch Minter
            </button>
          </div>

          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Network Security</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,240,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <Activity size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Stellar Testnet</div>
                <div style={{ fontSize: '12px', color: '#00FF94' }}>Connected • 12ms ping</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
              Your transactions are verified by 24 validator nodes across the Soroban network.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
