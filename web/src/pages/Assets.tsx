import React from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ArrowUpRight, Plus } from 'lucide-react';

const Assets = () => {
  const assets = [
    {
      id: 'SOL-8291-X',
      model: 'LumaPrime Gen 3',
      type: 'Solar Panel',
      status: 'In Transit',
      owner: 'GreenHome Solar',
      serial: 'SN-04928174',
      warranty: 'Active',
      generation: '340 kWh',
    },
    {
      id: 'BAT-4420-Y',
      model: 'LumaStorage XL',
      type: 'Battery Wall',
      status: 'Active',
      owner: 'Self-Custody',
      serial: 'SN-99281023',
      warranty: 'Active',
      generation: '—',
    },
    {
      id: 'INV-1102-Z',
      model: 'SmartInvert 500',
      type: 'Inverter',
      status: 'Maintenance',
      owner: 'EcoDistrict Inc',
      serial: 'SN-11029384',
      warranty: 'Claim Pending',
      generation: '180 kWh',
    },
    {
      id: 'SOL-5502-A',
      model: 'LumaPrime Gen 4',
      type: 'Solar Panel',
      status: 'Active',
      owner: 'SunField Corp',
      serial: 'SN-55209183',
      warranty: 'Active',
      generation: '420 kWh',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Asset Registry</h1>
          <p style={{ color: 'var(--text-dim)' }}>Browse, verify, and manage all solar assets on the LumaChain ledger.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-outline">
            <Search size={18} />
            Search Serial
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </header>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Asset / Serial</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Owner</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Warranty</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Generation</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              >
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
                    background: asset.status === 'Active' ? 'rgba(0, 255, 148, 0.1)' : asset.status === 'Maintenance' ? 'rgba(255, 107, 0, 0.1)' : 'rgba(255, 184, 0, 0.1)',
                    color: asset.status === 'Active' ? '#00FF94' : asset.status === 'Maintenance' ? '#FF6B00' : 'var(--primary)',
                  }}>
                    {asset.status}
                  </span>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{asset.owner}</td>
                <td style={{ padding: '20px 0' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: asset.warranty === 'Active' ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 107, 0, 0.1)',
                    color: asset.warranty === 'Active' ? '#00FF94' : '#FF6B00',
                  }}>
                    {asset.warranty}
                  </span>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{asset.generation}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', marginTop: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          View All Assets <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Assets;